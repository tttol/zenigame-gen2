import { Schema } from "@/amplify/data/resource";
import { render, screen } from "@testing-library/react";
import { beforeAll, expect, test } from "vitest";
import LabeledSum from "./LabeledSum";

beforeAll(() => {
  process.env.NEXT_PUBLIC_USER_A = "User A";
  process.env.NEXT_PUBLIC_USER_B = "User B";
});

test("LabeledSum", () => {
  const details: Schema["Detail"]["type"][] = [
    {
      id: "1",
      name: "Test Detail 1",
      price: 1000,
      label: "test-label",
      paidByUserA: true,
      paidByUserB: false,
      paidAt: "2000-01-01",
      createdAt: "2000-01-01",
      updatedAt: "2000-01-01",
    },
    {
      id: "2",
      name: "Test Detail 2",
      price: 2000,
      label: "test-label",
      paidByUserA: false,
      paidByUserB: true,
      paidAt: "2000-01-01",
      createdAt: "2000-01-01",
      updatedAt: "2000-01-01",
    },
    {
      // 精算対象外（ラベルが異なる）
      id: "3",
      name: "Test Detail 3",
      price: 3000,
      label: "other-label",
      paidByUserA: false,
      paidByUserB: true,
      paidAt: "2000-01-01",
      createdAt: "2000-01-01",
      updatedAt: "2000-01-01",
    },
    {
      id: "4",
      name: "Test Detail 4",
      price: 4000,
      label: "test-label",
      paidByUserA: true,
      paidByUserB: false,
      paidAt: "2000-01-01",
      createdAt: "2000-01-01",
      updatedAt: "2000-01-01",
    },
    {
      // 精算対象外（AもBも支払済）
      id: "5",
      name: "Test Detail 5",
      price: 5000,
      label: "test-label",
      paidByUserA: true,
      paidByUserB: true,
      paidAt: "2000-01-01",
      createdAt: "2000-01-01",
      updatedAt: "2000-01-01",
    },
  ];

  render(<LabeledSum allDetails={details} label="test-label" />);

  // sumAの検証
  const actualSumA =
    screen.getByText("User A - 支出合計").nextSibling?.textContent;
  expect(actualSumA).toBe("￥5,000");

  // sumBの検証
  const actualSumB =
    screen.getByText("User B - 支出合計").nextSibling?.textContent;
  expect(actualSumB).toBe("￥2,000");
});
