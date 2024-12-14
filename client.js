console.log
const datosRecuperados = {
    nombres: [],
    precioCompra: [],
    aumentoCompra: [],
    precioVenta: [],
    max_proveedor: [],
    costo_almacenamiento: [],
    aumento_almacenamiento: [],
    demandas: [],
    promedioVenta: []
}
let data;
let indice = 2;
let startTime;
let data1, resultados;




function recuperarData(){

    const compra = document.getElementById("p_produccion2").checked;
    const venta = document.getElementById("p_venta2").checked;
    const limite_proveedor = document.getElementById("proveedor2").checked && document.getElementById("proveedor3").checked;
    const alm_precio_producto = document.getElementById("coste_almacenamiento1").checked;
    const alm_precio_tiempo = document.getElementById("aumento_almacenamiento2").checked;
    const demanda = document.getElementById("demanda1").checked;

    const tabla = document.getElementById("inputTable");
    for (let key in datosRecuperados) {
        if (datosRecuperados.hasOwnProperty(key)) {
            datosRecuperados[key] = [];
        }
    }

    for(let i=1; i<tabla.rows.length; i++){
        
        const fila = tabla.rows[i];
        let indice = 2;

        datosRecuperados.nombres.push(fila.cells[0].children[0].value);

        const pC = fila.cells[1].children[0].value == "" ? -1 : fila.cells[1].children[0].valueAsNumber;
        datosRecuperados.precioCompra.push(pC);
        

        if(compra){
            const aC = fila.cells[indice].children[0].value == "" ? -1 : fila.cells[indice].children[0].valueAsNumber;
            datosRecuperados.aumentoCompra.push(aC);
            indice++;
        }
        if(venta){
            const pV = fila.cells[indice].children[0].value == "" ? -1 : fila.cells[indice].children[0].valueAsNumber;
            datosRecuperados.precioVenta.push(pV);
            indice++;
        }

        const promedioVenta = fila.cells[indice].children[0].value == "" ? -1 : fila.cells[indice].children[0].valueAsNumber;
        datosRecuperados.promedioVenta.push(promedioVenta);
        indice++;

        if(limite_proveedor){
            const mP = fila.cells[indice].children[0].value  == "" ? -1 : parseInt(fila.cells[indice].children[0].valueAsNumber);
            datosRecuperados.max_proveedor.push(parseInt(mP));
            indice++;
        }
        if(demanda){
            const dem = fila.cells[indice].children[0].value == "" ? -1 : parseInt(fila.cells[indice].children[0].valueAsNumber);
            datosRecuperados.demandas.push(parseInt(dem));
            indice++;
        }
        if(alm_precio_producto){
            const apP = fila.cells[indice].children[0].value == "" ? -1 : fila.cells[indice].children[0].valueAsNumber;
            datosRecuperados.costo_almacenamiento.push(apP);
            indice++;
        }
        if(alm_precio_tiempo){
            const apT = fila.cells[indice].children[0].value == "" ? -1 : fila.cells[indice].children[0].valueAsNumber;
            datosRecuperados.aumento_almacenamiento.push(apT);
            indice++;
        }
    }
}

function borrarData(){
    const tabla = document.getElementById("inputTable");
    const numColumnas = tabla.rows[0].cells.length;
    for(let i=1; i<tabla.rows.length; i++){
        const fila = tabla.rows[i];
        for(let j=0; j<numColumnas; j++){
            fila.cells[j].children[0].value = ""; 
        }
    }
    for (let key in datosRecuperados) {
        if (datosRecuperados.hasOwnProperty(key)) {
            datosRecuperados[key] = [];
        }
    }

    desmarcarCasillas();

}

function validarData(){
    
    let datosValidos = true;
    
    const cantidad_productos = document.getElementById("cant_productos2").checked ? document.getElementById("cant_productos3").value : 1;
    const compra = document.getElementById("p_produccion2").checked;
    const venta = document.getElementById("p_venta2").checked;
    const limite_proveedor = document.getElementById("proveedor2").checked && document.getElementById("proveedor3").checked;
    const alm_precio_producto = document.getElementById("coste_almacenamiento1").checked;
    const alm_precio_tiempo = document.getElementById("aumento_almacenamiento2").checked;
    const demanda_constante = document.getElementById("demanda2").checked;
    
    const tabla = document.getElementById("inputTable");
    
    desmarcarCasillas();
    
    for(let i=0; i<cantidad_productos; i++){
        
        indice = 2;
        
        if(datosRecuperados.nombres[i] == ''){
            datosRecuperados.nombres[i] = "Producto " + (i+1);
        }
        
        if(datosRecuperados.precioCompra[i] <= 0){
            marcarCasilla(i, 1)
        }

        if(compra){
            if(datosRecuperados.aumentoCompra[i] < 0 || 1 < datosRecuperados.aumentoCompra[i]){ 
                marcarCasilla(i, indice);
            }
            indice = indice + 1;
        }
        
        if(venta){
            if(datosRecuperados.precioVenta[i] <= 0 || datosRecuperados.precioVenta[i] < datosRecuperados.precioCompra[i]){
                marcarCasilla(i, indice);
            }
            indice = indice + 1;
        }

        if(datosRecuperados.promedioVenta[i] <= 0){
            marcarCasilla(i, indice);
        }
        indice++;
        
        if(limite_proveedor){
            if(datosRecuperados.max_proveedor[i] <= 0){
                marcarCasilla(i, indice);
            }
            indice = indice + 1;
        }

        if(demanda_constante){
            if(parseInt(document.getElementById("demanda3").valueAsNumber) < 0){
                marcarCasilla(i, indice);
            }
            indice = indice + 1;
        }
        else{
            if(datosRecuperados.demandas[i] < 0){
                marcarCasilla(i, indice);
            }
            indice = indice + 1;
        }
        
        if(alm_precio_producto){
            if(datosRecuperados.costo_almacenamiento[i] <= 0){
                marcarCasilla(i, indice);
            }
            indice = indice + 1;
        }
        
        if(alm_precio_tiempo){
            if(datosRecuperados.aumento_almacenamiento[i] < 0 || 1 < datosRecuperados.aumento_almacenamiento){
                marcarCasilla(i, indice);
            }
            indice = indice + 1;
        }
        
    }
    
    function marcarCasilla(id, jd){
        tabla.rows[id+1].cells[jd].children[0].value = "";
        tabla.rows[id+1].cells[jd].children[0].style.border = "2px solid red";
        datosValidos = false;
        let inputField = tabla.rows[id+1].cells[jd].children[0];
        inputField.addEventListener('focus', function resetBorder() {
            inputField.style.border = "1px solid #ccc";
            inputField.removeEventListener('focus', resetBorder);
        });
    }
    if(!datosValidos){
        alert('Hay valores inválidos en las entradas, revise la sección de ayuda para más información')
    }
    return datosValidos;
    
}

