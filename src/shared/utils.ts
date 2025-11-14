import { Category } from "@prisma/client";

export const categoryMapping = {
    [Category.tshirts]: "Футболки",
    [Category.hoodies]: "Худи",
    [Category.accessoires]: "Аксессуары",
};
