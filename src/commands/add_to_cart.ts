import type { CallbackQueryContext } from "grammy";
import type { MyContext } from "../shared/types.js";
import prisma from "../shared/prisma.client.js";
import { backToMenuKeyboard } from "../shared/keyboards.js";

export const addToCartCommand = async (ctx: CallbackQueryContext<MyContext>) => {
    ctx.answerCallbackQuery();

    const user = await prisma.user.findUniqueOrThrow({ where: { telegramId: ctx.from.id } });
    const userId = user.id;
    const productId = parseInt(ctx.callbackQuery.data.split("-")[1]);

    const cart = await prisma.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
    });

    const cartItem = await prisma.cartItem.upsert({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        },
        update: {
            quantity: { increment: 1 },
        },
        create: {
            cartId: cart.id,
            productId,
            quantity: 1,
        },
    });

    const product = await prisma.product.findUniqueOrThrow({
        where: {
            id: productId,
        },
    });

    return ctx.callbackQuery.message.editText(`Товар ${product.name} добавлен в корзину. Текущее количество: ${cartItem.quantity}.`, {
        reply_markup: backToMenuKeyboard,
    });
};
