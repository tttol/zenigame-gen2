import { fetchAuthSession } from "aws-amplify/auth";

const refreshAuthToken = async () => {
  try {
    return  (await fetchAuthSession()).tokens ?? {};
  } catch (err) {
    console.log(err);
  }
}

export { refreshAuthToken };
