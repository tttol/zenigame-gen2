import { Schema } from "@/amplify/data/resource";
import { useState } from "react";
import LabeledSum from "./LabeledSum";

const Labeled: React.FC<{
  allDetails: Schema["Detail"]["type"][];
  labels: Schema["Label"]["type"][];
}> = ({ allDetails: allDetails, labels: labels }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border border-slate-700 rounded-lg">
      <button
        onClick={toggleAccordion}
        className={`w-full px-4 py-3 text-left bg-slate-700 flex items-center transition-colors ${
          isOpen ? "rounded-t-lg" : "rounded-lg"
        }`}
      >
        <span className="text-gray-500 mr-2">
          {isOpen ? "🔽" : "▶️"}
        </span>
        <span className="text-white font-bold text-xl">ラベル別集計</span>
      </button>
      <div className={`transition-height ${isOpen ? "show" : ""}`}>
        <div className="border-t border-slate-700 p-4 bg-slate-700 space-y-2 rounded-b-lg">
          {labels.map((label) => (
            <LabeledSum key={label.id} allDetails={allDetails} label={label.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Labeled;
