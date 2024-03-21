"use client"

import { Schema } from '@/amplify/data/resource';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/api';
import { useEffect, useState } from 'react';
import CreateItem from './component/CreateItem';
import Detail from './component/Detail';
import Sum from './component/Sum';
import Version from './component/Version';

const client = generateClient<Schema>();

const Home: React.FC = () => {
  const [details, setDetails] = useState<Schema["Detail"][]>([]);
  const [displayDetails, setDisplayDetails] = useState<Schema["Detail"][]>([]);
  
  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const { data } = await client.models.Detail.list();
      console.log(`fetched Detail data: ${JSON.stringify(data)}`);
      setDetails(data ?? []);
      setDisplayDetails(data ?? []);
    } catch (error) {
      alert(`サーバーからの明細取得に失敗しました. ${JSON.stringify(error)}`);
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const filterdDetails = displayDetails.filter((detail) => detail.label === "ベビー用品");
      setDisplayDetails(filterdDetails);
    } else {
      setDisplayDetails(details);
    }
  };

  return (
    <Authenticator signUpAttributes={['email']}>
      <header className="bg-blue-900 text-white p-4 text-center font-black text-4xl">ZENIGAME</header>
      <main>
        <div className='w-[90%] mx-auto'>
          <Version />
          <Sum details={displayDetails} />
          <CreateItem details={displayDetails} />
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
          <Detail details={displayDetails} />
        </div>
      </main>
    </Authenticator>
  )
}
export default Home;