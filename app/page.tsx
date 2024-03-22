"use client"

import { Schema } from '@/amplify/data/resource';
import { WithAuthenticatorProps, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/api';
import { useEffect, useState } from 'react';
import CreateItem from './component/CreateItem';
import Detail from './component/Detail';
import Sum from './component/Sum';
import Version from './component/Version';
import { refreshAuthToken } from './logic/Authentication';

const client = generateClient<Schema>();

const Home: React.FC = ({ signOut, user }: WithAuthenticatorProps)  => {
  const [details, setDetails] = useState<Schema["Detail"][]>([]);
  const [displayDetails, setDisplayDetails] = useState<Schema["Detail"][]>([]);
  
  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    refreshAuthToken();
    const { errors,  data } = await client.models.Detail.list();
    if (errors) {
      console.error(`errors: ${JSON.stringify(errors)}`);
    }
    console.log(`fetched Detail data: ${JSON.stringify(data)}`);

    setDetails(Array.isArray(data) ? data : []);
    setDisplayDetails(Array.isArray(data) ? data : []);
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
    <>
      <header className="bg-blue-900 text-white p-4 text-center font-black text-4xl">ZENIGAME</header>
      <main>
        <div className='w-[90%] mx-auto'>
          <button onClick={signOut} className="bg-blue-500 text-white p-2 rounded-lg mt-3 ml-auto">Sign Out</button>
          <Version />
          <div className='text-right'>Username: {user?.username}</div>
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
    </>
  );
}
export default withAuthenticator(Home);