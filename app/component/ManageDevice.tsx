"use client";
import { StoredCredential } from "amazon-cognito-passwordless-auth/fido2";
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
    if (!window.confirm("新規デバイスを登録します")) return;

    try {
      setIsLoading(true);
      await fido2CreateCredential({ friendlyName: deviceName });
      console.log("Regisration of FIDO2 device has succeeded.")
      alert("デバイス登録に成功しました.");
      window.location.reload();
    } catch (err: unknown) {
      console.error(`Failed to regsiter FIDO2 device. err=${err}`);
      alert(`デバイス登録に失敗しました. ${JSON.stringify(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="border-[1px] rounded mt-3 border-slate-400">
        <div
          className="cursor-pointer text-xl p-2 flex"
          onClick={handleShowDevices}
        >
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
            {fido2Credentials?.length === 0 &&
              <div>認証デバイスが登録されていません。下記のテキストボックスから登録お願いします。</div>}
            {fido2Credentials?.map((credential: StoredCredential) => (
              <Device key={credential.credentialId} credential={credential} />
            ))}

            <input
              type="text"
              placeholder="デバイス名"
              className="border border-gray-300 rounded p-1 text-slate-800 bg-white"
              onChange={handleDeviceNameChange}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-lg mt-3 ml-2"
              onClick={createCredential}
            >
              新規登録
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Device({credential}: {credential: StoredCredential}) {
  return (
    <div key={credential.credentialId}>
      <div className="flex">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="green"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="font-bold text-lg">{credential.friendlyName}</div>
      </div>
      <div>作成日時: {credential.createdAt.toISOString()}</div>
      <hr className="mb-2" />
    </div>
  );
}
