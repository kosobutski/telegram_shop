import type { CallbackQueryContext } from "grammy";
import type { MyContext } from "../shared/types.js";
import prisma from "../shared/prisma.client.js";
import { backToMenuKeyboard } from "../shared/keyboards.js";

export const removeFromCartCommand = async (ctx: CallbackQueryContext<MyContext>) => {
    await ctx.answerCallbackQuery();

    const cartItemId = parseInt(ctx.callbackQuery.data.split("-")[1]);
    const user = await prisma.user.findUniqueOrThrow({
        where: { telegramId: ctx.from.id },
    });

    const deletedItem = await prisma.cartItem.delete({
        where: {
            id: cartItemId,
            cart: {
                userId: user.id,
            },
        },
        include: {
            product: true,
        },
    });

    return ctx.callbackQuery.message.editText(`Товар "${deletedItem.product.name}" полностью удален из корзины.`, {
        reply_markup: backToMenuKeyboard,
    });
};
