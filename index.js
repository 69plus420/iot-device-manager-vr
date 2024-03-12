const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

app.use(express.static('public'));

client.on('connect', () => {
    console.log("Connected to MQTT broker");
    client.subscribe('iot/devices/#', (err) => {
        if (!err) {
            console.log("Subscribed to IoT devices topic");
        }
    });
});

client.on('message', (topic, message) => {
    console.log(`Received message on ${topic}`);
    io.emit('device-data', { topic, message: message.toString() });
});

io.on('connection', (socket) => {
    console.log('A user connected to the VR interface');
    socket.on('device-command', (data) => {
        console.log(`Sending command to ${data.device}: ${data.command}`);
        // Here you would send a command to an IoT device, simulated as a message for this example
        client.publish(`iot/devices/${data.device}/command`, data.command);
    });
});

server.listen(3000, () => {
    console.log('IoT Device Manager VR running on http://localhost:3000');
});