import prisma from "../shared/prisma.client.js";
import type { MyContext } from "../shared/types.js";

export const tgSuccessfulPaymentHandler = async (ctx: MyContext) => {
    const { invoice_payload, total_amount } = ctx.message.successful_payment;

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

        await ctx.reply("Оплата прошла успешно. Свяжитесь с продавцом в личке: @bro_cucurator");
    } catch (error) {
        console.error(error);
        return ctx.reply("Произошла ошибка при оплате");
    }
};
