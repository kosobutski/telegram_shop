import type { CallbackQueryContext } from "grammy";
import type { MyContext } from "../shared/types.js";
import "dotenv/config";
import prisma from "../shared/prisma.client.js";

export const paymentsCommand = async (ctx: CallbackQueryContext<MyContext>) => {
    ctx.answerCallbackQuery();
    const productId = ctx.callbackQuery.data.split("-")[1];
    const product = await prisma.product.findUniqueOrThrow({
        where: {
            id: parseInt(productId),
        },
    });

    try {
        const chatId = ctx.chat.id;
        if (!chatId) throw new Error("ChatID is not defined");

        ctx.api.sendInvoice(
            chatId,
            product.name,
            product.description,
            product.id.toString(),
            "RUB",
            [
                {
                    label: "руб.",
                    amount: product.price * 100,
                },
            ],
            {
                provider_token: process.env.PAYMENT_TOKEN,
                need_email: true,
                send_email_to_provider: true,
                provider_data: JSON.stringify({
                    merchantId: process.env.PAYMENT_TOKEN,
                    invoice: {
                        description: product.description,
                    },
                    amount: {
                        value: product.price * 100,
                        currency: "RUB",
                    },
                }),
            },
        );
    } catch (error) {
        console.error(error);
        return ctx.reply("Произошла ошибка при оплате");
    }
};
