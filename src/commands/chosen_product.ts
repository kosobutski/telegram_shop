import { InlineKeyboard, type CallbackQueryContext } from "grammy";
import type { MyContext } from "../shared/types.js";
import prisma from "../shared/prisma.client.js";

export const chosenProductCommand = async (ctx: CallbackQueryContext<MyContext>) => {
    ctx.answerCallbackQuery();
    const productId = ctx.callbackQuery.data.split("-")[1];
    const product = await prisma.product.findUniqueOrThrow({
        where: {
            id: parseInt(productId),
        },
    });

    const outputText = `Вы выбрали товар номер ${product.id}:\n\n- Название: ${product.name}\n- Описание: ${product.description}\n- Цена: ${product.price}`;

    const keyboardUpperRow = new InlineKeyboard().text("Добавить в корзину", "addToCart").text("Оплатить сейчас", `buyProduct-${product.id}`);

    const keyboard = InlineKeyboard.from([...keyboardUpperRow.inline_keyboard, [InlineKeyboard.text("Назад к товарам", `category-${product.category}`)]]);

    return ctx.callbackQuery.message.editText(outputText, {
        reply_markup: keyboard,
    });
};
