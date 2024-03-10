import { fetchAuthSession } from "aws-amplify/auth";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import sponImage from "./../spon.webp";
import tolImage from "./../tol.jpg";


dotenv.config();
let dynamoDb: AWS.DynamoDB.DocumentClient;

const Detail: React.FC<{ items: Item[] }> = ({ items }) => {  
  const [displayItems, setDisplayItems] = useState<Item[]>([]);
  useEffect(() => {
    setDisplayItems(items);
  }, [items]);

  async function getCurrentCredentials() {
    try {
      return (await fetchAuthSession()).credentials;
    } catch (err) {
      throw new Error(`Failed to get current credentials. ${JSON.stringify(err)}`);
    }
  }
  const response = getCurrentCredentials();
  response.then((credentials) => {
    const accessKeyId :string = credentials?.accessKeyId ?? process.env.AWS_ACCESS_KEY_ID ?? "";
    const secretAccessKey :string = credentials?.secretAccessKey ?? process.env.AWS_SECRET_ACCESS_KEY ?? "";

    dynamoDb = new AWS.DynamoDB.DocumentClient({
      region: "ap-northeast-1",
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        sessionToken: credentials?.sessionToken,
      },
    });
  }).catch((err) => {
    alert(`Cognitoを用いたAWS SDK認証に失敗しました. ${err}`);
  });
  
  const updateAllItemsPaid = () => {
    if (!window.confirm("すべての明細を支払い済みにします。よろしいですか？"))
      return;
    const targetItems = items.filter(
      (item) => !item.paidByTol || !item.paidBySpon
    );
    try {
      batchWrite(targetItems);
      alert(`すべての明細を支払い済みに更新しました.`);
    } catch (err) {
      alert(`更新に失敗しました. ${err}`);
    }
  };

  const batchWrite = (targetItems: Item[]) => {
    const chunks = [];
    for (let i = 0; i < targetItems.length; i += 25) {
      chunks.push(targetItems.slice(i, i + 25));
    }

    for (const chunk of chunks) {
      const params = {
        RequestItems: {
          ["Item-5dayiivzgjemff3dacha44aczq-dev"]: chunk.map((item) => ({
            PutRequest: {
              Item: {
                ...item,
                paidByTol: true,
                paidBySpon: true,
              },
            },
          })),
        },
      };

      try {
        dynamoDb.batchWrite(params).promise();
      } catch (err) {
        throw new Error(`Failed to update items. ${JSON.stringify(err)}`);
      }
    }
  };

  const priceFormatter = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  });

  const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tokyo",
  });

  return (
    <div className="p-3 bg-slate-500 text-white rounded-xl">
      <div className="text-right">
        {items.filter((item) => !item.paidByTol || !item.paidBySpon).length} 件
      </div>
      <div className="text-right  mb-3 mt-3">
        <span
          onClick={updateAllItemsPaid}
          className="bg-purple-400 text-white font-bold py-2 px-2 rounded-full inline-flex"
        >
          すべて支払い済みにする
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>

      {
      displayItems
        .filter((item) => !item.paidByTol || !item.paidBySpon)
        .sort(
          (a, b) => {
            const aPaidAt = a.paidAt ? new Date(a.paidAt).getTime() : 0;
            const bPaidAt = b.paidAt ? new Date(b.paidAt).getTime() : 0;
            return bPaidAt - aPaidAt;
          }
        )
        .map((item) => (
          <div key={item.id} className="border-b-2 border-slate-400 mb-5">
            <p>
              <span className="pl-2 mr-2">
                {item.paidByTol ? (
                  <Image
                    src={tolImage}
                    alt="tol"
                    className="rounded-full w-10 h-10 inline"
                  />
                ) : null}
                {item.paidBySpon ? (
                  <Image
                    src={sponImage}
                    alt="spon"
                    className="rounded-full w-10 h-10 inline"
                  />
                ) : null}
              </span>
              <span className="font-bold">{item.name}</span>
            </p>
            <p className="flex items-end mb-2">
              <span>{priceFormatter.format(item.price)}</span>
              &nbsp;-&nbsp;
              <span>{item.paidAt ? dateFormatter.format(new Date(item.paidAt)) : "支払日未入力"}</span>
              {item.label && (<span className="bg-blue-300 font-bold py-1 px-2 ml-2 text-white rounded-full text-xs">{item.label}</span>)}
            </p>
          </div>
        ))
        }
    </div>
  );
};

export default Detail;
