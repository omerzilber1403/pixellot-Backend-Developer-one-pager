import { NextResponse } from "next/server";
import { getScenario } from "@/data/terminal-scenarios";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ scenario: string }> }
) {
  const { scenario: scenarioId } = await params;
  const scenario = getScenario(scenarioId);

  if (!scenario) {
    return NextResponse.json(
      { error: `Scenario "${scenarioId}" not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: scenario.id,
    description: scenario.description,
    steps: scenario.steps,
  });
}
