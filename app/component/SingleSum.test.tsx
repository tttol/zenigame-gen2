import { Schema } from "@/amplify/data/resource";
import { render, screen } from "@testing-library/react";
import { beforeAll, expect, test } from "vitest";
import SingleSum from "./SingleSum";

beforeAll(() => {
  process.env.NEXT_PUBLIC_USER_A = "User A";
  process.env.NEXT_PUBLIC_USER_B = "User B";
});

test("SingleSum", () => {
  const details: Schema["Detail"]["type"][] = [
    {
      id: "1",
      name: "Test Detail 1",
      price: 1000,
      label: "Test Label 1",
      paidByUserA: true,
      paidByUserB: false,
      paidAt: "2022-01-01",
      createdAt: "2000-01-01",
      updatedAt: "2000-01-01",
    },
    {
      id: "2",
      name: "Test Detail 2",
      price: 2000,
      label: "Test Label 2",
      paidByUserA: false,
      paidByUserB: true,
      paidAt: "2022-02-01",
      createdAt: "2000-01-01",
      updatedAt: "2000-01-01",
    },
    {
      id: "3",
      name: "Test Detail 3",
      price: 2500,
      label: "Test Label 3",
      paidByUserA: false,
      paidByUserB: true,
      paidAt: "2022-02-01",
      createdAt: "2000-01-01",
      updatedAt: "2000-01-01",
    },
  ];

  const priceFormatter = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  });

  render(
    <SingleSum 
      labeledDetails={details as Schema["Detail"]["type"][]} 
      priceFormatter={priceFormatter}
    />
  );

  const debtAmount =
    screen.getByText("User A - 未払い額合計").nextSibling?.textContent;
  expect(debtAmount).toBe("￥4,500");

  const userAPayment = screen.getByText("User A支出: ￥1,000");
  expect(userAPayment).toBeDefined();

  const userBPayment = screen.getByText("User B支出: ￥4,500");
  expect(userBPayment).toBeDefined();

  const totalAmount = screen.getByText("総支出: ￥5,500");
  expect(totalAmount).toBeDefined();
});