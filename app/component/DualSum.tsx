import { Schema } from "@/amplify/data/resource";
import dotenv from "dotenv";

dotenv.config();

interface DualSumProps {
  labeledDetails: Schema["Detail"]["type"][];
  priceFormatter: Intl.NumberFormat;
}

const DualSum: React.FC<DualSumProps> = ({
  labeledDetails,
  priceFormatter,
}) => {
  dotenv.config();
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

  return (
    <>
      <div className="min-h-max m-1 p-3 bg-blue-400 text-slate-100 rounded-xl">
        <div>
          <p>{USER_A} - 未払い差引額合計</p>
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
          <p>{USER_B} - 未払い差引額合計</p>
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
};

export default DualSum;