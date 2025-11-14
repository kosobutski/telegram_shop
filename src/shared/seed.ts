import prisma from "./prisma.client.js";

const products = [
    {
        name: "Футболка классическая черная",
        description: "Мягкая хлопковая футболка премиум-качества",
        price: 1999.99,
        category: "t-shirts",
    },
    {
        name: "Футболка оверсайз белая",
        description: "Свободная футболка модного кроя",
        price: 2299.99,
        category: "t-shirts",
    },
    {
        name: "Футболка с принтом",
        description: "Футболка с уникальным графическим принтом",
        price: 2499.99,
        category: "t-shirts",
    },
    {
        name: "Худи с капюшоном черное",
        description: "Теплое худи из футера с начесом",
        price: 4499.99,
        category: "hoodies",
    },
    {
        name: "Худи оверсайз серое",
        description: "Свободное худи уличного стиля",
        price: 4799.99,
        category: "hoodies",
    },
    {
        name: "Бейсболка унисекс",
        description: "Стильная бейсболка с регулируемой застежкой",
        price: 1299.99,
        category: "accessories",
    },
    {
        name: "Носки спортивные",
        description: "Комфортные носки из хлопка с поддержкой стопы",
        price: 799.99,
        category: "accessories",
    },
];

for (const product of products) {
    await prisma.product.upsert({
        where: { name: product.name },
        update: {},
        create: product,
    });
}

console.log("Products seed ran successfully");
