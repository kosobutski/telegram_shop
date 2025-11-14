import { InlineKeyboard } from "grammy";

export const menuKeyboard = new InlineKeyboard().text("Меню", "menu");

export const backToMenuKeyboard = new InlineKeyboard().text("Назад в меню", "menu");

export const categoriesAndCartKeyboard = new InlineKeyboard().text("Товары", "categories").text("Корзина", "cart");
