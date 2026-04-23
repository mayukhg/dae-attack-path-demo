# Dynamic Agentic Experience (DAE) - Dual Mode User Journey

This document describes the upgraded user journey traversing through the DAE Demo application. The workflow now natively supports two distinct paradigms, allowing presenters to fluidly contrast traditional manual SecOps with the orchestrated DAE approach.

## 1. The Default Landing: Manual Dashboard Flow
When the application starts, it defaults to **Manual Dashboard Mode**. 
* **State Check:** The map immediately renders a static overview of the topographies. The right side features a traditional, non-conversational dashboard.
* **The Manual Friction (Presenter Talking Points):** 
  - The map isn't animated or "alive." Discovered paths are presented as a raw table (e.g., UAT -> Domain Admin).
  - The user must explicitly hit the `Trigger Simulation Ping` button.
  - Upon testing, a static alert appears identifying the *Shadow API Breach* requiring manual mitigation ruleset authoring.
  - The user clicks `Deploy Manual Fixes` to manually gray out the path. 

*The presenter explains how this is slow, disjointed, and lacks real-time orchestration logic.*

---

## 2. The Shift: Toggling Agent DAE
To demonstrate the product scaling, the presenter navigates to the bottom-left corner and clicks the sleek UI switch from **Manual Dashboard** over to **Agent DAE**.

* **The Reset Trigger:** Activating this toggle cleanly wipes the map bare and slides away the boring dashboard panels in favor of the active chat UI. 

## 3. The Agentic Flow (DAE Validation)
**Phase 3.1: Proactive Interrogation (The Discovery)**
- The **Agent DAE** chat interface greets the user: *"Hello, I continuously map your infrastructure for blast radiuses."*
- Agent DAE automatically invokes the map dropping the nodes seamlessly onto the clean canvas.
- Agent DAE proposes 3 **Critical Attack Paths**.

**Phase 3.2: Directed Validation (The Simulation)**
- The user clicks **"Simulate Attack Path"** inside the chat.
- The React Flow canvas visibly explodes with red, animated edge-traffic traversing toward the Domain Admin.
- Agent DAE isolates the critical choke point and flags the **Path Criticality Score (PCS)** jumping from 9.6 to 9.9.

**Phase 3.3: The Safe Fix Analysis & Revalidation**
- The user hits **"View Remediation Options"**. Agent DAE recommends deploying a Virtual WAF & Hardware MFA Circuit Breaker targetting node B.
- The user accepts. Agent DAE actively relaunches a secondary verification scan. 
- The nodes react instantly. The red lines vanish. Node B shifts to a "SECURED" visual state. The **Path Criticality Score** plummets to a safe **7.7**.
