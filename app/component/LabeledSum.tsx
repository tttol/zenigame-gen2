import { Schema } from "@/amplify/data/resource";
import dotenv from "dotenv";

dotenv.config();

const LabeledSum: React.FC<{ allDetails: Schema["Detail"]["type"][], label: string }> = ({
  allDetails: allDetails, label: label
}) => {
  dotenv.config();
  const USER_A = process.env.NEXT_PUBLIC_USER_A ?? "User A";
  const USER_B = process.env.NEXT_PUBLIC_USER_B ?? "User B";

  const getLabeldSum = (
    details: Schema["Detail"]["type"][],
    label: string
  ): [sumUserA: number, sumUserB: number] => {
    // A：支払済　B：未払い
    const sumA = details
      .filter((d) => d.paidByUserA && !d.paidByUserB && d.label === label)
      .reduce((sum, d) => sum + (d.price ?? 0), 0);

    // A：未払い　B：支払済
    const sumB = details
      .filter((d) => !d.paidByUserA && d.paidByUserB)
      .reduce((sum, d) => sum + (d.price ?? 0), 0);
    return [sumA, sumB];
  };

  const [sumA, sumB] = getLabeldSum(allDetails, label);

  const priceFormatter = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  });

  return (
    <div className="min-h-max p-3 bg-blue-600 text-slate-100 rounded-xl my-3">
      <p className="text-3xl mb-3">「{label}」の支出合計</p>
      <div className="min-h-max m-1 p-3 bg-blue-400 text-slate-100 rounded-xl">
        <div>
          <p>{USER_A} - 支出合計</p>
          <p className="font-bold text-3xl">{priceFormatter.format(sumA)}</p>
        </div>
      </div>
      <div className="min-h-max m-1 mt-3  p-3 bg-pink-400 text-slate-100 rounded-xl">
        <div>
          <p>{USER_B} - 支出合計</p>
          <p className="font-bold text-3xl">{priceFormatter.format(sumB)}</p>
        </div>
      </div>
    </div>
  );
};

export default LabeledSum;
