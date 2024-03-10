import dotenv from "dotenv";
import React from 'react';

dotenv.config();

const Sum: React.FC<{ items: Item[] }> = ({ items }) => {
    const getDebtTol = (items :Item[]) => items.filter((item) => !item.paidByTol).reduce((sum, item) => sum + item.price, 0);
    const getDebtspon = (items :Item[]) => items.filter((item) => !item.paidBySpon).reduce((sum, item) => sum + item.price, 0);
    
    const debtTol = getDebtTol(items);
    const debtSpon = getDebtspon(items);

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
