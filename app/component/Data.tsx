"use client";
import { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";
import { Passwordless } from "amazon-cognito-passwordless-auth";
import { PasswordlessContextProvider } from "amazon-cognito-passwordless-auth/react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { useEffect, useState } from "react";
import CreateItem from "./CreateItem";
import Detail from "./Detail";
import Fido2SignIn from "./Fido2SignIn";
import LabeledSum from "./LabeledSum";
import LoginUserInfo from "./LoginUserInfo";
import ManageDevice from "./ManageDevice";
import SignOutButton from "./SignOutButton";
import Sum from "./Sum";

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
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    const { errors, data: items } = await client.models.Detail.list({
      filter: {
        or: [{ paidByUserA: { eq: false } }, { paidByUserB: { eq: false } }],
      },
    });
    if (errors) {
      alert(`明細取得に失敗しました ${JSON.stringify(errors)}`);
      return;
    }
    if (items == undefined) return;

    console.debug(`${items.length}, ${items}`);
    setDetails(items);
    setLabledDetails(items);
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
        return <Fido2SignIn />;
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
      </PasswordlessContextProvider>
    </>
  );
};

export default Data;
