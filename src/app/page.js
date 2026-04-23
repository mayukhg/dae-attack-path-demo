"use client";
import { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  applyNodeChanges, 
  applyEdgeChanges,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import AgentDaeChat from '../components/AgentDaeChat';
import ManualDashboard from '../components/ManualDashboard';
import LiveMetrics from '../components/LiveMetrics';
import { BaseNode, CrownJewelNode, AiAgentNode } from '../components/CustomNodes';

const nodeTypes = { base: BaseNode, crown: CrownJewelNode, ai: AiAgentNode };

const initialNodes = [
  { id: 'A', position: { x: 50, y: 50 }, type: 'base', data: { label: 'Discovery Asset', assetType: 'DEV ENVIRONMENT', icon: '💻', status: 'normal' } },
  { id: 'B', position: { x: 50, y: 150 }, type: 'base', data: { label: 'BOLA Exploit', assetType: 'SHADOW API', icon: '🔗', status: 'normal' } },
  { id: 'C', position: { x: 50, y: 250 }, type: 'base', data: { label: 'Web Shell Exec', assetType: 'VM INSTANCE', icon: '🖥️', status: 'normal' } },
  { id: 'D', position: { x: -100, y: 350 }, type: 'base', data: { label: 'Escape to Host', assetType: 'CONTAINER', icon: '📦', status: 'normal' } },
  { id: 'F', position: { x: 200, y: 350 }, type: 'base', data: { label: 'NTLM Extraction', assetType: 'IDENTITY PROV', icon: '🔑', status: 'normal' } },
  { id: 'G', position: { x: 50, y: 450 }, type: 'crown', data: { label: 'Active Directory Core', status: 'normal' } },
];

const edgeStyling = { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 };
const initialEdges = [
  { id: 'eA-B', source: 'A', target: 'B', animated: false, style: edgeStyling },
  { id: 'eB-C', source: 'B', target: 'C', animated: false, style: edgeStyling },
  { id: 'eC-D', source: 'C', target: 'D', animated: false, style: edgeStyling },
  { id: 'eC-F', source: 'C', target: 'F', animated: false, style: edgeStyling },
  { id: 'eD-G', source: 'D', target: 'G', animated: false, style: edgeStyling },
  { id: 'eF-G', source: 'F', target: 'G', animated: false, style: edgeStyling },
];

const aiNodes = [
  { id: 'W1', position: { x: 50, y: 50 }, type: 'base', data: { label: 'Finance Desktop User', assetType: 'REMOTE HOST', icon: '👤', status: 'normal' } },
  { id: 'W2', position: { x: 50, y: 250 }, type: 'ai', data: { label: 'Finance Auto-Billing Agent', assetType: 'AI AGENT', showThreats: true, status: 'normal' } },
  { id: 'W3', position: { x: 50, y: 450 }, type: 'crown', data: { label: 'Customer Root Database (PII)', status: 'normal' } },
];

const aiEdges = [
  { id: 'eW1-W2', source: 'W1', target: 'W2', animated: false, style: edgeStyling },
  { id: 'eW2-W3', source: 'W2', target: 'W3', animated: false, style: edgeStyling },
];

const phase3Nodes = [
  ...initialNodes,
  // Path 2
  { id: 'H', position: { x: -250, y: 50 }, type: 'base', data: { label: 'External DMZ', assetType: 'LOAD BALANCER', icon: '🌐', status: 'normal' } },
  { id: 'I', position: { x: -250, y: 150 }, type: 'base', data: { label: 'Kubelet Exploit', assetType: 'K8S NODE', icon: '☸️', status: 'normal' } },
  // Path 3
  { id: 'J', position: { x: 350, y: 50 }, type: 'base', data: { label: 'Phishing Target', assetType: 'EMPLOYEE LAPTOP', icon: '🎣', status: 'normal' } },
  { id: 'K', position: { x: 350, y: 150 }, type: 'base', data: { label: 'VPN Access', assetType: 'VPN GATEWAY', icon: '🛡️', status: 'normal' } },
  // Blast Radius
  { id: 'BR1', position: { x: 250, y: 250 }, type: 'base', data: { label: 'HR Database', assetType: 'INTERNAL DB', icon: '🗄️', status: 'normal', isBlastRadius: true }, hidden: true },
  { id: 'BR2', position: { x: 250, y: 150 }, type: 'base', data: { label: 'Finance API', assetType: 'MICROSERVICE', icon: '⚙️', status: 'normal', isBlastRadius: true }, hidden: true },
];

const phase3Edges = [
  ...initialEdges.map(e => ({...e})),
  // Path 2
  { id: 'eH-I', source: 'H', target: 'I', animated: false, style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 } },
  { id: 'eI-D', source: 'I', target: 'D', animated: false, style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 } },
  // Path 3
  { id: 'eJ-K', source: 'J', target: 'K', animated: false, style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 } },
  { id: 'eK-F', source: 'K', target: 'F', animated: false, style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 } },
  // Blast Radius Edges
  { id: 'eB-BR1', source: 'B', target: 'BR1', animated: false, style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }, hidden: true },
  { id: 'eB-BR2', source: 'B', target: 'BR2', animated: false, style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }, hidden: true },
];


