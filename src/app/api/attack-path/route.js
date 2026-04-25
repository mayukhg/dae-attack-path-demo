import { NextResponse } from 'next/server';
import { advancedScenario } from '../../../data/attackScenarios';
import { analyzeScenario, applyMitigation, answerWhatIf, simulatePath } from '../../../lib/attackPathEngine';

export async function GET() {
  return NextResponse.json({
    scenario: {
      id: advancedScenario.id,
      name: advancedScenario.name,
      nodes: advancedScenario.nodes,
      edges: advancedScenario.edges,
    },
    analysis: analyzeScenario(advancedScenario),
  });
}

export async function POST(request) {
  const body = await request.json();

  if (body.intent === 'simulate') {
    return NextResponse.json(simulatePath(advancedScenario, body.pathId));
  }

  if (body.intent === 'mitigate') {
    return NextResponse.json(applyMitigation(advancedScenario, body.mitigationId));
  }

  if (body.intent === 'what-if') {
    return NextResponse.json(answerWhatIf(body.question || '', advancedScenario));
  }

  return NextResponse.json(analyzeScenario(advancedScenario));
}
