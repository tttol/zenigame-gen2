import { Schema } from "@/amplify/data/resource";

interface SingleSummaryProps {
  labeledDetails: Schema["Detail"]["type"][];
  priceFormatter: Intl.NumberFormat;
}

const SingleSummary: React.FC<SingleSummaryProps> = ({
  labeledDetails,
  priceFormatter,
}) => {
  return (
    <div className="min-h-max m-1 p-3 bg-green-400 text-slate-100 rounded-xl">
      <div>
        <p className="text-lg font-medium">別のサマリー (ダミー)</p>
        <p className="text-sm mt-2">今月の総支出: {priceFormatter.format(labeledDetails.reduce((sum, detail) => sum + (detail.price ?? 0), 0))}</p>
        <p className="text-sm">登録アイテム数: {labeledDetails.length}件</p>
        <p className="text-sm">平均単価: {priceFormatter.format(labeledDetails.length > 0 ? labeledDetails.reduce((sum, detail) => sum + (detail.price ?? 0), 0) / labeledDetails.length : 0)}</p>
      </div>
    </div>
  );
};

export default SingleSummary;