function calcularValoresOptimos(){
    
    recuperarData();
    if(validarData()){
        sendDataToServer();
    }
    else{
        alert("¡Data Inválida, no se puede enviar!");
    }

}

function sendDataToServer() {
    startTimer();

    crearData();

    fetch('http://localhost:3000/api/optimize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        data1 = data;
        resultados = result;
        document.getElementById("b4").disabled = false;
        renderResultados(data, result);
    })
    .catch(error => {
    console.error('Error:', error)
    stopTimer();
}
    
);
}


function renderResultados(data, resultados) {
    const resultadosDiv = document.querySelector('.resultados');
    resultadosDiv.style.display = 'block';
    
    
    resultadosDiv.innerHTML = '';
    const estado = resultados.status || 'Desconocido';
    const valorOptimo = Math.abs(resultados.objective_value).toFixed(3) || 'No se obtuvieron resultados :/';
    const ganancia_esperada = resultados.ganancia_esperada ? resultados.ganancia_esperada.toFixed(2) : 0;
    const gasto_total = resultados.gasto_total ? resultados.gasto_total.toFixed(2) : 0;
    const perdida_esperada = resultados.perdida_esperada ? resultados.perdida_esperada.toFixed(2) : 0;
    const textoObjetivo = data.objetivo === 'minimizar' 
        ? 'Costo mínimo esperado' 
        : 'Ganancia máxima esperada';

    
    resultadosDiv.innerHTML = `
        <div class="resultado-tiempo">
            <h3>Tiempo Requerido</h3>
            <p id="tiempo-ejecucion">00:00.0000</p>
        </div>
        
         <div class="resultado-valor-optimo">
            <h3>Gasto Total Estimado</h3>
            <p>${gasto_total}</p>
        </div>
         <div class="resultado-valor-optimo">
            <h3>Pérdida Total Estimada</h3>
            <p id="valor-optimo">${perdida_esperada}</p>
        </div>
         <div class="resultado-valor-optimo">
            <h3>Ganancia Total Estimada</h3>
            <p id="valor-optimo">${ganancia_esperada}</p>
        </div>
        <div class="resultado-valor-optimo">
            <h3>Capacidad Máxima del Almacén</h3>
            <p id="cap_Max">${data.capacidad_almacenamiento}</p>
        </div>
    `;

    for (let i = 0; i < data.cantidad_productos; i++) {
        const nombreProducto = data.nombres[i] || `Producto ${i + 1}`;
        const hay_demanda = data.bool_demanda_constante 
                ? (data.variable_demanda !== -1 ? data.variable_demanda : false)
                : (data.arreglo_demanda.some(d => d !== 0) ? data.arreglo_demanda[i] : false)

        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto';
        
        const detallesProducto = `
            <h3 style="color: black; font-weight: bold;">${nombreProducto}</h3>
            ${data.bool_aumento_produccion ? `<p>Aumento en producción: <b>${(data.aumento_produccion[i]*100).toFixed(1)}%</b></p>` : ''}
            ${(hay_demanda && data.bool_demanda_constante) ? `<p>Demanda minima en todo periodo: <b>${data.variable_demanda}</b></p>` : ''}
            ${!data.bool_aumento_almacenamiento ? `<p>Costo de almacenamiento en todo periodo: <b>${data.bool_costo_almacenamiento ? data.variable_costo_almacenamiento : data.arreglo_costo_almacenamiento[i]}</b></p>` : ''}
            ${true ? `<p>Cantidad esperada a vender por periodo: <b>${data.promedio_venta[i]}</b></p>` : ''}
            ${data.bool_maxima_produccion 
                ? (data.bool_maxima_produccion_constante 
                    ? `<p>Cantidad Máxima a Producir Por Periodo: <b>${data.variable_maxima_produccion}</b></p>` 
                    : `<p>Cantidad Máxima a Producir Por Periodo: <b>${data.arreglo_maxima_produccion[i]}</b></p>`) 
                : ''}
            <p>Ganancia Estimada Por Este Producto (Un valor negativo es pérdida): <b>${(resultados.ganancias_por_producto[i]).toFixed(2)}</b></p>
        `;

        productoDiv.innerHTML = detallesProducto;

        const tabla = document.createElement('table');
        tabla.className = 'tabla-resultado';
        
        const header = document.createElement('thead');
        header.innerHTML = `
            <tr>
                <th>Periodo</th>
                ${data.bool_precio_venta ? '<th>Precio de Compra (P)</th>' : '<th>Precio de Compra/Venta (P)</th>'}
                <th>Cantidad a Comprar (X)</th>
                ${data.bool_precio_venta ? '<th>Precio de Venta (V)</th>' : ''}
                ${(hay_demanda && !data.bool_demanda_constante) ? '<th>Demanda</th>' : ''}
                <th>Cantidad a Almacenar (Y)</th>
            </tr>`;

        tabla.appendChild(header);
        
        const tbody = document.createElement('tbody');
        for (let j = 0; j < data.cantidad_dias / data.intervalo_dias; j++) {
            const row = document.createElement('tr');
            const compra = parseInt(resultados['X'][`X_${j}_${i}`] || 0);
            const almacenamiento = j == data.cantidad_dias - 1
                ? 0
                : resultados['Y'][`Y_${j+1}_${i}`] || 0;
            
            row.innerHTML = `
                <td>${j + 1}</td>
                <td>${data.bool_aumento_produccion ? ((1 + j*data.aumento_produccion[i])*data.precio_produccion[i]).toFixed(3) : (data.precio_produccion[i]).toFixed(3)}</td>
                <td>${compra}</td>
                ${data.bool_precio_venta ? `<td>${data.precio_venta[i]}</td>` : ''}
                ${(hay_demanda && !data.bool_demanda_constante) ? `<td>${hay_demanda}</td>` : ''}
                <td>${almacenamiento}</td>
                
            `;
               
            tbody.appendChild(row);
        }
        
        tabla.appendChild(tbody);
        productoDiv.appendChild(tabla);
        resultadosDiv.appendChild(productoDiv);
    }
    stopTimer();
}




