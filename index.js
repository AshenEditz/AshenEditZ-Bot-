const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { OpenAI } = require("openai");
const fs = require("fs");
require("dotenv").config();
require("./keep_alive");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ["--no-sandbox"] },
});

const BOT_NAME = "AshenEditZ-OFFICIAL";
const FOOTER = "⚡ Powered by AshenEditZ";

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("Scan the QR code above.");
});

client.on("ready", () => {
  console.log(`${BOT_NAME} is now online!`);
});

const getRuntime = () => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  const secs = Math.floor(uptime % 60);
  return `⏱️ Uptime: ${hours}h ${mins}m ${secs}s`;
};

client.on("message", async (msg) => {
  try {
    const { from, body } = msg;

    // Auto React Emoji
    msg.react("🤖");

    // Menu Command
    if (body === "1" || body.toLowerCase().includes(".menu")) {
      const media = MessageMedia.fromFilePath("./media/menu.jpg");
      await client.sendMessage(from, media, {
        caption: `🌐 *AshenEditZ-OFFICIAL Menu*\n\n1️⃣ Chat with GPT\n2️⃣ Get Runtime\n\n${FOOTER}`,
      });
    }

    // Runtime Command
    else if (body.toLowerCase().includes(".runtime") || body === "2") {
      msg.reply(`${getRuntime()}\n\n${FOOTER}`);
    }

    // Owner Info
    else if (body.toLowerCase().includes(".owner")) {
      msg.reply("👤 *Owner:* Ashen Induwara\n📞 Contact: wa.me/947XXXXXXXX\n\n" + FOOTER);
    }

    // ChatGPT Mode (all messages)
    else {
      const gptResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: body }],
      });

      msg.reply(`${gptResponse.choices[0].message.content}\n\n${FOOTER}`);
    }
  } catch (err) {
    console.error("Error:", err);
  }
});

client.on("message_reaction", (reaction) => {
  console.log("Reacted to:", reaction);
});

// Auto view status
client.on("change_state", () => {
  client.getChats().then((chats) => {
    chats.forEach((chat) => {
      if (chat.isStatus) {
        chat.fetchMessages().then((msgs) => {
          msgs.forEach((m) => m.downloadMedia());
        });
      }
    });
  });
});

client.initialize();
