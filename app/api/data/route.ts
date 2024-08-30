import { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';

// 参考: https://docs.amplify.aws/nextjs/build-a-backend/data/connect-from-server-runtime/nextjs-server-runtime/
const cookieBasedClient = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
  });
  
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemName, price, label, paidAt, paidBy } = body;

    const { errors, data: newDetail } = await cookieBasedClient.models.Detail.create({
      id: generateRandomString(),
      name: itemName,
      price: Number(price),
      label: label,
      paidAt: paidAt,
      paidByUserA: paidBy === "userA",
      paidByUserB: paidBy === "userB",
    });

    if (errors) {
      throw new Error(JSON.stringify(errors));
    }

    return NextResponse.json(newDetail, { status: 200 });
  } catch (error) {
    console.error(`Error occured while creating item. error=${error}`);
    return NextResponse.json({ error: `Failed to create item. error=${JSON.stringify(error)}`, detail: JSON.stringify(error) }, { status: 500 });
  }
}

const generateRandomString = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (var i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}