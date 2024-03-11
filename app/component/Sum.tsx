import { Schema } from "@/amplify/data/resource";
import dotenv from "dotenv";
import React from 'react';

dotenv.config();

const Sum: React.FC<{ details :Schema["Detail"][] }> = ({ details: details }) => {
    const getDebtTol = (details :Schema["Detail"][]) => details.filter((detail) => !detail.paidByTol).reduce((sum, detail) => sum + (detail.price ?? 0), 0);
    const getDebtspon = (details :Schema["Detail"][]) => details.filter((detail) => !detail.paidBySpon).reduce((sum, detail) => sum + (detail.price ?? 0), 0);
    
    const debtTol = getDebtTol(details);
    const debtSpon = getDebtspon(details);

    const priceFormatter = new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
      });

    return (
        <div className='min-h-max p-3 bg-blue-600 text-slate-100 rounded-xl my-3'>
            <p className='text-3xl mb-3'>SUMMARY</p>
            <div className='min-h-max m-1 p-3 bg-blue-400 text-slate-100 rounded-xl'>
                <div>
                    <p>TOL - 未払い差引合計</p>
                    <p className='font-bold text-3xl'>{priceFormatter.format(Math.max((debtTol - debtSpon)/2, 0))}</p>
                    <p className='text-slate-300 mt-2'>{priceFormatter.format(debtTol/2)}(差引前)</p>
                </div>
            </div>
            <div className='min-h-max m-1 mt-3  p-3 bg-pink-400 text-slate-100 rounded-xl'>
                <div>
                    <p>SPON - 未払い差引合計</p>
                    <p className='font-blod text-3xl'>{priceFormatter.format(Math.max((debtSpon - debtTol)/2, 0))}</p>
                    <p className='text-slate-300 mt-2'>{priceFormatter.format(debtSpon/2)}(差引前)</p>
                </div>
            </div>
        </div>
    );
};

export default Sum;
