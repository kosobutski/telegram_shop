import { InlineKeyboard, type CallbackQueryContext } from "grammy";
import type { MyContext } from "../shared/types.js";
import prisma from "../shared/prisma.client.js";

export const removeMenuCommand = async (ctx: CallbackQueryContext<MyContext>) => {
    await ctx.answerCallbackQuery();

    const user = await prisma.user.findUniqueOrThrow({ where: { telegramId: ctx.from.id } });
    const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: {
            items: {
                include: {
                    product: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    let message = "Твоя корзина:\n\n";
    let totalPrice = 0;

    cart.items.forEach((item, index) => {
        const itemTotal = item.product.price * item.quantity;
        totalPrice += itemTotal;

        message += `${index + 1}. ${item.product.name}\n`;
        message += `- Цена: ${item.product.price} руб.\n`;
        message += `- Количество: ${item.quantity}\n`;
        message += `- Сумма: ${itemTotal} руб.\n\n`;
    });

    message += `Выбери, какой товар надо удалить из корзины.`;

    const keyboardButtonRow = cart.items.map((product, index) => {
        return InlineKeyboard.text((index + 1).toString(), `removeFromCart-${product.id}`);
    });

    const keyboard = InlineKeyboard.from([keyboardButtonRow, [InlineKeyboard.text("Назад к корзине", "cart")]]);

    return ctx.callbackQuery.message.editText(message, {
        reply_markup: keyboard,
    });
};
