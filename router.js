const express = require('express');
const http = require('http'); // Cambiado a HTTP en lugar de HTTPS
const WebSocket = require('ws');

const app = express();
// Usar un puerto dinámico para compatibilidad con Render o predeterminado
const port = process.env.PORT || 2091;

// Crear servidor HTTP con Express
const server = http.createServer(app);

// Crear servidor WebSocket con la opción de manejar mensajes como texto
const wss = new WebSocket.Server({ server });

// Almacenamos todos los clientes conectados
let clients = [];

// Configurar Express para servir una página simple
app.get('/', (req, res) => {
    res.send(`
        <h1>WebSocket con Express</h1>
        <script>
            const ws = new WebSocket('ws://' + window.location.host);

            ws.onopen = () => {
                console.log('Conexión WebSocket abierta');
                ws.send('1');  // Enviar el mensaje '1' al servidor al abrir la conexión
            };

            ws.onmessage = (event) => {
                console.log('Mensaje recibido:', event.data);
            };
        </script>
    `);
});

// Configurar los eventos del servidor WebSocket
wss.on('connection', (ws) => {
    console.log('Nuevo cliente conectado');
    
    // Agregar el nuevo cliente a la lista de clientes
    clients.push(ws);

    // Enviar un mensaje de bienvenida al cliente
    ws.send('Bienvenido al servidor WebSocket');

    // Manejar los mensajes entrantes del cliente
    ws.on('message', (message) => {
        const messageText = message.toString(); // Esto convierte el buffer a un string

        console.log('Mensaje recibido del cliente:', messageText); // Esto debería ser ahora un string

        // Usar switch-case para responder con las preguntas según el mensaje recibido
        let response;
        switch (messageText) {
            case '1':
                response = 'Pregunta 1';
                break;
            case '2':
                response = 'Pregunta 2';
                break;
            case '3':
                response = 'Pregunta 3';
                break;
            case '4':
                response = 'Pregunta 4';
                break;
            case '5':
                response = 'Pregunta 5';
                break;
            default:
                response = 'Mensaje no válido';
                break;
        }

        // Enviar la respuesta a todos los clientes conectados
        clients.forEach((client) => {
            client.send(response);
        });
    });

    // Manejar la desconexión del cliente
    ws.on('close', () => {
        console.log('Cliente desconectado');
        clients = clients.filter(client => client !== ws);
    });
});

// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
