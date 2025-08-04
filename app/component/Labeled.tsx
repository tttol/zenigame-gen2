import { Schema } from "@/amplify/data/resource";
import LabeledSum from "./LabeledSum";

const Labeled: React.FC<{
  allDetails: Schema["Detail"]["type"][];
  labels: Schema["Label"]["type"][];
}> = ({ allDetails, labels }) => {
  return (
    <div>
      {labels.map((label) => (
        <LabeledSum key={label.id} allDetails={allDetails} label={label.name} />
      ))}
    </div>
  );
};

export default Labeled;
