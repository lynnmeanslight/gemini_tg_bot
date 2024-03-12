const TelegramBot = require('node-telegram-bot-api');
const { run } = require('./generateText');
require("dotenv").config();

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.on("message",async (msgObj)=>
{
    const message =  msgObj.text;
    if(message.startsWith("/generate"))
    {
        const prompt = message.split("\n")[1];
        const chatId = msgObj.from.id;
        const generatedText = await run(prompt);
        sendMessageToUser(bot,chatId,generatedText);
    }
});

async function sendMessageToUser(bot, chatId, message) {
    const maxChunkSize = 4096;
    const chunks = [];
  
    for (let i = 0; i < message.length; i += maxChunkSize) {
        chunks.push(message.substring(i, i + maxChunkSize));
    }
  
    for (const chunk of chunks) {
        await bot.sendMessage(chatId, chunk);
    }
  }