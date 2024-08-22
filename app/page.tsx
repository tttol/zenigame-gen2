"use client";

import { Schema } from "@/amplify/data/resource";
import {
  WithAuthenticatorProps,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { signOut } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import config from "../amplify_outputs.json";
import CreateItem from "./component/CreateItem";
import Detail from "./component/Detail";
import LabeledSum from "./component/LabeledSum";
import Sum from "./component/Sum";
import Version from "./component/Version";

Amplify.configure(config);

const client = generateClient<Schema>();

const Home: React.FC = ({ user }: WithAuthenticatorProps) => {
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
      next: ({items}) => {
        if (items == undefined) {
          alert("明細取得に失敗しました")
          return;
        }
        setDetails(items);
        setLabledDetails(items);
      }
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
      <header className="bg-blue-900 text-white p-4 text-center font-black text-4xl">
        ZENIGAME
      </header>
      <main>
        <div className="w-[90%] mx-auto">
          <div className="text-right">
            <button
              onClick={() => signOut()}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg mt-3"
            >
              Sign Out
            </button>
          </div>
          <Version />
          <div className="text-right">
            Login ID: {user?.signInDetails?.loginId}
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
                  details.map((d) => (d.label === "" ? "ラベルなし" : d.label))
                )
              ).map((l) => (
                <option key={l} value={l ?? ""}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <Detail labeledDetails={labeledDetails} />
        </div>
      </main>
    </>
  );
};
export default withAuthenticator(Home);