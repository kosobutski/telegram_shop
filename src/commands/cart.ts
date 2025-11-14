import type { CallbackQueryContext } from "grammy";
import type { MyContext } from "../shared/types.js";
import { backToMenuKeyboard } from "../shared/keyboards.js";

export const cartCommand = (ctx: CallbackQueryContext<MyContext>) => {
    ctx.answerCallbackQuery();
    return ctx.callbackQuery.message.editText("Раздел в разработке, тут пока ничего нет", {
        reply_markup: backToMenuKeyboard,
    });
};
