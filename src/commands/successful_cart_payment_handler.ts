import { menuKeyboard } from "../shared/keyboards.js";
import prisma from "../shared/prisma.client.js";
import type { MyContext } from "../shared/types.js";

export const tgSuccessfulCartPaymentHandler = async (ctx: MyContext) => {
    const { invoice_payload, total_amount } = ctx.message.successful_payment;

    if (!invoice_payload.startsWith("cart-")) {
        return;
    }

    const cartId = parseInt(invoice_payload.split("-")[1]);

    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: { telegramId: BigInt(ctx.from!.id) },
        });

        const cart = await prisma.cart.findUnique({
            where: {
                id: cartId,
                userId: user.id,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!cart) {
            await ctx.reply("Корзина не найдена");
            return;
        }

        await Promise.all(
            cart.items.map((item) =>
                prisma.order.create({
                    data: {
                        userId: user.id,
                        productId: item.productId,
                        price: item.product.price * item.quantity,
                    },
                }),
            ),
        );

        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });

        return await ctx.reply(`Оплата корзины прошла успешно, напиши продавцу в личку: @bro_cucurator`, {
            reply_markup: menuKeyboard,
        });
    } catch (error) {
        console.error("Cart payment error:", error);
        await ctx.reply("Произошла ошибка при обработке оплаты корзины");
    }
};
