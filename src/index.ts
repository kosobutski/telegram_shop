import "dotenv/config";
import { Bot, GrammyError, HttpError } from "grammy";
import {
    addToCartCommand,
    cartCommand,
    categoriesCommand,
    chosenProductCommand,
    menuCommand,
    payCartCommand,
    paymentsCommand,
    productsCommand,
    removeFromCartCommand,
    removeMenuCommand,
    startCommand,
} from "./commands/index.js";
import type { MyContext } from "./shared/types.js";
import { hydrate } from "@grammyjs/hydrate";
import { tgSuccessfulPaymentHandler } from "./commands/successful_payment_handler.js";
import type { Category } from "@prisma/client";

const bot = new Bot<MyContext>(process.env.BOT_TOKEN as string);
bot.use(hydrate());

bot.command("start", (ctx) => startCommand(ctx));

bot.on("pre_checkout_query", async (ctx) => await ctx.answerPreCheckoutQuery(true));
bot.on(":successful_payment", (ctx) => tgSuccessfulPaymentHandler(ctx));

bot.callbackQuery("menu", (ctx) => menuCommand(ctx));
bot.callbackQuery("categories", (ctx) => categoriesCommand(ctx));
bot.callbackQuery("products", (ctx) => productsCommand(ctx));
bot.callbackQuery("cart", async (ctx) => await cartCommand(ctx));
bot.callbackQuery("removeMenu", async (ctx) => await removeMenuCommand(ctx));
bot.callbackQuery("payCart", async (ctx) => await payCartCommand(ctx));
bot.callbackQuery(/^addToCart-\d+$/, async (ctx) => await addToCartCommand(ctx));
bot.callbackQuery(/^removeFromCart-\d+$/, async (ctx) => await removeFromCartCommand(ctx));
bot.callbackQuery(/^chosenProduct-\d+$/, async (ctx) => chosenProductCommand(ctx));
bot.callbackQuery(/^buyProduct-\d+$/, async (ctx) => await paymentsCommand(ctx));
bot.callbackQuery(/^category-(.+)$/, async (ctx) => {
    const category = ctx.match[1] as Category;
    await productsCommand(ctx, category);
});

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
