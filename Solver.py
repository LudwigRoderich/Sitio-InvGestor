from flask import Flask, request, jsonify
from ortools.linear_solver import pywraplp

app = Flask(__name__)

@app.route('/')
def home():
    return "Bienvenido a la API de optimización"

@app.route('/optimize', methods=['POST'])
def optimize():

    data = request.json

    return optimiceCP_SAT(data)

def optimiceCP_SAT(data):
    from ortools.sat.python import cp_model
    from flask import jsonify  # Import necesario para la respuesta en formato JSON

    print("Optimización CP_SAT")

    # Extraer los datos y booleanos de `data`
    precio_produccion = data['precio_produccion']
    aumento_produccion = data['aumento_produccion']
    precio_venta = data['precio_venta']
    variable_maxima_produccion = data['variable_maxima_produccion']
    arreglo_maxima_produccion = data['arreglo_maxima_produccion']
    variable_demanda = data['variable_demanda']
    arreglo_demanda = data['arreglo_demanda']
    variable_costo_almacenamiento = data['variable_costo_almacenamiento']
    arreglo_costo_almacenamiento = data['arreglo_costo_almacenamiento']
    aumento_almacenamiento = data['aumento_almacenamiento']
    cantidad_productos = data['cantidad_productos']
    cantidad_intervalos = int(data['cantidad_dias'] // data['intervalo_dias'])
    objetivo = data['objetivo']
    capacidad_almacenamiento = data['capacidad_almacenamiento']
    promedio_venta = data['promedio_venta']

    # Booleanos de configuración
    bool_aumento_produccion = data['bool_aumento_produccion']
    bool_precio_venta = data['bool_precio_venta']
    bool_maxima_produccion = data['bool_maxima_produccion']
    bool_maxima_produccion_constante = data['bool_maxima_produccion_constante']
    bool_demanda_constante = data['bool_demanda_constante']
    bool_costo_almacenamiento_constante = data['bool_costo_almacenamiento_constante']
    bool_aumento_almacenamiento = data['bool_aumento_almacenamiento']

    # Crear el modelo CP-SAT
    model = cp_model.CpModel()

    # Definir variables de decisión X y Y (para almacenamiento)
    X = {}
    Y = {}
    P = []
    R = []
    V = []
    # Crear variables
    for i in range(cantidad_intervalos):
        for j in range(cantidad_productos):
            limite_superior = variable_maxima_produccion if bool_maxima_produccion_constante else arreglo_maxima_produccion[j] if bool_maxima_produccion else 100000
            maximo_almacenamiento_por_periodo = capacidad_almacenamiento if capacidad_almacenamiento > 0 else 100000

            X[i, j] = model.NewIntVar(0, limite_superior, f'X({i},{j})')
            if i > 0:
                Y[i, j] = model.NewIntVar(0, maximo_almacenamiento_por_periodo, f'Y({i},{j})')

    # Configurar la función objetivo
    objective = 0
    objective_str = f"{objetivo.capitalize()}: "
    ganancias = 0

    for i in range(cantidad_intervalos):
        P.append([])
        R.append([])
        V.append([])
        
        for j in range(cantidad_productos):
        
            # Coeficientes de producción y almacenamiento
            p_i_j = precio_produccion[j]*(1 + i * aumento_produccion[j]) if bool_aumento_produccion else precio_produccion[j]
            p_venta = precio_venta[j] if bool_precio_venta else precio_produccion[j]
            ganancias += p_venta * promedio_venta[j]
            
            r_i_j = variable_costo_almacenamiento if bool_costo_almacenamiento_constante else arreglo_costo_almacenamiento[j]
            
            if bool_aumento_almacenamiento:
                r_i_j *= (1 + i * aumento_almacenamiento[j])

            P[i].append(p_i_j)
            R[i].append(r_i_j)
            V[i].append(p_venta)

            if objetivo == "maximizar":
                objective += -p_i_j * X[i, j]
                if i > 0:
                    objective += -r_i_j * Y[i, j]
            elif objetivo == "minimizar":
                objective += p_i_j * X[i, j]
                if i > 0:
                    objective += r_i_j * Y[i, j]

            # Crear string de la función objetivo
            coef_p = round(-p_i_j if objetivo == "maximizar" else p_i_j, 2)
            coef_r = round(-r_i_j if objetivo == "maximizar" else r_i_j, 2)

            objective_str += f"{coef_p} * X({i}, {j}) + "
            if i > 0:
                objective_str += f"{coef_r} * Y({i}, {j}) + "

    # Establecer la función objetivo en el modelo
    if objetivo == "maximizar":
        model.Maximize(objective)
    elif objetivo == "minimizar":
        model.Minimize(objective)

    objective_str = objective_str.rstrip(" +")

    # Definir restricciones
    for i in range(cantidad_intervalos):
        for j in range(cantidad_productos):

            demanda = variable_demanda if bool_demanda_constante else arreglo_demanda[j]
            if i > 0:
                model.Add(Y[i, j] <= capacidad_almacenamiento)

            if i == 0:
                model.Add(X[i, j] - Y[i + 1, j] >= max(promedio_venta[j], demanda))
            elif i < cantidad_intervalos - 1:
                model.Add(X[i, j] + Y[i, j] - Y[i + 1, j] >= max(promedio_venta[j], demanda))
            else:
                model.Add(X[i, j] + Y[i, j] >= max(promedio_venta[j], demanda))

    # Crear y resolver el solver CP-SAT
    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        calculated_objective_value = 0
        for i in range(cantidad_intervalos):
            for j in range(cantidad_productos):
                p_i_j = P[i][j]  
                if i > 0:
                    r_i_j = R[i][j] 
                else:
                    r_i_j = 0

                
                calculated_objective_value += p_i_j * solver.Value(X[i, j])
                if i > 0:
                    calculated_objective_value += r_i_j * solver.Value(Y[i, j])

        gasto_total = 0
        venta_total = 0
        for i in range(cantidad_intervalos):
            for j in range(cantidad_productos):
                gasto_total += P[i][j] * solver.Value(X[i, j])
                venta_total += V[i][j] * promedio_venta[j]
                if i > 0:
                    gasto_total += R[i][j] * solver.Value(Y[i, j])

        ganancia_esperada = max(venta_total - gasto_total, 0)
        perdida_esperada = max(gasto_total - venta_total, 0)

        # Calcular el vector de ganancias por producto
        ganancias_por_producto = []
        for j in range(cantidad_productos):
            venta_total_producto = 0
            gasto_total_producto = 0

            for i in range(cantidad_intervalos):
                venta_total_producto += V[i][j] * promedio_venta[j]
                gasto_total_producto += P[i][j] * solver.Value(X[i, j])
                if i > 0:
                    gasto_total_producto += R[i][j] * solver.Value(Y[i, j])

            ganancia_producto = venta_total_producto - gasto_total_producto
            ganancias_por_producto.append(ganancia_producto)

        solution = {
            'status': 'optimal' if status == cp_model.OPTIMAL else 'feasible (not optimal)',
            'X': {f'X_{i}_{j}': solver.Value(X[i, j]) for i in range(cantidad_intervalos) for j in range(cantidad_productos)},
            'Y': {f'Y_{i}_{j}': solver.Value(Y[i, j]) for i in range(1, cantidad_intervalos) for j in range(cantidad_productos)},
            'objective_value': round(calculated_objective_value - ganancias, 2) if objetivo == "minimizar" else round(ganancias - calculated_objective_value, 2),  # Valor manual calculado
            'objective_function': objective_str,
            'gasto_total': gasto_total,
            'ganancia_esperada': ganancia_esperada,
            'perdida_esperada': perdida_esperada,
            'ganancias_por_producto': ganancias_por_producto,
        }
        return jsonify(solution)
    
    else:
        return jsonify({'status': 'no feasible solution'})


if __name__ == '__main__':
    app.run(debug=True)
