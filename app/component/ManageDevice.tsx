"use client";
import { usePasswordless } from "amazon-cognito-passwordless-auth/react";
import React, { useState } from "react";
import Loading from "./Loading";

export default function ManageDevice() {
  const [isLoading, setIsLoading] = useState(false);
  const [deviceName, setDeviceName] = useState("default device name");
  const [showDevices, setShowDevices] = useState(false);
  const handleDeviceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceName(e.target.value);
  };

  const handleShowDevices = () => {
    setShowDevices(!showDevices);
  };

  const { fido2Credentials, fido2CreateCredential } = usePasswordless();
  const createCredential = async () => {
    try {
      setIsLoading(true);
      await fido2CreateCredential({ friendlyName: deviceName });
      alert("デバイス登録に成功しました.");
    } catch (err: unknown) {
      alert(`デバイス登録に失敗しました. ${JSON.stringify(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="border-[1px] rounded mt-3 border-slate-400">
        <div className="cursor-pointer text-lg p-2 flex" onClick={handleShowDevices}>
          {!showDevices && <span>▶ </span>}
          {showDevices && <span>▼ </span>}
          <div className="font-bold flex items-center">
            認証デバイス一覧&nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33"
              />
            </svg>
          </div>
        </div>
        <div className={`transition-height ${showDevices ? "show" : ""}`}>
          <div className="border-t-[1px] border-r-[0.5px] border-l-[0.5px] border-b-[0.5px] border-slate-400 p-2">
            {isLoading && (
              <div className="fixed inset-0 flex items-center justify-center">
                <Loading />
              </div>
            )}
            {fido2Credentials?.map((credential) => (
              <div key={credential.credentialId} className="flex">
                <div>登録名: {credential.friendlyName}</div>
                <div className="ml-3">
                  作成日時: {credential.createdAt.toISOString()}
                </div>
              </div>
            ))}

            <p className="text-lg">デバイス登録</p>
            <input
              type="text"
              placeholder="デバイス名"
              className="border border-gray-300 rounded p-1 text-slate-800 bg-white"
              onChange={handleDeviceNameChange}
            />
            <button onClick={createCredential}>登録実行</button>
          </div>
        </div>
      </div>
    </>
  );
}
