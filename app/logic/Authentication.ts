import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

const refreshAuthToken = () => {
  try {
    // Cognito認証トークンをリフレッシュする
    // https://docs.amplify.aws/gen2/build-a-backend/auth/manage-user-session/#retrieve-a-user-session
    console.log("Refreshing auth token...");
    return fetchAuthSession();
  } catch (err) {
    console.log(err);
  }
}


const getCurrentUsername = async (): Promise<string> => {
  const username: string | void = await getCurrentUser()
    .then((user) => user.username)
    .catch((err) => console.error(err));

  return typeof username === "string" ? username : "";
}

export { getCurrentUsername, refreshAuthToken };

