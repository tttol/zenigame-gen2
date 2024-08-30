"use server";

import { cookieBasedClient } from "./CookieBasedClient";

// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
export async function createAction(name: string, price: string, label: string, paidAt: string, paidBy: string) {
    try {
        const { errors, data: newDetail } =
        await cookieBasedClient.models.Detail.create({
          id: generateRandomString(),
          name: name,
          price: Number(price),
          label: label,
          paidAt: paidAt,
          paidByUserA: paidBy === "userA",
          paidByUserB: paidBy === "userB",
        });

        if (errors) {
            throw new Error(JSON.stringify(errors));
          }      
    } catch (e) {
        throw new Error(`Error occured while creating item. error=${e}`);
    }
}

const generateRandomString = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (var i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
