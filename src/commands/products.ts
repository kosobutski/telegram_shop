import { InlineKeyboard, type CallbackQueryContext } from "grammy";
import type { MyContext } from "../shared/types.js";
import prisma from "../shared/prisma.client.js";
import type { Category } from "@prisma/client";
import { categoryMapping } from "../shared/utils.js";

export const productsCommand = async (ctx: CallbackQueryContext<MyContext>, category?: Category) => {
    await ctx.answerCallbackQuery();

    const products = category ? await prisma.product.findMany({ where: { category } }) : await prisma.product.findMany();

    if (products.length === 0) {
        return await ctx.editMessageText("В этой категории товаров нет", {
            reply_markup: InlineKeyboard.from([[InlineKeyboard.text("Назад в меню", "menu")]]),
        });
    }

    let outputText = `Категория ${categoryMapping[category]}\n\n`;
    outputText += products.reduce((acc, cur) => {
        return acc + `- Номер: ${cur.id}\n- Название: ${cur.name}\n- Описание: ${cur.description}\n- Цена: ${cur.price}\n\n`;
    }, "");
    outputText += "Какой товар покупаешь?";

    const keyboardButtonRows = products.map((product) => {
        return InlineKeyboard.text(product.id.toString(), `buyProduct-${product.id}`);
    });

    const keyboard = InlineKeyboard.from([keyboardButtonRows, [InlineKeyboard.text("Назад к категориям", "categories")]]);

    return ctx.callbackQuery.message.editText(outputText, {
        reply_markup: keyboard,
    });
};
