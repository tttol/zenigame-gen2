import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import dotenv from "dotenv";
import Image from "next/image";
import React, { useState } from "react";
import { refreshAuthToken } from "../logic/Authentication";
import userAImage from "./../userA.png";
import userBImage from "./../userB.webp";

const CreateItem: React.FC<{ details: Schema["Detail"][] }> = ({ details: items }) => {
  dotenv.config();
  const USER_A = process.env.NEXT_PUBLIC_USER_A ?? "user A";
  const USER_B = process.env.NEXT_PUBLIC_USER_B ?? "user B";

  const client = generateClient<Schema>();

  const generateCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero indexed, so we add 1
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [label, setLabel] = useState("");
  const [paidAt, setPaidAt] = useState(generateCurrentDate());
  const [paidBy, setPaidBy] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");

  const handleItemNameChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemName(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handlePaidAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaidAt(e.target.value);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaidBy(e.target.value);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleCreateItem = () => {
    if (!window.confirm("明細を追加しますか？")) return;

    try {
      if (!label || label === "newLabel") {
        alert("ラベルを選択してください");
        return;
      }
      insertItem();
      alert(`
      明細を追加しました.
        品目: ${itemName}
        金額: ${price}
        ラベル: ${label}
        支払日: ${paidAt}
        ${USER_A}支払い: ${paidBy === "userA" ? "済" : "未"}
        ${USER_B}支払い: ${paidBy === "userB" ? "済" : "未"}
      `);

      setItemName("");
      setPrice("");
      setPaidAt("");
      setPaidBy("");
      handleCloseModal();
    } catch (err) {
      alert(`明細追加に失敗しました. ${err}`);
    }
  };

  const insertItem = async () => {
    try {
      refreshAuthToken();
      const { errors, data: newDetail } = await client.models.Detail.create({
        id: generateRandomString(),
        name: itemName,
        price: Number(price),
        label: label,
        paidAt: paidAt,
        paidByUserA: paidBy === "userA",
        paidByUserB: paidBy === "userB",
      })
      console.log(errors, newDetail);
    } catch (err) {
      throw new Error(`error creating todo: ${JSON.stringify(err)}}`);
    }
  };

  function generateRandomString() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (var i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const labels = items
    .map((item) => item.label)
    .filter((label) => label !== null);

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="bg-green-400 text-white font-bold py-2 px-2 rounded-full w-10 ml-auto mb-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-400 p-4 rounded-lg text-white w-3/4">
            <h2 className="text-xl font-bold mb-4">明細を追加</h2>
            <input
              type="text"
              value={itemName}
              onChange={handleItemNameChnage}
              className="border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full text-slate-800  bg-white"
              placeholder="品目"
            />
            <input
              type="number"
              value={price}
              onChange={handlePriceChange}
              className="border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full text-slate-800 bg-white"
              placeholder="金額"
            />
            <select
              value={label}
              onChange={(e) => {
                setSelectedLabel(e.target.value);
                setLabel(e.target.value);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full text-slate-800 bg-white"
            >
              <option value="">ラベルを選択してください</option>
              {labels.map((l) => (
                <option key={l} value={l ?? ""}>
                  {l}
                </option>
              ))}
              <option value="newLabel">ラベルを新規作成</option>
            </select>
            {selectedLabel === "newLabel" && (
              <input
                type="text"
                onChange={handleLabelChange}
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full text-slate-800 bg-white"
                placeholder="新規に作成するラベル名を入力してください"
              />
            )}

            <input
              type="date"
              value={paidAt}
              onChange={handlePaidAtChange}
              className="border border-gray-300 rounded-lg mb-4 px-3 py-2 w-full text-slate-800 bg-white"
              placeholder="支払い発生日"
            />

            <div className="flex items-center">
              <input
                id="paidByUserA"
                type="radio"
                value="userA"
                checked={paidBy === "userA"}
                onChange={handleRadioChange}
                className="mr-2 bg-white"
              />
              <label htmlFor="paidByUserA">
                <span>{USER_A}支払い</span>
                <Image
                  src={userAImage}
                  alt="userA"
                  className="rounded-full w-7 h-7 inline"
                />
              </label>
            </div>

            <div className="flex items-center mb-3">
              <input
                id="paidByuserB"
                type="radio"
                value="userB"
                checked={paidBy === "userB"}
                onChange={handleRadioChange}
                className="mr-2"
              />
              <label htmlFor="paidByuserB">
                <span>{USER_B}支払い</span>
                <Image
                  src={userBImage}
                  alt="userB"
                  className="rounded-full w-7 h-7 inline"
                />
              </label>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateItem}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateItem;
