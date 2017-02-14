import 'babel-polyfill';
import express from 'express';
import { Bot, Elements } from 'facebook-messenger-bot';

const bot = new Bot(process.env.PAGE_ACCESS_TOKEN, process.env.VERIFY_TOKEN);

bot.on('message', async message => {
    const { sender } = message;
    await sender.fetch('first_name');

    const out = new Elements();
    out.add({ text: `hey ${sender.first_name}, how are you!` });

    await bot.send(sender.id, out);
});

const app = express();
app.use('/webhook', bot.router());
app.listen(3000);