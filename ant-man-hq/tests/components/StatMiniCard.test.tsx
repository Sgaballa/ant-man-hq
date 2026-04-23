import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatMiniCard } from "@/components/StatMiniCard";

describe("StatMiniCard", () => {
  it("renders label, value, and back detail", () => {
    render(<StatMiniCard label="PPG" value="27.1" back="Career: 23.8" />);
    expect(screen.getByText("PPG")).toBeInTheDocument();
    expect(screen.getByText("27.1")).toBeInTheDocument();
    expect(screen.getByText("Career: 23.8")).toBeInTheDocument();
  });

  it("falls back to em-dash when value is missing", () => {
    render(<StatMiniCard label="RPG" value={null} back={null} />);
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });
});