// Referente al front-end
function activarOpcionesGenerales(){

    function activarCantidadProductos(){

        const rbCant_productos = document.getElementById("cant_productos2");
        const entCant_productos3 = document.getElementById("cant_productos3");

        function activarCampo(){
            if(rbCant_productos.checked){
                entCant_productos3.disabled = false;
            }
            else{
                entCant_productos3.value = "";
                entCant_productos3.disabled = true;
            }
        }

        const btn_cant_productos = document.querySelectorAll('input[name="cant_productos"]');
        btn_cant_productos.forEach(radio => {
            radio.addEventListener("change", activarCampo);
        })

        activarCampo();
    }

    function activarCapacidadLimitada(){
        const rbA1 = document.getElementById("almacen2");
        const entA2 = document.getElementById("almacen3");

        function activar(){
            if(rbA1.checked){
                entA2.disabled = false;
            }
            else{
                entA2.value = "";
                entA2.disabled = true;
            }
        }

        const radioButtons = document.querySelectorAll('input[name="almacen"]');
        radioButtons.forEach(radio => {
            radio.addEventListener("change", activar);
        });

        activar();
    }

    function activarPeriodoTiempoPersonalizado(){
        
        const rbtiempo_total5 = document.getElementById(("tiempo_total5"));
        const enttiempo_total6 = document.getElementById("tiempo_total6");

        function activar(){
            if(rbtiempo_total5.checked){
                enttiempo_total6.disabled = false;
            }
            else{
                enttiempo_total6.value = "";
                enttiempo_total6.disabled = true;
            }
        }

        const radioButtons = document.querySelectorAll('input[name="tiempo_total"]');
        radioButtons.forEach(radio => {
            radio.addEventListener("change", activar);
        });

        activar();
    }

    function activarIntervaloTiempoPersonalizado(){
        
        const rbTiempo_intervalo6 = document.getElementById(("tiempo_intervalo6"));
        const entTiempo_intervalo7 = document.getElementById("tiempo_intervalo7");

        function activar(){
            if(rbTiempo_intervalo6.checked){
                entTiempo_intervalo7.disabled = false;
            }
            else{
                entTiempo_intervalo7.value = "";
                entTiempo_intervalo7.disabled = true;
            }
        }

        const radioButtons = document.querySelectorAll('input[name="tiempo_intervalo"]');
        radioButtons.forEach(radio => {
            radio.addEventListener("change", activar);
        });

        activar();
    }

    function activarLimiteProveedor(){
        const rbproveedor2 = document.getElementById("proveedor2");
        const rbproveedor3 = document.getElementById("proveedor3");
        const rbproveedor4 = document.getElementById("proveedor4");
        const entProveedor5 = document.getElementById("proveedor5");

        function activar(){
            if(rbproveedor2.checked){
                rbproveedor4.disabled = false;
                rbproveedor3.disabled = false;
                rbproveedor3.checked = true;
            }
            else{ 
                rbproveedor4.disabled = true;
                rbproveedor3.disabled = true;
                rbproveedor4.checked = false;
                rbproveedor3.checked = false;
            }
        }

        function limite(){
            if(rbproveedor4.checked){
                entProveedor5.disabled = false;
            }
            else{
                entProveedor5.value = "";
                entProveedor5.disabled = true;
            }
        }

        const radioButton = document.querySelectorAll('input[name="proveedor"]');
        radioButton.forEach(radio => {
            radio.addEventListener("change", activar);
        });

        const radioButton2 = document.querySelectorAll('input[name="sublista"]');
        radioButton2.forEach(radio => {
            radio.addEventListener("change", limite);
        });

        activar(); 
        limite();
    }

    function activarPrecioAlmacenamiento(){
        const rbCoste_almacenamiento2 = document.getElementById("coste_almacenamiento2");
        const entCoste_almacenamiento3 = document.getElementById("coste_almacenamiento3");

        function activar(){
            if(rbCoste_almacenamiento2.checked){
                entCoste_almacenamiento3.disabled = false;
            }
            else{
                entCoste_almacenamiento3.value = "";
                entCoste_almacenamiento3.disabled = true;
            }
        }

        const radioButton = document.querySelectorAll('input[name="coste_almacenamiento"]');
        radioButton.forEach(radio => {
            radio.addEventListener("change", activar);
        });

        activar();
    }

    function activarDemanda(){
        const rbD2 = document.getElementById("demanda2");
        const entD3 = document.getElementById("demanda3");

        function activar(){
            if(rbD2.checked){
                entD3.disabled = false;
            }
            else{
                entD3.value = "";
                entD3.disabled = true;
            }
        }

        const radioButtons = document.querySelectorAll('input[name="demanda"]');
        radioButtons.forEach(radio => {
            radio.addEventListener("change", activar);
        });

        activar();
    }


    activarCantidadProductos();
    activarCapacidadLimitada();
    activarIntervaloTiempoPersonalizado();
    activarLimiteProveedor();
    activarPeriodoTiempoPersonalizado();
    activarPrecioAlmacenamiento();
    activarDemanda();
}
function desmarcarCasillas(){
        
    const tabla = document.getElementById("inputTable");
    let n = tabla.rows.length;
    let m = tabla.rows[0].cells.length;
    for(let i=1; i<n; i++){
        for(let j=0; j<m; j++){
            tabla.rows[i].cells[j].children[0].style.border = "1px solid #ccc";
        }
    }
}
function crearTabla() { 
    const cantidad_productos = document.getElementById("cant_productos2").checked ? document.getElementById("cant_productos3").valueAsNumber : 1;
    const compra = document.getElementById("p_produccion2").checked;
    const venta = document.getElementById("p_venta2").checked;
    const limite_proveedor = document.getElementById("proveedor2").checked && document.getElementById("proveedor3").checked;
    const alm_precio_producto = document.getElementById("coste_almacenamiento1").checked;
    const alm_precio_tiempo = document.getElementById("aumento_almacenamiento2").checked;
    const demanda_variable = document.getElementById("demanda1").checked;

    const tabla = document.getElementById("inputTable");
    document.getElementById("textoTabla").innerText = "Ingrese los datos del problema";
    document.getElementById("calculate").style.display = "block";
    document.getElementById("restart").style.display = "block";
    
    limpiarTabla();
    crearEncabezado();

    for (let i = 0; i < cantidad_productos; i++) {

        const filaNueva = tabla.insertRow(-1);

        let nombre = filaNueva.insertCell(-1);
        let precio = filaNueva.insertCell(-1);
        
        nombre.innerHTML = `<input type="text" name="product_name" placeholder="Opcional" >`;
        precio.innerHTML = `<input type="number" name="buy_price" min="0" placeholder="Precio Producción" required>`;
        
        if (compra) {
            let aumento_compra = filaNueva.insertCell(-1);
            aumento_compra.innerHTML = `<input type="number" name="rise_cost" min="0" max="1" placeholder="0.05 para 5%" required>`;
        }

        if (venta) {
            let precioVenta = filaNueva.insertCell(-1);
            precioVenta.innerHTML = `<input type="number" name="sell_price" min="0" placeholder="Precio de venta" required>`; 
        }

        let promedioVenta = filaNueva.insertCell(-1);
        promedioVenta.innerHTML = `<input type="number" name="avg_sell" min="0" placeholder="Venta aproximada por periodo" required>`;

        if (limite_proveedor) {
            let limiteProv = filaNueva.insertCell(-1);
            limiteProv.innerHTML = `<input type="number" name="storage_cost" min="0" placeholder="Limite" required>`;
        }

        if (demanda_variable) {
            let demanda = filaNueva.insertCell(-1);
            demanda.innerHTML = `<input type="number" name="demanda_producto" min="0" placeholder="Demanda por intervalo" required>`;
        }

        if (alm_precio_producto) {
            let alm_producto = filaNueva.insertCell(-1);
            alm_producto.innerHTML = `<input type="number" name="proveedor" min="0" placeholder="Ejemplo: 2.5" required>`;
            
        }
        if (alm_precio_tiempo) {
            let aumentoAlmacenamiento = filaNueva.insertCell(-1);
            aumentoAlmacenamiento.innerHTML = `<input type="number" name="rise_storage" min="0" max="1" placeholder="0.05 para 5%" required>`;
        }
    }
    

    function limpiarTabla(){
        const tabla = document.getElementById("inputTable");

        while(tabla.rows.length > 0){
            tabla.deleteRow(0);
        }
    }

    function crearEncabezado(){
        const tabla = document.getElementById("inputTable");
        let headerRow = tabla.insertRow(0);
        let newColumn;
        
        newColumn = document.createElement("th");
        newColumn.innerText = "Nombre";
        headerRow.appendChild(newColumn);

        newColumn = document.createElement("th");
        newColumn.innerText ="Precio Producción";
        headerRow.appendChild(newColumn);

        
        
        if(compra){
            newColumn = document.createElement("th");
            newColumn.innerText ="Aumento Producción";
            headerRow.appendChild(newColumn);
        }
        if(venta){
            newColumn = document.createElement("th");
            newColumn.innerText ="Precio Venta";
            headerRow.appendChild(newColumn);
        }

        newColumn = document.createElement("th");
        newColumn.innerText ="Promedio de venta";
        headerRow.appendChild(newColumn);
        if(limite_proveedor){
            newColumn = document.createElement("th");
            newColumn.innerText ="Máxima Producción";
            headerRow.appendChild(newColumn);
        }
        if (demanda_variable) {
            newColumn = document.createElement("th");
            newColumn.innerText = "Demanda Por Intervalo";    
            headerRow.appendChild(newColumn);
        }
        if(alm_precio_producto){
            newColumn = document.createElement("th");
            newColumn.innerText ="Costo De Almacenamiento";
            headerRow.appendChild(newColumn);
        }
        if(alm_precio_tiempo){
            newColumn = document.createElement("th");
            newColumn.innerText ="Aumento Almacenamiento";
            headerRow.appendChild(newColumn);
        }

    }
}
function usarConfiguracion() {
    let datosValidos = true;

    const obtenerValorSeleccionado = (selector) => {
        const elemento = document.querySelector(selector);
        return elemento;
    };

    const validarEntradaNumerica = (id, min, max = Infinity, mensajeError) => {
        const elemento = document.getElementById(id);
        const valor = elemento.value ? elemento.valueAsNumber : -1;
        
        if (valor < min || valor > max) {
            elemento.style.border = "2px solid red";
            elemento.addEventListener('focus', function resetBorder() {
                elemento.style.border = "2px solid #ccc";
                elemento.removeEventListener('focus', resetBorder);
            });
            console.error("Error: ", mensajeError);

            datosValidos = false;
            return null;
        }
        return valor;
    };

    const deseo = obtenerValorSeleccionado('input[name="tipo_optimizacion"]:checked');
    const cprod = obtenerValorSeleccionado('input[name="cant_productos"]:checked');
    const venta = obtenerValorSeleccionado('input[name="p_venta"]:checked');
    const compra = obtenerValorSeleccionado('input[name="p_produccion"]:checked');

    const almacenamiento = obtenerValorSeleccionado('input[name="almacen"]:checked');
    const proveedor2 = obtenerValorSeleccionado('input[name="proveedor"]:checked');
    const proveedor3 = obtenerValorSeleccionado('input[name="sublista"]:checked');
    const almacenamientoProducto = obtenerValorSeleccionado('input[name="coste_almacenamiento"]:checked');
    const almacenamientoTiempo = obtenerValorSeleccionado('input[name="aumento_almacenamiento"]:checked');

    const periodo = obtenerValorSeleccionado('input[name="tiempo_total"]:checked');
    const intervalo = obtenerValorSeleccionado('input[name="tiempo_intervalo"]:checked');
    const demanda = obtenerValorSeleccionado('input[name="demanda"]:checked');

    let cantidadProductos = cprod.id === "cant_productos2"
        ? validarEntradaNumerica("cant_productos3", 1, 100, "Cantidad de productos inválida (Máximo 100)")
        : 1;

    let capacidadMaxima = almacenamiento.id === "almacen2"
        ? validarEntradaNumerica("almacen3", 1, Infinity, "Capacidad máxima de almacenamiento inválida")
        : 0;

    let cantidadDias = periodo.id === "tiempo_total5"
        ? validarEntradaNumerica("tiempo_total6", 1, 1000, "Periodo de tiempo inválido")
        : Number(periodo.value);

    let intervaloDias = intervalo.id === "tiempo_intervalo6"
        ? validarEntradaNumerica("tiempo_intervalo7", 1, 999, "Intervalo de tiempo inválido")
        : Number(intervalo.value);

    let costo_alm = almacenamientoProducto.id === "coste_almacenamiento2"
        ? validarEntradaNumerica("coste_almacenamiento3", 1, Infinity, "Precio de almacenamiento inválido")
        : -1;

    let lim_proveedor = (proveedor2.id === "proveedor2" && proveedor3.id === "proveedor4")
        ? validarEntradaNumerica("proveedor5", 1, Infinity, "Límite de producción inválido")
        : -1;

    let demanda_productos = (demanda.id == "demanda2")
        ? validarEntradaNumerica("demanda3", 0, Infinity, "Demanda de productos inválido")
        : -1;

    if (cantidadDias < intervaloDias) {
        alert("El intervalo de tiempo debe ser menor o igual que la cantidad total de días");
        datosValidos = false;
    }
    if (datosValidos) {
        crearTabla();
    } else {
        alert("Ingrese todos los valores solicitados");
    }
}
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
    document.querySelector('.toggle-btn span').textContent = document.querySelector('.sidebar').classList.contains('collapsed') ? "" : "Opciones";
}

