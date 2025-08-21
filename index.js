const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Session ID Heroku Config Vars se lega
const SESSION_ID = process.env.SESSION_ID || 'default-session';

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: SESSION_ID  // Yahin session ID use hoga
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('ready', () => {
    console.log('✅ Bot is ready with Session ID:', SESSION_ID);
});

client.on('message', async message => {
    const content = message.body.toLowerCase();
    
    if (content === '.menu') {
        await message.reply(`
🤖 *BOT MENU* 🤖
🎧 .menu - Show menu
⚡ .ping - Speed test
🆔 .jid - Get chat ID
📤 .forward <jid> - Forward message
        `);
    }
    // ... other commands same
});

client.initialize();

app.get('/', (req, res) => {
    res.send(`🤖 Bot running with Session ID: ${SESSION_ID}`);
});

app.listen(port, () => {
    console.log(`Server started with Session ID: ${SESSION_ID}`);
});
