"use client"

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { useEffect, useState } from 'react';
// import awsExports from "../aws-exports";
// import { listItems } from '../graphql/queries';
import CreateItem from './component/CreateItem';
import Detail from './component/Detail';
import Sum from './component/Sum';
import Version from './component/Version';

// Amplify.configure(awsExports);

const client = generateClient();

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    fetchItems();
  }, []);

  const [displayItems, setDisplayItems] = useState<Item[]>([]);

  const fetchItems = async () => {
    // const { data } = await client.models.Gen2Sample.list();
    // console.log(`fetched Gen2Sample data: ${data}`);
    // setSamples(data ?? []);

    try {
      const result = await client.graphql({
        query: listItems,
      });
      setItems(result.data.listItems.items);
      setDisplayItems(result.data.listItems.items);
    } catch (err) {
      alert(`サーバーからの明細取得に失敗しました. ${JSON.stringify(err)}`);
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const filterdItems = displayItems.filter((item) => item.label === "ベビー用品");
      setDisplayItems(filterdItems);
    } else {
      setDisplayItems(items);
    }
  };

  return (
    <Authenticator signUpAttributes={['email']}>
      <header className="bg-blue-900 text-white p-4 text-center font-black text-4xl">ZENIGAME</header>
      <main>
        <div className='w-[90%] mx-auto'>
          <Version />
          <Sum items={displayItems} />
          <CreateItem items={displayItems} />
          <div className="text-right  mb-3 mt-3 text-lg">
            <input
              id="filter"
              type="checkbox"
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="filter">
              <span>ベビー用品のみ表示する
              </span>
            </label>
          </div>
          <Detail items={displayItems} />
        </div>
      </main>
    </Authenticator>
  )
}
export default Home;