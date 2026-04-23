import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LiveGameWidget } from "@/components/LiveGameWidget";

const sampleGame = {
  id: "1",
  date: "2026-04-23",
  datetime: "2026-04-23T23:00:00Z",
  status: "2nd Qtr",
  period: 2,
  time: "5:32",
  postseason: false,
  home_team: { id: "16", abbreviation: "MIN", displayName: "Minnesota Timberwolves", shortName: "Timberwolves", logo: "" },
  visitor_team: { id: "14", abbreviation: "LAL", displayName: "Los Angeles Lakers", shortName: "Lakers", logo: "" },
  home_team_score: 48,
  visitor_team_score: 45,
};

describe("LiveGameWidget", () => {
  it("renders live scoreboard when liveToday is set", () => {
    render(<LiveGameWidget liveToday={sampleGame} upcoming={[]} />);
    expect(screen.getByText(/MIN/)).toBeInTheDocument();
    expect(screen.getByText(/LAL/)).toBeInTheDocument();
    expect(screen.getByText("48")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText(/2nd Qtr/)).toBeInTheDocument();
  });

  it("renders next-game countdown when no live game", () => {
    const nextGame = { ...sampleGame, date: "2026-05-01", datetime: "2026-05-01T23:00:00Z", status: "Scheduled" };
    render(<LiveGameWidget liveToday={null} upcoming={[nextGame]} />);
    expect(screen.getByText(/NEXT GAME/i)).toBeInTheDocument();
    expect(screen.getByText(/LAL/)).toBeInTheDocument();
  });

  it("renders empty state when no games at all", () => {
    render(<LiveGameWidget liveToday={null} upcoming={[]} />);
    expect(screen.getByText(/no games scheduled/i)).toBeInTheDocument();
  });
});
