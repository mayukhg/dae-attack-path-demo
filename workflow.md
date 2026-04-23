# Dynamic Agentic Experience (DAE) - Conversational User Journey

This document describes the upgraded user journey traversing through the DAE Demo application. The workflow has been evolved from a passive dashboard visualizer into a commanding conversational interface guided by **Agent DAE**.

## Phase 1: Proactive Interrogation (The Discovery)
**User Action:** The user navigates to the dashboard URL. 
**Agent Action:** The **Agent DAE** chat interface (located in the right panel) greets the user: *"Hello, I am Agent DAE. I continuously validate whether your exposures are exploitable."*
**What Happens On Screen:**
- The graph area is empty.
- Once Agent DAE announces the scan, it automatically invokes the map. The React Flow topography progressively paints the known universe (from UAT Dev outwards).
- Agent DAE proposes 3 Trending CVE options (e.g., Apache Tomcat, HTTP Server, PHP).

## Phase 2: Directed Validation (The Simulation)
**User Action:** The user clicks the **"Run DAE Assessment"** button situated inside the chat.
**What Happens On Screen:**
- The chat transitions to the "Scanning" phase.
- **Graph Map Synchronicity:** The React Flow canvas visibly explodes with red, animated edge-traffic, simulating algorithmic threat progression traversing toward the Domain Admin.
- The chat interface highlights that the critical path is vulnerable and explicitly identifies **Node B: Shadow API** as the nexus point.
- The QVSS Score Comparative UI drops in, showing the score climbing to a highly critical **9.9**.

## Phase 3: The Safe Fix Analysis 
**User Action:** The user evaluates the options and clicks **"View Remediation Options"**.
**What Happens On Screen:**
- Agent DAE analyzes the infrastructure dependencies and produces a customized mitigation card specifically targeting the Node B Choke Point.
- It recommends a configuration-based mitigation to sever the path without requiring extensive patching downtime.

## Phase 4: Resolution & Revalidation
**User Action:** The user selects **"Mitigate + Revalidate"**.
**What Happens On Screen:**
- **In the Chat:** Agent DAE reports "1/1 Successful Mitigation Deployment." It actively relaunches a secondary verification scan against Node B.
- **On the Graph Map:** The nodes instantly react. The red traversal lines vanish. Node B shifts to an embedded "SECURED" visual state with a green border. All downward connection edges turn dim, proving the attack vectors are physically broken. 
- **The Final Result:** Agent DAE posts the concluding scorecard comparing the original 9.6 Base score against the newly mitigated and validated **7.7** safe state.
