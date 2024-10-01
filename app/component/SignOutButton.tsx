import { UseAuthenticator } from "@aws-amplify/ui-react";

const SignOutButton: React.FC<{signOutFunc: UseAuthenticator["signOut"] | undefined}> = ({signOutFunc: signOutFunc}) => {
  return (
    <>
      <button
        onClick={signOutFunc}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg mt-3"
      >
        サインアウト
      </button>
    </>
  );
};

export default SignOutButton;
