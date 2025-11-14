import "dotenv/config";
import { Bot, GrammyError, HttpError } from "grammy";
import { cartCommand, menuCommand, paymentsCommand, productsCommand, StartCommand } from "./commands/index.js";
import type { MyContext } from "./shared/types.js";
import { hydrate } from "@grammyjs/hydrate";
import { tgSuccessfulPaymentHandler } from "./commands/successful_payment_handler.js";

const bot = new Bot<MyContext>(process.env.BOT_TOKEN as string);
bot.use(hydrate());

bot.command("start", (ctx) => StartCommand(ctx));

bot.on("pre_checkout_query", async (ctx) => {
    await ctx.answerPreCheckoutQuery(true);
});
bot.on(":successful_payment", (ctx) => tgSuccessfulPaymentHandler(ctx));

bot.callbackQuery("menu", (ctx) => menuCommand(ctx));
bot.callbackQuery("products", (ctx) => productsCommand(ctx));
bot.callbackQuery("cart", (ctx) => cartCommand(ctx));
bot.callbackQuery(/^buyProduct-\d+$/, async (ctx) => await paymentsCommand(ctx));

const startBot = async () => {
    try {
        bot.start();
        console.log("Bot started");
    } catch (error) {
        console.error(`Error while starting the bot: ${error}`);
    }
};

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});

startBot();