export default function Dashboard() {
  const [isAgenticMode, setIsAgenticMode] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  // State for Manual Mode
  const [manualPhase, setManualPhase] = useState('init');
  
  // Shared Live Metrics State from Agent Chat
  const [sharedState, setSharedState] = useState({
     pcsScore: 0,
     activePaths: 0,
     isSimulating: false
  });

  const [chatKey, setChatKey] = useState(0);
  const [showCinematicBlackout, setShowCinematicBlackout] = useState(false);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const toggleMode = (targetMode) => {
     if (targetMode === isAgenticMode) return;
     
     if (targetMode === true) {
        // Trigger Cinematic Sequence
        setShowCinematicBlackout(true);
        setTimeout(() => {
           setIsAgenticMode(true);
           setNodes([]); // Wipe Map bare
           setEdges([]);
           setChatKey(prev => prev + 1);
        }, 500);
        setTimeout(() => setShowCinematicBlackout(false), 2000);
     } else {
        setIsAgenticMode(false);
        setNodes(initialNodes);
        setEdges(initialEdges);
        setManualPhase('init');
     }
  };

  useEffect(() => {
    if (!isAgenticMode) {
      setNodes(initialNodes);
      setEdges(initialEdges);
      setManualPhase('init');
    }
  }, []);

  // Shared Action Trigger Map
  const triggerGraphAnimation = (action) => {
    if (action === 'init_map') {
      // Staggered Entry Animation natively relying on Chat delays
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
    
    if (action === 'simulate_path') {
      setEdges(eds => eds.map(e => ({
        ...e,
        animated: true,
        style: { stroke: '#ef4444', strokeWidth: 2 }
      })));
      setManualPhase('simulating');
      
      setTimeout(() => {
        setNodes(nds => nds.map(n => {
           if (n.id === 'B' || n.id === 'C' || n.id === 'G') 
               return { ...n, data: { ...n.data, status: 'compromised' } };
           return n;
        }));
      }, 1000);
    }
    
    if (action === 'secure_path') {
      setNodes(nds => nds.map(n => {
        if (n.id === 'B') return { ...n, data: { ...n.data, status: 'secured', label: 'Shadow API (BLOCKED)' } };
        // Reset everything else back to normal
        if (n.id !== 'B') return { ...n, data: { ...n.data, status: 'normal' } };
        return n;
      }));
      setManualPhase('secured');
      
      setEdges(eds => eds.map(e => {
         if (e.id === 'eA-B') return { ...e, animated: false, style: { stroke: '#10b981', strokeWidth: 2, transition: 'all 1s ease' } };
         return { ...e, animated: false, style: { stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1, transition: 'all 1s ease' } };
      }));
    }
    
    if (action === 'init_ai_map') {
      setNodes(aiNodes);
      setEdges(aiEdges);
    }

    if (action === 'simulate_ai_path') {
      setEdges(eds => eds.map(e => ({
        ...e,
        animated: true,
        style: { stroke: '#ef4444', strokeWidth: 2 }
      })));
      setTimeout(() => {
        setNodes(nds => nds.map(n => {
           if (n.id === 'W2' || n.id === 'W3') 
               return { ...n, data: { ...n.data, status: 'compromised' } };
           return n;
        }));
      }, 1000);
    }
    
    if (action === 'secure_ai_path') {
      setNodes(nds => nds.map(n => {
        if (n.id === 'W2') return { ...n, data: { ...n.data, status: 'secured', showThreats: false, label: 'Finance Auto-Billing Agent (EGRESS SECURED)' } };
        // Reset everything else back to normal
        if (n.id !== 'W2') return { ...n, data: { ...n.data, status: 'normal' } };
        return n;
      }));
      setEdges(eds => eds.map(e => {
         if (e.id === 'eW1-W2') return { ...e, animated: false, style: { stroke: '#10b981', strokeWidth: 2, transition: 'all 1s ease' } };
         return { ...e, animated: false, style: { stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1, transition: 'all 1s ease' } };
      }));
    }

    // --- Phase 3 Actions ---
    if (action === 'init_phase3_map') {
      setNodes(phase3Nodes);
      setEdges(phase3Edges);
    }

    if (action === 'simulate_phase3_path') {
      setEdges(eds => eds.map(e => {
        if (['eA-B', 'eB-C', 'eC-F', 'eF-G'].includes(e.id)) {
           let conf = '90%'; let mitre = 'T1190';
           if (e.id === 'eB-C') { conf = '88%'; mitre = 'T1505'; }
           if (e.id === 'eC-F') { conf = '76%'; mitre = 'T1003'; }
           if (e.id === 'eF-G') { conf = '99%'; mitre = 'T1550'; }
           return { ...e, animated: true, style: { stroke: '#ef4444', strokeWidth: 2 }, label: `${mitre} (${conf})`, labelStyle: { fill: '#cbd5e1', fontWeight: 600, fontSize: 10 }, labelBgStyle: { fill: '#1e293b' } };
        }
        return e;
      }));
      setTimeout(() => {
        setNodes(nds => nds.map(n => {
           if (['B', 'C', 'F', 'G'].includes(n.id)) 
               return { ...n, data: { ...n.data, status: 'compromised' } };
           return n;
        }));
      }, 1000);
    }

    if (action === 'simulate_blast_radius') {
      setNodes(nds => nds.map(n => {
         if (n.data?.isBlastRadius) {
            return { ...n, hidden: false, data: { ...n.data, status: 'compromised' } };
         }
         return n;
      }));
      setEdges(eds => eds.map(e => {
         if (['eB-BR1', 'eB-BR2'].includes(e.id)) {
            return { ...e, hidden: false, animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } };
         }
         return e;
      }));
    }

    if (action === 'secure_phase3_path') {
      setNodes(nds => nds.map(n => {
        if (n.id === 'B') return { ...n, data: { ...n.data, status: 'secured', label: 'Shadow API (BLOCKED)' } };
        if (n.data?.isBlastRadius) return { ...n, data: { ...n.data, status: 'normal' } };
        if (['C', 'F', 'G'].includes(n.id)) return { ...n, data: { ...n.data, status: 'normal' } };
        return n;
      }));
      setEdges(eds => eds.map(e => {
         if (e.id === 'eA-B') return { ...e, animated: false, style: { stroke: '#10b981', strokeWidth: 2, transition: 'all 1s ease' }, label: '' };
         if (['eB-BR1', 'eB-BR2'].includes(e.id)) return { ...e, hidden: true };
         if (['eB-C', 'eC-F', 'eF-G'].includes(e.id)) return { ...e, animated: false, style: { stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }, label: '' };
         return e;
      }));
    }

    if (action === 'simulate_bypass') {
      const bypassEdge = { 
         id: 'eBypass', source: 'A', target: 'C', animated: true, 
         style: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5,5' }, 
         label: 'Attempting Bypass (T1059)', labelStyle: { fill: '#ef4444', fontWeight: 600, fontSize: 10 }, labelBgStyle: { fill: '#1e293b' } 
      };
      setEdges(eds => [...eds, bypassEdge]);
      setTimeout(() => {
         setEdges(eds => eds.map(e => {
            if (e.id === 'eBypass') return { ...e, animated: false, style: { stroke: '#64748b', strokeWidth: 1, strokeDasharray: '5,5' }, label: 'Bypass Blocked', labelStyle: { fill: '#64748b' } };
            return e;
         }));
      }, 2500);
    }
  };

  return (
    <div className="dashboard-container" style={{ position: 'relative' }}>
      
      {/* Cinematic Transition Overlay */}
      {showCinematicBlackout && (
         <div className="cinematic-blackout">
            <div className="pulsing-text">DAE Ecosystem Initializing...</div>
         </div>
      )}

      {/* Dynamic Left Panel Rendering (Agent Chat or Manual Dashboard) */}
      {isAgenticMode ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
           <AgentDaeChat 
             key={chatKey} 
             onAction={triggerGraphAnimation} 
             setSharedState={(s) => setSharedState(prev => ({...prev, ...s}))} 
           />
        </div>
      ) : (
        <ManualDashboard 
          phase={manualPhase} 
          onSimulate={() => triggerGraphAnimation('simulate_path')} 
          onMitigate={() => triggerGraphAnimation('secure_path')} 
        />
      )}

      {/* Visual Attack Path Engine (Right Panel) */}
      <div style={{ position: 'relative', background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #000000 100%)' }}>
         
         <button onClick={() => toggleMode(false)} className="reset-hover-btn">
           ↺ Reset to Manual
         </button>

         <div className="toggle-float-panel">
            <span style={{ fontSize: '12px', fontWeight: isAgenticMode ? 'normal' : '600', color: isAgenticMode ? '#94a3b8' : 'white' }}>Manual Dashboard</span>
            <div 
              style={{ width: '44px', height: '24px', background: isAgenticMode ? '#3b82f6' : '#475569', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
              onClick={() => toggleMode(!isAgenticMode)}
            >
               <div style={{ position: 'absolute', top: '2px', left: isAgenticMode ? '22px' : '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: '0.3s' }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: isAgenticMode ? '600' : 'normal', color: isAgenticMode ? 'white' : '#94a3b8' }}>Agent DAE</span>
         </div>

         <ReactFlow 
           nodes={nodes} 
           edges={edges}
           nodeTypes={nodeTypes}
           onNodesChange={onNodesChange}
           onEdgesChange={onEdgesChange}
           fitView
           proOptions={{ hideAttribution: true }}
         >
           <Background color="rgba(255,255,255,0.05)" gap={32} size={1} />
           <Controls style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.1)' }} />
         </ReactFlow>
         
         {isAgenticMode && !nodes.length && (
           <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', color:'#64748b', fontSize:'14px' }}>
              Awaiting Autonomous Discovery...
           </div>
         )}
      </div>
    </div>
  );
}
