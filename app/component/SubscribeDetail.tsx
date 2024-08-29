"use client"

import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { useEffect } from "react";

type SetDetails = {
    exec: (details: Schema["Detail"]["type"][]) => void
}

type SetLabledDetails = {
    exec: (details: Schema["Detail"]["type"][]) => void
}
const client = generateClient<Schema>();
const SubscribeDetail: React.FC<{setDetails: SetDetails, setLabledDetails: SetLabledDetails}> = ({setDetails, setLabledDetails}) => {
    useEffect(() => {
        subscribeDetails();
      }, []);
    
      const subscribeDetails = async () => {
        const sub = client.models.Detail.observeQuery().subscribe({
          next: ({ items }) => {
            if (items == undefined) {
              alert("明細取得に失敗しました");
              return;
            }
            setDetails.exec(items);
            setLabledDetails.exec(items);
          },
        });
        return () => sub.unsubscribe();
      };
    return (
        <></>
    );
}

export default SubscribeDetail;