function startTimer() {
    startTime = new Date().getTime();
}

function stopTimer() {
    const endTime = new Date().getTime();
    const elapsedTime = endTime - startTime;
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const milliseconds = elapsedTime % 1000;
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;

    document.getElementById('tiempo-ejecucion').innerText = formattedTime;
}

function crearData(){
    data = {
        nombres: datosRecuperados.nombres,
        precio_produccion: datosRecuperados.precioCompra,
        bool_aumento_produccion: document.getElementById("p_produccion2").checked,
        aumento_produccion: datosRecuperados.aumentoCompra,
        bool_precio_venta: document.getElementById("p_venta2").checked,
        precio_venta: datosRecuperados.precioVenta,
        bool_maxima_produccion: document.getElementById("proveedor2").checked,
        bool_maxima_produccion_constante: document.getElementById("proveedor4").checked,
        variable_maxima_produccion: document.getElementById("proveedor4").checked 
            ? document.getElementById("proveedor5").valueAsNumber
            : -1,
        arreglo_maxima_produccion: datosRecuperados.max_proveedor,
        bool_demanda_constante: document.getElementById("demanda2").checked,
        variable_demanda: document.getElementById("demanda2").checked
            ? parseInt(document.getElementById("demanda3").valueAsNumber)
            : -1,
        arreglo_demanda: datosRecuperados.demandas,
        bool_costo_almacenamiento_constante: document.getElementById("coste_almacenamiento2").checked,
        variable_costo_almacenamiento: document.getElementById("coste_almacenamiento2").checked
            ? document.getElementById("coste_almacenamiento3").valueAsNumber
            : -1,
        arreglo_costo_almacenamiento: datosRecuperados.costo_almacenamiento,
        bool_aumento_almacenamiento: document.getElementById("aumento_almacenamiento2").checked,
        aumento_almacenamiento: datosRecuperados.aumento_almacenamiento,
        cantidad_productos: document.getElementById("cant_productos2").checked
            ? parseInt(document.getElementById("cant_productos3").valueAsNumber)
            : 1,
        cantidad_dias: document.getElementById("tiempo_total5").checked
            ? parseInt(document.getElementById("tiempo_total6").valueAsNumber)
            : Number(document.querySelector('input[name="tiempo_total"]:checked').value),
        intervalo_dias: document.getElementById("tiempo_intervalo6").checked
            ? parseInt(document.getElementById("tiempo_intervalo7").valueAsNumber)
            : Number(document.querySelector('input[name="tiempo_intervalo"]:checked').value),
        objetivo: document.querySelector('input[name="tipo_optimizacion"]:checked').value,
        capacidad_almacenamiento: document.getElementById("almacen2").checked
            ? parseInt(document.getElementById("almacen3").valueAsNumber)
            : -1,
        promedio_venta: datosRecuperados.promedioVenta
    };
}

