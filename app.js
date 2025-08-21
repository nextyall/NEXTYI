const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Scan this QR code!');
});

client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

client.on('message', message => {
    if(message.body === 'ping') {
        message.reply('pong');
    }
});

// Start WhatsApp client
client.initialize();

// Express server to keep Heroku dyno alive
app.get('/', (req, res) => {
    res.send('WhatsApp bot is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
