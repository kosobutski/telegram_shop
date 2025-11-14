import { InlineKeyboard, type CallbackQueryContext } from "grammy";
import type { MyContext } from "../shared/types.js";
import prisma from "../shared/prisma.client.js";
import { backToMenuKeyboard } from "../shared/keyboards.js";

export const productsCommand = async (ctx: CallbackQueryContext<MyContext>) => {
    ctx.answerCallbackQuery();
    const products = await prisma.product.findMany();

    let outputText = products.reduce((acc, cur) => {
        return acc + `- Номер: ${cur.id}\n- Название: ${cur.name}\n- Описание: ${cur.description}\n- Цена: ${cur.price}\n\n`;
    }, "");
    outputText += "Какой товар покупаешь?";

    const keyboardButtonRows = products.map((product) => {
        return InlineKeyboard.text(product.id.toString(), `buyProduct-${product.id}`);
    });

    const keyboard = InlineKeyboard.from([keyboardButtonRows, [InlineKeyboard.text("Назад в меню", "menu")]]);

    return ctx.callbackQuery.message.editText(outputText, {
        reply_markup: keyboard,
    });
};
