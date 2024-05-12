"use client"

import { Schema } from '@/amplify/data/resource';
import { WithAuthenticatorProps, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/api';
import { signOut } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import CreateItem from './component/CreateItem';
import Detail from './component/Detail';
import Sum from './component/Sum';
import Version from './component/Version';

const client = generateClient<Schema>();

const Home: React.FC = ({ user }: WithAuthenticatorProps)  => {
  const [details, setDetails] = useState<Schema["Detail"][]>([]);
  const [displayDetails, setDisplayDetails] = useState<Schema["Detail"][]>([]);
  
  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    const { errors,  data } = await client.models.Detail.list();
    if (errors) {
      alert(`認証エラーが発生しました。ログアウトします。: ${JSON.stringify(errors)}`);
      signOut();
    }

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

  const logout = () => signOut()

  return (
    <>
      <header className="bg-blue-900 text-white p-4 text-center font-black text-4xl">ZENIGAME</header>
      <main>
        <div className='w-[90%] mx-auto'>
          <div className='text-right'>
            <button onClick={logout} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg mt-3">Sign Out</button>
          </div>
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