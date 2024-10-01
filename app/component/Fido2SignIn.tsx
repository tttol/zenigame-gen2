"use client";
import { usePasswordless } from "amazon-cognito-passwordless-auth/react";
import { useState } from "react";
import Loading from "./Loading";

export default function Fido2SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const { authenticateWithFido2 } = usePasswordless();
  const authenticate = async () => {
    try {
      setIsLoading(true);
      const auth = authenticateWithFido2();
      await auth.signedIn;

      //再読込して認証後のページへ遷移させる
      window.location.reload(); 
    } catch (err: unknown) {
      alert(`認証に失敗もしくはキャンセルされました. ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-slate-600">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center">
          <Loading />
        </div>
      )}
      <div className="text-xl text-center font-bold">Face IDでログインする</div>
      <div className="text-center mb-5 font-bold">
        <button
          onClick={authenticate}
          className="bg-[#047d95] hover:bg-[#19535f] text-white p-2 rounded-sm mt-5 flex mx-auto"
        >
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
          Face IDでログイン
        </button>
      </div>
      <hr className="bg-slate-800" />
      <div className="text-lg text-center font-bold">
        メールアドレス&パスワードでログインする
      </div>
    </div>
  );
}
