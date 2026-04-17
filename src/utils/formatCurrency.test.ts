import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("formats whole numbers as Turkish lira", () => {
    expect(formatCurrency(15999)).toBe("₺15.999");
  });

  it("rounds decimal values to the nearest whole amount", () => {
    expect(formatCurrency(1499.6)).toBe("₺1.500");
  });

  it("formats zero correctly", () => {
    expect(formatCurrency(0)).toBe("₺0");
  });

  it("keeps the minus sign for negative values", () => {
    expect(formatCurrency(-45)).toBe("-₺45");
  });
});