function guardarExcel() {

    recuperarData();
    if(validarData()){
        crearData();
        const link = document.createElement("a");
        const headers = [
            ["Valores de configuración", "","", "Variables numéricas"],
            [],
            ["aumento_produccion", String(data.bool_aumento_produccion), "", "objetivo", data.objetivo],
            ["precio_venta", String(data.bool_precio_venta), "", "cantidad_productos", data.cantidad_productos],
            ["maxima_produccion", String(data.bool_maxima_produccion), "", "variable_maxima_produccion", data.variable_maxima_produccion],
            ["maxima_produccion_constante", String(data.bool_maxima_produccion_constante), "", "variable_demanda", data.variable_demanda],
            ["demanda_constante", String(data.bool_demanda_constante), "", "variable_costo_almacenamiento", data.variable_costo_almacenamiento],
            ["costo_almacenamiento_constante", String(data.bool_costo_almacenamiento_constante), "", "cantidad_dias", data.cantidad_dias],
            ["aumento_almacenamiento", String(data.bool_aumento_almacenamiento), "", "intervalo_dias", data.intervalo_dias],
            ["", "", "", "capacidad_almacenamiento", data.capacidad_almacenamiento],
            [],
            ["Nombre", "Precio Compra", "Aumento Precio Compra", "Maxima Producción",
            "Precio Venta", "Costo Almacenamiento", "Aumento Almacenamiento", 
            "Promedio Venta", "Demandas"]

        ];

        for (let i = 0; i < data.cantidad_productos; i++) {
            let max_produccion = data.bool_maxima_produccion
            ? data.bool_maxima_produccion_constante
                ? data.variable_maxima_produccion
                : data.arreglo_maxima_produccion[i]
            : "inf";

            headers.push([
                data.nombres[i] || `Producto ${i + 1}`,
                data.precio_produccion[i] || "NA",
                data.bool_aumento_produccion ? (data.aumento_produccion[i] || "0") : "0",
                max_produccion,
                data.bool_precio_venta ? (data.precio_venta[i] || "NA") : (data.precio_produccion[i] || "NA"),
                data.bool_costo_almacenamiento_constante ? data.variable_costo_almacenamiento : (data.arreglo_costo_almacenamiento[i] || "0"),
                data.bool_aumento_almacenamiento ? (data.aumento_almacenamiento[i] || "0") : "0",
                data.promedio_venta[i] || "NA",
                data.bool_demanda_constante ? data.variable_demanda : (data.arreglo_demanda[i] || "0")
            ]);
        }

        const csvContent = headers
            .map(row => row.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const fecha = new Date();
        const nombreArchivo = `InvGestor (${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}---${fecha.getHours()}-${fecha.getMinutes()}-${fecha.getSeconds()}).xlsx`;

        link.href = URL.createObjectURL(blob);
        link.download = nombreArchivo;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;

    }
    else{
        alert("Hay errores en las entradas, no se puede guardar");
        return;
    }
    
}


async function cargarExcel() {
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = ".xlsx, .csv";
    inputFile.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        configurarInterfaz(excelData);
    });

    inputFile.click();
}

