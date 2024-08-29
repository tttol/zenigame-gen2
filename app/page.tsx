import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import AppVersion from "./component/AppVersion";
import Data from "./component/Data";
import Header from "./component/Header";
import LoginUserInfo from "./component/LoginUserInfo";

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <div className="w-[90%] mx-auto">
          <AppVersion />
          <Data />
        </div>
      </main>
    </>
  );
};
export default Home;
