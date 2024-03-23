import { AuthTokens, fetchAuthSession } from "aws-amplify/auth";

const refreshAuthToken = async (): Promise<AuthTokens | undefined> => {
  try {
    // Cognito認証トークンをリフレッシュする
    // https://docs.amplify.aws/gen2/build-a-backend/auth/manage-user-session/#retrieve-a-user-session
    return (await fetchAuthSession()).tokens;
  } catch (err) {
    console.log(err);
  }
}

export { refreshAuthToken };
