import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { signOut } from "aws-amplify/auth";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { refreshAuthToken } from "../logic/Authentication";
import userAImage from "./../userA.png";
import userBImage from "./../userB.webp";

const Detail: React.FC<{ labeledDetails: Schema["Detail"][] }> = ({
  labeledDetails: labeledDetails,
}) => {
  const client = generateClient<Schema>();
  const [displayDetails, setDisplayDetails] = useState<Schema["Detail"][]>([]);
  useEffect(() => {
    setDisplayDetails(labeledDetails);
  }, [labeledDetails]);

  const updateAllDetailsPaid = async () => {
    if (!window.confirm("画面に表示されている明細を支払い済みにします。\n※現在表示されていない明細は精算されません。\n\nよろしいですか？"))
      return;
    const targetDetails = labeledDetails.filter(
      (item) => !item.paidByUserA || !item.paidByUserB
    );
    console.log(`update targetDetails=${JSON.stringify(targetDetails)}`);

    refreshAuthToken();
    for (const target of targetDetails) {
      update(target);
    }
    alert(`画面に表示されている明細を支払い済みに更新しました.`);
  };

  const update = async (detail: Schema["Detail"]) => {
    const target = {
      id: detail.id ?? "",
      name: detail.name,
      price: detail.price,
      label: detail.label,
      paidByUserA: true,
      paidByUserB: true,
      paidAt: detail.paidAt,
    };
    const { data: updatedDetail, errors } = await client.models.Detail.update(target);
    if (errors) {
      alert(`認証エラーが発生しました。ログアウトします。: ${JSON.stringify(errors)}`);
      signOut();
    }
    
    console.log(`updatedDetail=${JSON.stringify(updatedDetail)}`);
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
        {labeledDetails.filter((item) => !item.paidByUserA || !item.paidByUserB).length}{" "}
        件
      </div>
      <div className="text-right  mb-3 mt-3">
        <span
          onClick={updateAllDetailsPaid}
          className="bg-purple-400 text-white font-bold py-2 px-2 rounded-full inline-flex"
        >
          支払い済みにする
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

      {displayDetails
        .filter((detail) => !detail.paidByUserA || !detail.paidByUserB)
        .sort((a, b) => {
          const aPaidAt = a.paidAt ? new Date(a.paidAt).getTime() : 0;
          const bPaidAt = b.paidAt ? new Date(b.paidAt).getTime() : 0;
          return bPaidAt - aPaidAt;
        })
        .map((detail) => (
          <div key={detail.id} className="border-b-2 border-slate-400 mb-5">
            <p>
              <span className="pl-2 mr-2">
                {detail.paidByUserA ? (
                  <Image
                    src={userAImage}
                    alt="userA"
                    className="rounded-full w-10 h-10 inline"
                  />
                ) : null}
                {detail.paidByUserB ? (
                  <Image
                    src={userBImage}
                    alt="userB"
                    className="rounded-full w-10 h-10 inline"
                  />
                ) : null}
              </span>
              <span className="font-bold">{detail.name}</span>
            </p>
            <p className="flex items-end mb-2">
              <span>{priceFormatter.format(detail.price ?? 0)}</span>
              &nbsp;-&nbsp;
              <span>
                {detail.paidAt
                  ? dateFormatter.format(new Date(detail.paidAt))
                  : "支払日未入力"}
              </span>
              {detail.label && (
                <span className="bg-blue-300 font-bold py-1 px-2 ml-2 text-white rounded-full text-xs">
                  {detail.label}
                </span>
              )}
            </p>
          </div>
        ))}
    </div>
  );
};

export default Detail;
