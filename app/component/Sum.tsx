import { Schema } from "@/amplify/data/resource";
import { useState } from "react";
import dotenv from "dotenv";

dotenv.config();

enum Mode {
  DUAL = "dual",
  SINGLE = "single"
}

const Sum: React.FC<{ labeledDetails: Schema["Detail"]["type"][] }> = ({
  labeledDetails: labeledDetails,
}) => {
  dotenv.config();
  const [activeTab, setActiveTab] = useState<Mode>(Mode.DUAL);
  const USER_A = process.env.NEXT_PUBLIC_USER_A ?? "User A";
  const USER_B = process.env.NEXT_PUBLIC_USER_B ?? "User B";

  const getDebtUserA = (details: Schema["Detail"]["type"][]) =>
    details
      .filter((detail) => !detail.paidByUserA)
      .reduce((sum, detail) => sum + (detail.price ?? 0), 0);
  const getDebtUserB = (details: Schema["Detail"]["type"][]) =>
    details
      .filter((detail) => !detail.paidByUserB)
      .reduce((sum, detail) => sum + (detail.price ?? 0), 0);

  const debtUserA = getDebtUserA(labeledDetails);
  const debtUserB = getDebtUserB(labeledDetails);

  const priceFormatter = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  });

  const renderSummaryA = () => (
    <>
      <div className="min-h-max m-1 p-3 bg-blue-400 text-slate-100 rounded-xl">
        <div>
          <p>{USER_A} - 未払い差引合計</p>
          <p className="font-bold text-3xl">
            {priceFormatter.format(Math.max((debtUserA - debtUserB) / 2, 0))}
          </p>
          <p className="text-slate-300 mt-2">
            {priceFormatter.format(debtUserA / 2)}(差引前)
          </p>
        </div>
      </div>
      <div className="min-h-max m-1 mt-3 p-3 bg-pink-400 text-slate-100 rounded-xl">
        <div>
          <p>{USER_B} - 未払い差引合計</p>
          <p className="font-bold text-3xl">
            {priceFormatter.format(Math.max((debtUserB - debtUserA) / 2, 0))}
          </p>
          <p className="text-slate-300 mt-2">
            {priceFormatter.format(debtUserB / 2)}(差引前)
          </p>
        </div>
      </div>
    </>
  );

  const renderSummaryB = () => (
    <div className="min-h-max m-1 p-3 bg-green-400 text-slate-100 rounded-xl">
      <div>
        <p className="text-lg font-medium">別のサマリー (ダミー)</p>
        <p className="text-sm mt-2">今月の総支出: {priceFormatter.format(labeledDetails.reduce((sum, detail) => sum + (detail.price ?? 0), 0))}</p>
        <p className="text-sm">登録アイテム数: {labeledDetails.length}件</p>
        <p className="text-sm">平均単価: {priceFormatter.format(labeledDetails.length > 0 ? labeledDetails.reduce((sum, detail) => sum + (detail.price ?? 0), 0) / labeledDetails.length : 0)}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-max bg-blue-600 text-slate-100 rounded-xl my-3 overflow-hidden">
      <div className="flex bg-blue-900 rounded-t-xl">
        <button
          onClick={() => setActiveTab(Mode.DUAL)}
          className={`flex-1 px-4 py-3 text-2xl font-bold transition-all duration-200 ${
            activeTab === Mode.DUAL
              ? "bg-blue-600 text-white rounded-tl-xl"
              : "bg-blue-900 text-blue-300 hover:bg-blue-700 hover:text-white rounded-tl-xl"
          }`}
        >
          👯折半モード
        </button>
        <button
          onClick={() => setActiveTab(Mode.SINGLE)}
          className={`flex-1 px-4 py-3 text-2xl font-bold transition-all duration-200 ${
            activeTab === Mode.SINGLE
              ? "bg-blue-600 text-white rounded-tr-xl"
              : "bg-blue-900 text-blue-300 hover:bg-blue-700 hover:text-white rounded-tr-xl"
          }`}
        >
          💪一馬力モード
        </button>
      </div>
      
      <div className="p-3">
        {activeTab === Mode.DUAL ? renderSummaryA() : renderSummaryB()}
      </div>
    </div>
  );
};

export default Sum;
