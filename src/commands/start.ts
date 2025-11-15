import type { CommandContext } from "grammy";
import { menuKeyboard } from "../shared/keyboards.js";
import type { MyContext } from "../shared/types.js";
import prisma from "../shared/prisma.client.js";

export const startCommand = async (ctx: CommandContext<MyContext>) => {
    if (!ctx.from) throw new Error("Cannot define user info");

    const { id, first_name, username } = ctx.from;

    const existingUser = await prisma.user.findUnique({ where: { telegramId: BigInt(id) } });
    if (existingUser)
        return ctx.reply("Вы уже и так зарегистрированы", {
            reply_markup: menuKeyboard,
        });

    await prisma.user.create({
        data: {
            telegramId: BigInt(id),
            firstName: first_name,
            username: username,
        },
    });
    return ctx.reply("Я только что вас зарегистрировал", {
        reply_markup: menuKeyboard,
    });
};
