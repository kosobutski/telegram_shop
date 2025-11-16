import type { CallbackQueryContext } from "grammy";
import type { MyContext } from "../shared/types.js";
import { backToMenuKeyboard } from "../shared/keyboards.js";
import prisma from "../shared/prisma.client.js";

export const cartCommand = async (ctx: CallbackQueryContext<MyContext>) => {
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

    if (!cart || cart.items.length === 0) {
        return ctx.callbackQuery.message.editText("Твоя корзина пуста", {
            reply_markup: backToMenuKeyboard,
        });
    }

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

    message += `Итого: ${totalPrice} рублей.`;

    const keyboard = {
        inline_keyboard: [
            [{ text: "Оплатить корзину", callback_data: "payCart" }],
            [{ text: "Удалить товар", callback_data: "removeMenu" }],
            [{ text: "Назад в меню", callback_data: "menu" }],
        ],
    };

    return ctx.callbackQuery.message.editText(message, {
        reply_markup: keyboard,
    });
};