function configurarInterfaz(data) {
    const opciones = {
        bool_aumento_produccion: data[2][1] == "true",
        bool_precio_venta: data[3][1] == "true",
        bool_maxima_produccion: data[4][1] == "true",
        bool_maxima_produccion_constante: data[5][1] == "true",
        bool_demanda_constante: data[6][1] == "true",
        bool_costo_almacenamiento_constante: data[7][1] == "true",
        bool_aumento_almacenamiento: data[8][1] == "true",
        cantidad_productos: parseInt(data[3][4]),
        objetivo: data[2][4],
        cantidad_productos: parseInt(data[3][4]),
        variable_maxima_produccion: parseInt(data[4][4]),
        variable_demanda: parseInt(data[5][4]),
        variable_costo_almacenamiento: parseFloat(data[6][4]),
        cantidad_dias: parseInt(data[7][4]),
        intervalo_dias: parseInt(data[8][4]),
        capacidad_almacenamiento: parseInt(data[9][4]),
    };

    configurarOpciones(opciones);
    usarConfiguracion();

    const productos = data.slice(12).map((row) => ({
        nombre: row[0],
        precioCompra: row[1] === "NA" ? null : parseFloat(row[1]),
        aumentoCompra: row[2] === "0" ? null : parseFloat(row[2]),
        maxProduccion: row[3] === "inf" ? null : parseFloat(row[3]),
        precioVenta: row[4] === "NA" ? null : parseFloat(row[4]),
        costoAlmacenamiento: row[5] === "NA" ? null : parseFloat(row[5]),
        aumentoAlmacenamiento: row[6] === "0" ? null : parseFloat(row[6]),
        promedioVenta: parseFloat(row[7]),
        demandas: row[8] === "0" ? null : parseFloat(row[8]),
    }));

    llenarTabla(productos);
}
function configurarOpciones(opciones){
    if (opciones.cantidad_productos > 1){
        document.getElementById("cant_productos2").checked = true;
        document.getElementById("cant_productos2").dispatchEvent(new Event('change'));
        document.getElementById("cant_productos3").value = opciones.cantidad_productos;

    } 
    if (opciones.objetivo == "maximizar"){
        document.getElementById("tipo_optimizacion2").checked = true;
    } 
    if (opciones.bool_aumento_produccion){
        document.getElementById("p_produccion2").checked = true;
    } 
    if (opciones.bool_precio_venta){
        document.getElementById("p_venta2").checked = true;
    } 
    if (opciones.bool_maxima_produccion){
        document.getElementById("proveedor2").checked = true;
        document.getElementById("proveedor2").dispatchEvent(new Event('change'));

        if(opciones.bool_maxima_produccion_constante){
            document.getElementById("proveedor4").checked = true;
            document.getElementById("proveedor4").dispatchEvent(new Event('change'));
            document.getElementById("proveedor5").value = opciones.variable_maxima_produccion;
        }
        else{
            document.getElementById("proveedor3").checked = true;
            document.getElementById("proveedor3").dispatchEvent(new Event('change'));       
        }

    }
    if (opciones.bool_demanda_constante){
        document.getElementById("demanda2").checked = true;
        document.getElementById("demanda2").dispatchEvent(new Event('change'));
        document.getElementById("demanda3").value = opciones.variable_demanda;
        
        
    } 
    if (opciones.bool_costo_almacenamiento_constante){
        document.getElementById("coste_almacenamiento2").checked = true;
        document.getElementById("coste_almacenamiento2").dispatchEvent(new Event('change'));
        document.getElementById("coste_almacenamiento3").value = opciones.variable_costo_almacenamiento;

        
    } 
    if (opciones.bool_aumento_almacenamiento){
        document.getElementById("aumento_almacenamiento2").checked = true;
        
    } 

    if (!([7, 31, 93, 365].includes(opciones.cantidad_dias))) {
        document.getElementById("tiempo_total5").checked = true;
        document.getElementById("tiempo_total5").dispatchEvent(new Event('change'));
        document.getElementById("tiempo_total6").value = opciones.cantidad_dias;
    }
    else{
        switch(opciones.cantidad_dias){
            case 7:
                document.getElementById("tiempo_total1").checked = true;              
                break;
            case 31:
                document.getElementById("tiempo_total2").checked = true;       
                break;
            case 93:
                document.getElementById("tiempo_total3").checked = true;       
                break;
            case 365:
                document.getElementById("tiempo_total4").checked = true;       
                break;
            default:
                break;
        }  
    }
    if (!([1, 7, 31, 93, 365].includes(opciones.intervalo_dias))) {
        document.getElementById("tiempo_intervalo6").checked = true;
        document.getElementById("tiempo_total7").value = opciones.cantidad_dias;
    }
    else{
        switch(opciones.intervalo_dias){
            case 1:
                document.getElementById("tiempo_intervalo1").checked = true;
                break;
            case 7:
                document.getElementById("tiempo_intervalo2").checked = true;              
                break;
            case 31:
                document.getElementById("tiempo_intervalo3").checked = true;       
                break;
            case 93:
                document.getElementById("tiempo_intervalo4").checked = true;       
                break;
            case 365:
                document.getElementById("tiempo_intervalo5").checked = true;       
                break;
            default:
                break;
        }  
    }

    document.getElementById("almacen3").value = opciones.capacidad_almacenamiento;
    if(opciones.bool_costo_almacenamiento_constante){
        document.getElementById("coste_almacenamiento3").value = opciones.variable_costo_almacenamiento;
    }


}

