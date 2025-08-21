const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('QR Code generated. Scan it with WhatsApp!');
});

client.on('ready', () => {
    console.log('✅ Bot is ready and online!');
});

client.on('message', async message => {
    const content = message.body.toLowerCase();
    const sender = message.from;
    
    if (content === '.menu') {
        const menuText = `
🤖 *BOT MENU* 🤖

🎧 .menu - Show this menu
⚡ .ping - Bot speed test
🆔 .jid - Get chat JID
📤 .forward <jid> - Forward message

_Bot made with ❤️ using whatsapp-web.js_
        `;
        await client.sendMessage(sender, menuText);
    }
    else if (content === '.ping') {
        const start = Date.now();
        const replyMsg = await message.reply('Testing speed...');
        const end = Date.now();
        await replyMsg.edit(`🏓 Pong! Speed: ${end - start}ms`);
    }
    else if (content === '.jid') {
        await message.reply(`Chat JID: ${sender}`);
    }
    else if (content.startsWith('.forward ')) {
        const jid = content.split(' ')[1];
        if (jid) {
            try {
                await message.forward(jid);
                await message.reply('✅ Message forwarded successfully!');
            } catch (error) {
                await message.reply('❌ Error forwarding message. Check JID format.');
            }
        } else {
            await message.reply('❌ Please provide JID: .forward <jid>');
        }
    }
});

client.initialize();

app.get('/', (req, res) => {
    res.send('🤖 WhatsApp Bot is running...');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
