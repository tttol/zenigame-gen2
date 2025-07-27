import { Schema } from "@/amplify/data/resource";
import { render, screen } from "@testing-library/react";
import { beforeAll, expect, test } from "vitest";
import DualSum from "./DualSum";

beforeAll(() => {
  process.env.NEXT_PUBLIC_USER_A = "User A";
  process.env.NEXT_PUBLIC_USER_B = "User B";
});

test("DualSum", () => {
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
    <DualSum 
      labeledDetails={details as Schema["Detail"]["type"][]} 
      priceFormatter={priceFormatter}
    />
  );

  const actualSumA =
    screen.getByText("User A - 未払い差引合計").nextSibling?.textContent;
  expect(actualSumA).toBe("￥1,750");

  const actualSumB =
    screen.getByText("User B - 未払い差引合計").nextSibling?.textContent;
  expect(actualSumB).toBe("￥0");
});