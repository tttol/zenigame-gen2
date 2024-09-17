"use client";
import { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";
import { Passwordless } from "amazon-cognito-passwordless-auth";
import {
  Fido2Toast,
  PasswordlessContextProvider,
  usePasswordless,
} from "amazon-cognito-passwordless-auth/react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import CreateItem from "./CreateItem";
import Detail from "./Detail";
import Fido2SignIn from "./Fido2SignIn";
import LabeledSum from "./LabeledSum";
import LoginUserInfo from "./LoginUserInfo";
import SignOutButton from "./SignOutButton";
import Sum from "./Sum";
import ManageDevice from "./ManageDevice";

Amplify.configure(outputs);
Passwordless.configure({
  clientId: outputs.auth.user_pool_client_id,
  cognitoIdpEndpoint: outputs.auth.aws_region,
  fido2: {
    baseUrl: outputs.custom.fido2ApiUrl,
    authenticatorSelection: {
      userVerification: "required",
    },
  },
});

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
    try {
      const { signInDetails } = await getCurrentUser();
      if (!signInDetails) return;

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
    } catch (err: unknown) {
      console.error(`subscribe err=${JSON.stringify(err)}`);
    }
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

  const signInComponent = {
    SignIn: {
      Header() {
        return Fido2SignIn();
      },
    },
  };

  return (
    <>
      <PasswordlessContextProvider enableLocalUserCache={true}>
        <Authenticator components={signInComponent} hideSignUp>
          {({ signOut, user }) => (
            <>
              <LoginUserInfo loginId={user?.signInDetails?.loginId ?? ""} />
              <div className="text-right">
                <SignOutButton signOutFunc={signOut} />
              </div>
              <ManageDevice />
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
        <Fido2Toast />
      </PasswordlessContextProvider>
    </>
  );
};

export default Data;
