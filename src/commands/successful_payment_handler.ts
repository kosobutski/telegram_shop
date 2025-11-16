import { menuKeyboard } from "../shared/keyboards.js";
import prisma from "../shared/prisma.client.js";
import type { MyContext } from "../shared/types.js";
import { tgSuccessfulCartPaymentHandler } from "./successful_cart_payment_handler.js";

export const tgSuccessfulPaymentHandler = async (ctx: MyContext) => {
    const { invoice_payload, total_amount } = ctx.message.successful_payment;

    if (invoice_payload.startsWith("cart-")) {
        await tgSuccessfulCartPaymentHandler(ctx);
        return;
    }

    const productId = parseInt(invoice_payload);
    const price = total_amount / 100;

    try {
        const user = await prisma.user.findUniqueOrThrow({ where: { telegramId: ctx.from.id } });

        await prisma.order.create({
            data: {
                userId: user.id,
                productId,
                price,
            },
        });

        await ctx.reply("Оплата товара прошла успешно, напиши продавцу в личку: @bro_cucurator", {
            reply_markup: menuKeyboard,
        });
    } catch (error) {
        console.error(error);
        return ctx.reply("Произошла ошибка при оплате");
    }
};