function configurarBooleanos(opciones) {

    if (opciones.cantidad_productos > 1) document.getElementById("") 
    if (opciones.objetivo == "maximizar"){
        document.getElementById("tipo_optimizacion2").checked = true;
        document.getElementById("tipo_optimizacion2").dispatchEvent(new Event('change'));
    } 
    if (opciones.bool_aumento_produccion){

        document.getElementById("p_produccion2").checked = true;
        document.getElementById("p_produccion2").dispatchEvent(new Event('change'));
    } 
    if (opciones.bool_precio_venta){
        
        document.getElementById("p_venta2").checked = true;
        document.getElementById("p_venta2").dispatchEvent(new Event('change'));
    } 
    if (opciones.bool_maxima_produccion){
        document.getElementById("proveedor2").checked = true;
        document.getElementById("proveedor2").dispatchEvent(new Event('change'));;
        document.getElementById("proveedor3").checked = true;
        document.getElementById("proveedor3").dispatchEvent(new Event('change'));

    }
    if (opciones.bool_maxima_produccion_constante){
        document.getElementById("proveedor4").checked = true;
        document.getElementById("proveedor4").dispatchEvent(new Event('change'));
    } 
    if (opciones.bool_demanda_constante){
        document.getElementById("demanda2").checked = true;
        document.getElementById("demanda2").dispatchEvent(new Event('change'));
        
    } 
    if (opciones.bool_costo_almacenamiento_constante){
        document.getElementById("coste_almacenamiento2").checked = true;
        document.getElementById("coste_almacenamiento2").dispatchEvent(new Event('change'));
        
    } 
    if (opciones.bool_aumento_almacenamiento){
        document.getElementById("aumento_almacenamiento2").checked = true;
        document.getElementById("aumento_almacenamiento2").dispatchEvent(new Event('change'));
    } 
}


function configurarVariables(opciones) {
    if (opciones.cantidad_productos > 1) {
        document.getElementById("cant_productos2").checked = true;
        document.getElementById("cant_productos3").value = opciones.cantidad_productos;
    }
    if (opciones.cantidad_dias > 0) {
        document.getElementById("tiempo_total5").checked = true;
        document.getElementById("tiempo_total6").value = opciones.cantidad_dias;
    }
    document.getElementById("tiempo_intervalo7").value = opciones.intervalo_dias;
    document.getElementById("almacen3").value = opciones.capacidad_almacenamiento;
    document.getElementById("coste_almacenamiento3").value = opciones.variable_costo_almacenamiento;
}


