import { Schema } from "@/amplify/data/resource";
import { useState } from "react";
import dotenv from "dotenv";
import DualSum from "./DualSum";
import SingleSum from "./SingleSum";

dotenv.config();

enum Mode {
  DUAL = "dual",
  SINGLE = "single"
}

const Sum: React.FC<{ labeledDetails: Schema["Detail"]["type"][] }> = ({
  labeledDetails: labeledDetails,
}) => {
  dotenv.config();
  const [activeTab, setActiveTab] = useState<Mode>(Mode.SINGLE);

  const priceFormatter = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  });


  return (
    <div className="min-h-max bg-blue-600 text-slate-100 rounded-xl my-3 overflow-hidden">
      <div className="flex bg-blue-900 rounded-t-xl">
        <button
          onClick={() => setActiveTab(Mode.DUAL)}
          className={`flex-1 px-4 py-3 text-xl font-bold transition-all duration-200 ${
            activeTab === Mode.DUAL
              ? "bg-blue-600 text-white rounded-tl-xl"
              : "bg-blue-900 text-blue-300 hover:bg-blue-700 hover:text-white rounded-tl-xl"
          }`}
        >
          👯折半モード
        </button>
        <button
          onClick={() => setActiveTab(Mode.SINGLE)}
          className={`flex-1 px-4 py-3 text-xl font-bold transition-all duration-200 ${
            activeTab === Mode.SINGLE
              ? "bg-blue-600 text-white rounded-tr-xl"
              : "bg-blue-900 text-blue-300 hover:bg-blue-700 hover:text-white rounded-tr-xl"
          }`}
        >
          💪一馬力モード
        </button>
      </div>
      
      <div className="p-3">
        {activeTab === Mode.DUAL ? (
          <DualSum 
            labeledDetails={labeledDetails} 
            priceFormatter={priceFormatter} 
          />
        ) : (
          <SingleSum 
            labeledDetails={labeledDetails} 
            priceFormatter={priceFormatter} 
          />
        )}
      </div>
    </div>
  );
};

export default Sum;
