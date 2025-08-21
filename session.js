const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "my-bot-session"  // Yeh tumhara session ID hoga
    })
});

client.on('qr', (qr) => {
    console.log('QR Code: (Scan only if needed)');
    require('qrcode-terminal').generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('✅ Client is ready!');
    console.log('✅ Session ID: my-bot-session');
    console.log('✅ Copy this session ID for Heroku');
});

client.initialize();