function llenarTabla(productos) {
   
    const filas = document.querySelectorAll("#inputTable tr:not(:first-child)");
    
    productos.forEach((producto, index) => {
        const fila = filas[index];
        if (!fila) return;

   
        const nombre = fila.querySelector('input[name="product_name"]');
        if (nombre) nombre.value = producto.nombre || "";

        const precioCompra = fila.querySelector('input[name="buy_price"]');
        if (precioCompra) precioCompra.value = producto.precioCompra || "";

        const aumentoCompra = fila.querySelector('input[name="rise_cost"]');
        if (aumentoCompra && producto.aumentoCompra !== null) {
            aumentoCompra.value = producto.aumentoCompra;
        }

        const precioVenta = fila.querySelector('input[name="sell_price"]');
        if (precioVenta && producto.precioVenta !== null) {
            precioVenta.value = producto.precioVenta;
        }

        const promedioVenta = fila.querySelector('input[name="avg_sell"]');
        if (promedioVenta) promedioVenta.value = producto.promedioVenta || "";

        const maxProduccion = fila.querySelector('input[name="storage_cost"]');
        if (maxProduccion && producto.maxProduccion !== null) {
            maxProduccion.value = producto.maxProduccion;
        }

        const demandas = fila.querySelector('input[name="demanda_producto"]');
        if (demandas && producto.demandas !== null) {
            demandas.value = producto.demandas;
        }

        const costoAlmacenamiento = fila.querySelector('input[name="proveedor"]');
        if (costoAlmacenamiento && producto.costoAlmacenamiento !== null) {
            costoAlmacenamiento.value = producto.costoAlmacenamiento;
        }

        const aumentoAlmacenamiento = fila.querySelector('input[name="rise_storage"]');
        if (aumentoAlmacenamiento && producto.aumentoAlmacenamiento !== null) {
            aumentoAlmacenamiento.value = producto.aumentoAlmacenamiento;
        }
    });
}
function exportarExcel(data, resultados) {
   
    const libro = XLSX.utils.book_new();

   
    const infoGeneral = [
        ["Tiempo de Ejecución", document.getElementById("tiempo-ejecucion").textContent],
        ["Estado de Optimización", resultados.status || "Desconocido"],
        ["Capacidad Máxima del Almacén", data.capacidad_almacenamiento],
        ["Ganancia Estimada Total", resultados.ganancia_esperada.toFixed(2) || 0],
        ["Pérdida Estimada Total", resultados.perdida_esperada.toFixed(2) || 0],
        ["Gasto Total Estimado", resultados.gasto_total.toFixed(2) || 0],
    ];

    if (data.bool_demanda_constante) {
        infoGeneral.push(["Demanda por producto", data.variable_demanda]);
    }
    if (data.bool_costo_almacenamiento_constante) {
        infoGeneral.push(["Costo almacenamiento por producto", data.variable_costo_almacenamiento]);
    }
    if (data.bool_maxima_produccion_constante) {
        infoGeneral.push(["Máxima producción por producto", data.variable_maxima_produccion]);
    }

    const wsGeneral = XLSX.utils.aoa_to_sheet(infoGeneral);
    XLSX.utils.book_append_sheet(libro, wsGeneral, "Información General");


    for (let i = 0; i < data.cantidad_productos; i++) {
        const nombreProducto = data.nombres[i] || `Producto ${i + 1}`;

    
        const productoData = [
            ["Nombre del Producto", nombreProducto],
            ["Ganancia Estimada", resultados.ganancias_por_producto[i].toFixed(2)],
            ...(data.bool_aumento_produccion
                ? [["Aumento en Producción (%)", (data.aumento_produccion[i] * 100).toFixed(1)]]
                : []),
            ...(data.bool_demanda_constante
                ? [["Demanda mínima en todo periodo", data.variable_demanda]]
                : []),
            ...(data.bool_costo_almacenamiento_constante
                ? [["Costo de almacenamiento", data.variable_costo_almacenamiento]]
                : []),
            ...(data.bool_maxima_produccion
                ? [
                    ["Cantidad Máxima a Producir Por Periodo",
                        data.bool_maxima_produccion_constante
                            ? data.variable_maxima_produccion
                            : data.arreglo_maxima_produccion[i],
                    ],
                ]
                : []),
            ["Cantidad esperada a vender por periodo", data.promedio_venta[i]],
            [],
        ];

        const columnas = ["Periodo", "Precio de Compra"];
        if (data.bool_precio_venta) columnas.push("Precio de Venta (P)");
        columnas.push("Cantidad a Comprar (X)");
        if (data.bool_precio_venta) columnas.push("Demanda");
        columnas.push("Cantidad a Almacenar (Y)");

        productoData.push(columnas);

        for (let j = 0; j < data.cantidad_dias / data.intervalo_dias; j++) {
            const precioCompra = data.bool_aumento_produccion
                ? ((1 + j * data.aumento_produccion[i]) * data.precio_produccion[i]).toFixed(3)
                : (data.precio_produccion[i]).toFixed(3);
            const compra = parseInt(resultados["X"][`X_${j}_${i}`] || 0);
            const almacenamiento = j == data.cantidad_dias - 1
                ? 0
                : resultados["Y"][`Y_${j + 1}_${i}`] || 0;
            const fila = [j + 1, precioCompra];

            if (data.bool_precio_venta) {
                fila.push(data.precio_venta[i]); 
            }
            fila.push(compra);

            if (data.bool_precio_venta) {
                const demanda = data.bool_demanda_constante
                    ? data.variable_demanda
                    : data.arreglo_demanda[i];
                fila.push(demanda); 
            }
            fila.push(almacenamiento);

            productoData.push(fila);
        }

        const wsProducto = XLSX.utils.aoa_to_sheet(productoData);
        XLSX.utils.book_append_sheet(libro, wsProducto, nombreProducto);
    }

   
    const nombreArchivo = "resultados.xlsx";
    if (nombreArchivo) {
        XLSX.writeFile(libro, nombreArchivo.endsWith(".xlsx") ? nombreArchivo : `${nombreArchivo}.xlsx`);
    }
}


document.getElementById("b4").addEventListener("click", function () {
    const data = data1;
    const results = resultados;
    exportarExcel(data, results);
});




document.addEventListener('DOMContentLoaded', () => {
    const entradasNumericasContainer = document.querySelector('.entradasNumericas');
    const inputContainers = document.querySelectorAll('.input-container');

    function toggleErrorVisibility() {
        const hasEnabledInput = Array.from(inputContainers).some(container => {
            const input = container.querySelector('input');
            return !input.disabled;
        });

        // Si no hay inputs habilitados, oculta el contenedor .error
        if (hasEnabledInput) {
            entradasNumericasContainer.style.display = 'grid';
        } else {
            entradasNumericasContainer.style.display = 'none';
        }
    }

    // Llama a toggleErrorVisibility al inicio para establecer el estado inicial
    toggleErrorVisibility();

    // Escucha los cambios en cada input para actualizar la visibilidad
    inputContainers.forEach(container => {
        const input = container.querySelector('input');
        input.addEventListener('change', toggleErrorVisibility);
    });
});
document.getElementById("b3").addEventListener('click', cargarExcel);
document.getElementById("b2").addEventListener("click", guardarExcel);
document.getElementById("contraerOpciones").addEventListener("click", toggleSidebar);
document.addEventListener("DOMContentLoaded", activarOpcionesGenerales);
document.getElementById("calculate").addEventListener("click", calcularValoresOptimos);
document.getElementById("restart").addEventListener("click", borrarData);   
document.getElementById("b1").addEventListener("click", usarConfiguracion);

