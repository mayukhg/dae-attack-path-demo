# DAE Attack Path Demo

Dynamic Agentic Experience demo for autonomous attack-path discovery, simulation, remediation, and executive reporting.

The application is built with Next.js, React, and React Flow. Next.js now serves both the frontend experience and the integrated backend API used by Agent Iris.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the integrated frontend and backend:

```bash
npm run dev
```

Open the UI at:

```text
http://localhost:3000
```

The attack-path backend API is available at:

```text
http://localhost:3000/api/attack-path
```

Windows helpers:

```bat
startup.bat
shutdown.bat
```

macOS/Linux helpers:

```bash
./startup.sh
./shutdown.sh
```

## Codex Changes

### Summary

This branch upgrades Phase 3 of Agent Iris from a fully scripted frontend demonstration into an integrated frontend/backend attack-path workflow.

Agent Iris now calls a Next.js API backend to:

- load a structured attack scenario
- rank viable attack paths to crown-jewel assets
- compute Path Criticality Score (PCS)
- identify choke points
- simulate the selected path
- enumerate blast-radius assets
- rank remediation options by impact
- apply a mitigation and recompute residual risk
- answer simple what-if questions from graph data

### Detailed Description

#### Backend Attack-Path Engine

Added `src/lib/attackPathEngine.js`.

The engine provides deterministic graph reasoning functions:

- `discoverAttackPaths`: finds viable paths from configured entry nodes to crown jewels.
- `analyzeScenario`: ranks paths, computes top PCS, active path count, and choke points.
- `simulatePath`: returns the selected path, MITRE techniques, evidence chain, and blast radius.
- `rankMitigations`: compares remediation options by paths closed, PCS reduction, residual PCS, downtime, and deploy time.
- `applyMitigation`: applies blocked edges and recomputes residual attack paths.
- `answerWhatIf`: answers common scenario questions such as VPN removal, Shadow API hardening, and best mitigation.

#### Structured Scenario Data

Added `src/data/attackScenarios.js`.

The scenario now stores graph data and security metadata together:

- React Flow nodes and edges
- MITRE technique IDs
- confidence, exploitability, privilege gain, and control weakness
- evidence text
- business value
- entry nodes
- crown-jewel nodes
- blast-radius assets
- remediation options

This gives the demo a clear path toward importing real CNAPP, SIEM, CSPM, BloodHound, or asset-inventory data later.

#### Integrated API Route

Added `src/app/api/attack-path/route.js`.

The API supports:

- `GET /api/attack-path`: returns scenario graph and current analysis.
- `POST /api/attack-path` with `intent: "simulate"`: simulates the selected attack path.
- `POST /api/attack-path` with `intent: "mitigate"`: applies a mitigation and recomputes residual risk.
- `POST /api/attack-path` with `intent: "what-if"`: returns a graph-backed what-if response.

#### Frontend Integration

Updated `src/components/AgentDaeChat.js`.

Phase 3 now calls the backend instead of relying only on canned values. The chat UI displays:

- backend-ranked active path count
- backend-computed PCS
- top choke point
- selected path techniques
- evidence chain
- direct blast-radius assets
- remediation options with paths closed, PCS reduction, deploy time, and downtime
- residual PCS and active paths after mitigation
- graph-backed what-if responses

Updated `src/app/page.js`.

The React Flow canvas now consumes shared scenario data and accepts backend-derived payloads for:

- highlighting the selected simulated path
- revealing blast-radius nodes
- marking mitigated edges and target nodes

#### Startup and Shutdown

Updated:

- `startup.bat`
- `shutdown.bat`

Added:

- `startup.sh`
- `shutdown.sh`

The scripts now describe the app as an integrated frontend/API service and expose the backend API URL.

## New Workflow

1. Start the app with `npm run dev`, `startup.bat`, or `./startup.sh`.
2. Open `http://localhost:3000`.
3. Toggle from Manual Dashboard to Agent Iris.
4. Select `Phase 3: Advanced Command Center`.
5. Agent Iris calls `/api/attack-path` to load the scenario and rank attack paths.
6. The chat displays the top PCS, active paths, and key choke point.
7. Click `Simulate Prioritized Path & Blast Radius`.
8. The backend returns the selected path, MITRE techniques, evidence, and blast-radius assets.
9. The React Flow map highlights the backend-selected traversal and reveals exposed assets.
10. Choose a remediation option.
11. The backend applies the mitigation, recomputes residual paths, and sends the new PCS back to the UI.
12. Simulate bypass and ask a what-if question in the Phase 3 input.

## UI Changes

- Phase 3 path selection now shows backend-ranked active paths, top PCS, and choke point.
- Simulation card now shows backend-generated MITRE technique sequence.
- Simulation card now displays evidence from the selected path.
- Blast-radius text now reflects actual modeled blast-radius assets.
- Remediation cards are generated from backend-ranked options.
- Remediation cards show paths closed, PCS reduction, deployment time, and downtime.
- Post-mitigation state shows backend-computed residual active paths and residual PCS.
- What-if answers now come from `/api/attack-path` instead of a fixed canned response.

## Validation

Use the following checks before publishing changes:

```bash
npm run lint
npm run build
```
