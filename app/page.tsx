import "@aws-amplify/ui-react/styles.css";
import AppVersion from "./component/AppVersion";
import Data from "./component/Data";
import Header from "./component/Header";

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
