import type { CallbackQueryContext } from "grammy";
import type { MyContext } from "../shared/types.js";

export const addToCartCommand = async (ctx: CallbackQueryContext<MyContext>) => {
    ctx.answerCallbackQuery();
    return ctx.reply("В корзину пока добавлять нельзя");
};
