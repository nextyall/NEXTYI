const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('WhatsApp Bot is running!'));
app.listen(port, () => console.log(`Server running on port ${port}`));

// Read session from Heroku Config Var
let sessionData;
if(process.env.SESSION_DATA){
    try{
        sessionData = JSON.parse(process.env.SESSION_DATA);
    }catch(e){
        console.log('Invalid SESSION_DATA JSON');
    }
}

const client = new Client({
    session: sessionData
});

client.on('qr', qr => qrcode.generate(qr, {small: true}));
client.on('authenticated', session => {
    console.log('Authenticated!');
});
client.on('ready', () => console.log('Bot is ready!'));

client.on('message', async msg => {
    const chat = await msg.getChat();

    // ===== MENU + VOICE NOTE =====
    if(msg.body === '.menu'){
        await msg.reply(`
✨ *Bot Commands* ✨
.ping - Check bot alive
.jid - Get chat/group JID
.forward <jid> <text or media URL> - Forward without forward tag

────────────────
💠 *Deployed by NEXTY*
📱 +92 319 2084504
────────────────
        `);

        try {
            const audioUrl = 'https://files.catbox.moe/9j4qg6.mp3';
            const response = await fetch(audioUrl);
            const buffer = await response.buffer();

            const media = new MessageMedia('audio/mpeg', buffer.toString('base64'), 'menu-voice.mp3');
            await msg.reply(media);
        } catch(err){
            console.log('Error sending voice note:', err);
            await msg.reply('Failed to send voice note.');
        }
    }

    // ===== PING =====
    if(msg.body === '.ping'){
        msg.reply('Pong! 🏓 Bot is alive.');
    }

    // ===== JID =====
    if(msg.body === '.jid'){
        msg.reply(`Chat ID: ${chat.id._serialized}`);
    }

    // ===== FORWARD =====
    if(msg.body.startsWith('.forward')){
        const parts = msg.body.split(' ');
        if(parts.length < 3){
            msg.reply('Usage: .forward <jid> <text or URL>');
            return;
        }

        const jid = parts[1];
        const content = parts.slice(2).join(' ');

        if(content.startsWith('http')){
            try{
                const res = await fetch(content);
                const buffer = await res.buffer();
                const media = new MessageMedia('application/octet-stream', buffer.toString('base64'), 'file');
                client.sendMessage(jid, media);
            }catch(e){
                msg.reply('Failed to fetch media.');
            }
        } else {
            client.sendMessage(jid, content);
        }

        msg.reply('Forwarded ✅');
    }
});

client.initialize();
