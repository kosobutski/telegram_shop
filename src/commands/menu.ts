import type { CallbackQueryContext } from "grammy";
import type { MyContext } from "../shared/types.js";
import { categoriesAndCartKeyboard } from "../shared/keyboards.js";

export const menuCommand = (ctx: CallbackQueryContext<MyContext>) => {
    ctx.answerCallbackQuery();
    ctx.callbackQuery.message.editText("Здесь меню. Куда хочешь перейти?", {
        reply_markup: categoriesAndCartKeyboard,
    });
};
