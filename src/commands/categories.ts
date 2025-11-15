import { InlineKeyboard, type CallbackQueryContext } from "grammy";
import type { MyContext } from "../shared/types.js";
import { Category } from "@prisma/client";
import { categoryMapping } from "../shared/utils.js";

export const categoriesCommand = (ctx: CallbackQueryContext<MyContext>) => {
    ctx.answerCallbackQuery();

    const keyboardUpperRow = Object.values(Category).map((category) => {
        return InlineKeyboard.text(categoryMapping[category], `category-${category}`);
    });
    const keyboardLowerRow = [InlineKeyboard.text("Все товары", `products`), InlineKeyboard.text("Назад в меню", "menu")];
    const keyboard = InlineKeyboard.from([keyboardUpperRow, keyboardLowerRow]);

    return ctx.callbackQuery.message.editText("Выбери категорию продукта", {
        reply_markup: keyboard,
    });
};
