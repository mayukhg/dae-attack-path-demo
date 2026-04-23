# Dynamic Agentic Experience (DAE) - User Journey Workflow

This document describes the user journey through the DAE Attack Path demo application, outlining what the user experiences and the underlying agentic systems that power the visualizations.

## Phase 1: Initialize & Continuous Autonomous Discovery
**User Action:** The user navigates to the dashboard URL. There are no inputs required to start; the system works autonomously.
**What Happens On Screen:**
- The **Confidence Score** is established in a healthy range.
- The **Mapping Agent** (left panel log) begins polling telemetry data.
- The **Map Canvas** (center) dynamically constructs the environment's topography node-by-node, visualizing newly discovered assets mapping from standard UAT environments deep into internal infrastructure.

## Phase 2: Recursive Threat Simulation
**User Action:** The user observes as the map completes its rendering.
**What Happens On Screen:**
- Once the map is fully constructed, the **Simulation Agent** automatically takes over.
- The agent simulates millions of breach permutations in the background. Note the logs updating in the left panel as it attempts different lateral movement strategies (e.g., testing the container escape, exploiting the BOLA vulnerability).
- The **Confidence Score** drops dynamically as critical exploit paths (such as the *Shadow API --> RCE* progression) are validated by the Simulation agent.
- A **"Choke Point"** is identified. Node B (Shadow API) begins pulsing red on the map.

## Phase 3: Goal-Oriented Remediation Suggestion
**User Action:** The user reviews the right-hand panel for security action.
**What Happens On Screen:**
- The **Remediation Agent** calculates the most efficient way to break the validated attack paths.
- Instead of suggesting a patching scramble across 50 nodes, it identifies that securing the single choke point (Node B) will definitively collapse the pathway to the Domain Admin.
- The "Execute Safe Fix" button transitions from disabled to active.

## Phase 4: Human-in-the-Loop Execution
**User Action:** The user clicks the **"Execute Safe Fix"** button.
**What Happens On Screen:**
- The Remediation Agent deploys a temporary WAF virtual patch and enforces MFA on the affected node.
- The connection originating from the Choke Point is visually severed ("Blocked").
- The Simulation Agent fires immediately again to re-test the perimeter.
- With the path neutralized, the overall matrix is nullified, and the **Confidence Score** increases securely back to an optimized state.

---
**Summary:** The journey shifts the analyst from a reactive hunter manually parsing static maps, to an intent-led reviewer simply approving high-confidence, pre-tested remediation strategies proposed by an orchestrated ecosystem of bots.
