"use client";
import { Schema } from "@/amplify/data/resource";
import config from "@/amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { useEffect, useState } from "react";
import CreateItem from "./CreateItem";
import Detail from "./Detail";
import LabeledSum from "./LabeledSum";
import LoginUserInfo from "./LoginUserInfo";
import SignOutButton from "./SignOutButton";
import Sum from "./Sum";

Amplify.configure(config);
const client = generateClient<Schema>();

const Data: React.FC = () => {
  const [details, setDetails] = useState<Schema["Detail"]["type"][]>([]);
  const [labeledDetails, setLabledDetails] = useState<
    Schema["Detail"]["type"][]
  >([]);
  const [filteredLabel, setFilteredLabel] = useState("all");


  useEffect(() => {
    subscribeDetails();
  }, []);

  const subscribeDetails = async () => {
    const sub = client.models.Detail.observeQuery().subscribe({
      next: ({ items }) => {
        if (items == undefined) {
          alert("明細取得に失敗しました");
          return;
        }
        setDetails(items);
        setLabledDetails(items);
      },
    });
    return () => sub.unsubscribe();
  };


  const handleLabelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switch (e.target.value) {
      case undefined:
        break;
      case "all":
        setLabledDetails(details);
        setFilteredLabel(e.target.value);
        break;
      case "ラベルなし":
        const noLabelDetails = details.filter((detail) => detail.label === "");
        setLabledDetails(noLabelDetails);
        setFilteredLabel(e.target.value);
        break;
      default:
        const filterdDetails = details.filter(
          (detail) => detail.label === e.target.value
        );
        setLabledDetails(filterdDetails);
        setFilteredLabel(e.target.value);
        break;
    }
  };
  return (
    <>
      <Authenticator>
        {({ signOut, user }) => (
          <>
            <LoginUserInfo loginId={user?.signInDetails?.loginId ?? ""} />
            <div className="text-right">
              <SignOutButton signOutFunc={signOut} />
            </div>
            <Sum labeledDetails={labeledDetails} />
            <div className="mb-[3.5rem]"></div>
            <LabeledSum allDetails={details} label="買い出し" />
            <CreateItem details={details} />
            <div className="text-right  mb-3 mt-3 text-lg">
              ラベル：
              <select
                value={filteredLabel}
                onChange={handleLabelChange}
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4 w-auto text-slate-800 bg-white"
              >
                <option key="all" value="all">
                  全ての明細を表示
                </option>
                {Array.from(
                  new Set(
                    details.map((d) =>
                      d.label === "" ? "ラベルなし" : d.label
                    )
                  )
                ).map((l) => (
                  <option key={l} value={l ?? ""}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <Detail labeledDetails={labeledDetails} />
          </>
        )}
      </Authenticator>
    </>
  );
};

export default Data;
