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
import { BaseNode, CrownJewelNode } from '../components/CustomNodes';

const nodeTypes = { base: BaseNode, crown: CrownJewelNode };

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
  };

  return (
    <div className="dashboard-container" style={{ position: 'relative' }}>
      
      {/* Cinematic Transition Overlay */}
      {showCinematicBlackout && (
         <div className="cinematic-blackout">
            <div className="pulsing-text">DAE Ecosystem Initializing...</div>
         </div>
      )}

      {/* Visual Attack Path Engine */}
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

      {/* Dynamic Right Panel Rendering - 60/40 Split Enforced in Agent Mode */}
      {isAgenticMode ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
           <AgentDaeChat 
             key={chatKey} 
             onAction={triggerGraphAnimation} 
             setSharedState={(s) => setSharedState(prev => ({...prev, ...s}))} 
           />
           <LiveMetrics {...sharedState} />
        </div>
      ) : (
        <ManualDashboard 
          phase={manualPhase} 
          onSimulate={() => triggerGraphAnimation('simulate_path')} 
          onMitigate={() => triggerGraphAnimation('secure_path')} 
        />
      )}
    </div>
  );
}
