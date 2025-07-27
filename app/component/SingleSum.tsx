import { Schema } from "@/amplify/data/resource";
import dotenv from "dotenv";

dotenv.config();

interface SingleSumProps {
  labeledDetails: Schema["Detail"]["type"][];
  priceFormatter: Intl.NumberFormat;
}

const SingleSum: React.FC<SingleSumProps> = ({
  labeledDetails,
  priceFormatter,
}) => {
  dotenv.config();
  const USER_A = process.env.NEXT_PUBLIC_USER_A ?? "User A";
  const USER_B = process.env.NEXT_PUBLIC_USER_B ?? "User B";

  const getUserAPaidAmount = (details: Schema["Detail"]["type"][]) =>
    details
      .filter((detail) => detail.paidByUserA)
      .reduce((sum, detail) => sum + (detail.price ?? 0), 0);
  const getUserBPaidAmount = (details: Schema["Detail"]["type"][]) =>
    details
      .filter((detail) => detail.paidByUserB)
      .reduce((sum, detail) => sum + (detail.price ?? 0), 0);

  const totalAmount = labeledDetails.reduce((sum, detail) => sum + (detail.price ?? 0), 0);
  const userAPaidAmount = getUserAPaidAmount(labeledDetails);
  const userBPaidAmount = getUserBPaidAmount(labeledDetails);

  return (
    <div className="min-h-max m-1 p-3 bg-blue-400 text-slate-100 rounded-xl">
      <div>
        <p>{USER_A} - 未払い額合計</p>
        <p className="font-bold text-3xl">
          {priceFormatter.format(userBPaidAmount)}
        </p>
        <p className="text-slate-300 mt-2">
          {USER_A}支出: {priceFormatter.format(userAPaidAmount)}
        </p>
        <p className="text-slate-300 mt-1">
          {USER_B}支出: {priceFormatter.format(userBPaidAmount)}
        </p>
        <p className="text-slate-300 mt-1">
          総支出: {priceFormatter.format(totalAmount)}
        </p>
      </div>
    </div>
  );
};

export default SingleSum;