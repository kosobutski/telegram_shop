import type { CallbackQueryContext } from "grammy";
import type { MyContext } from "../shared/types.js";
import prisma from "../shared/prisma.client.js";
import "dotenv/config";

export const payCartCommand = async (ctx: CallbackQueryContext<MyContext>) => {
    await ctx.answerCallbackQuery();

    try {
        const user = await prisma.user.findUniqueOrThrow({ where: { telegramId: ctx.from.id } });

        const cart = await prisma.cart.findUniqueOrThrow({
            where: { userId: user.id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        const chatId = ctx.chat.id;
        if (!chatId) throw new Error("ChatID is not defined");

        const totalAmount = cart.items.reduce((sum, item) => {
            return sum + item.product.price * item.quantity;
        }, 0);

        const productDescriptions = cart.items
            .map((item) => {
                `${item.product.name} ${item.quantity} шт.`;
            })
            .join("\n");

        const description = `Оплата корзины: ${productDescriptions}`;

        const prices = cart.items.map((item) => ({
            label: `${item.product.name} - ${item.quantity} шт.`,
            amount: item.product.price * item.quantity * 100,
        }));

        await ctx.api.sendInvoice(chatId, "Оплата корзины", description, `cart-${cart.id}`, "RUB", prices, {
            provider_token: process.env.PAYMENT_TOKEN,
            need_email: true,
            send_email_to_provider: true,
            provider_data: JSON.stringify({
                merchantId: process.env.PAYMENT_TOKEN,
                invoice: {
                    description: description,
                },
                amount: {
                    value: totalAmount * 100,
                    currency: "RUB",
                },
            }),
        });
    } catch (error) {
        console.error(error);
        return ctx.reply("Произошла ошибка при оплате");
    }
};
