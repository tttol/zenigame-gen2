import "@/app/passwordless.css";
import { usePasswordless } from "amazon-cognito-passwordless-auth/react";
export default function ManageDevice() {
  const { toggleShowAuthenticatorManager } = usePasswordless();
  return (
    <button onClick={toggleShowAuthenticatorManager}>
      Manage authenticators
    </button>
  );
}
