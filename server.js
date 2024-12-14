const express = require('express');
const axios = require('axios');
const app = express();
const xl = require('excel4node');

app.use(express.json());
app.use(express.static('Public'));
const port = 3000;

//Función para recibir los datos del cliente, resolverlos en el .py y devolver los resultados al cliente
app.post('/api/optimize', async (req, res) => {
    try {
        const data = req.body;
        const solverResponse = await axios.post('http://localhost:5000/optimize', data);
        res.json(solverResponse.data);
    } catch (error) {
        console.error('Error al comunicarse con solver.py:', error.message);
        res.status(500).json({ status: 'error', message: 'No se pudo procesar la solicitud. Asegúrate de que solver.py está corriendo y de que los endpoints son correctos' });
    }
});

app.listen(port, () => {
    console.log(`El server.js se está ejecutando en: http://localhost:${port}`);
});

