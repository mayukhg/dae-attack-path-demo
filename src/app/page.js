"use client";
import { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  applyNodeChanges, 
  applyEdgeChanges 
} from 'reactflow';
import 'reactflow/dist/style.css';
import AgentDaeChat from '../components/AgentDaeChat';
import ManualDashboard from '../components/ManualDashboard';

const initialNodes = [
  { id: 'A', position: { x: 50, y: 50 }, data: { label: 'A: UAT Dev Environment (Discovery)' }, type: 'input', style: { background: 'rgba(30,41,59,0.8)', color: 'white', border: '1px solid #475569' } },
  { id: 'B', position: { x: 50, y: 150 }, data: { label: 'B: Shadow API - BOLA' }, style: { background: 'rgba(30,41,59,0.8)', color: 'white', border: '1px solid #475569' } },
  { id: 'C', position: { x: 50, y: 250 }, data: { label: 'C: RCE/Web Shell' }, style: { background: 'rgba(30,41,59,0.8)', color: 'white', border: '1px solid #475569' } },
  { id: 'D', position: { x: -100, y: 350 }, data: { label: 'D: Container Escape' }, style: { background: 'rgba(30,41,59,0.8)', color: 'white', border: '1px solid #475569' } },
  { id: 'F', position: { x: 200, y: 350 }, data: { label: 'F: NTLM Extraction' }, style: { background: 'rgba(30,41,59,0.8)', color: 'white', border: '1px solid #475569' } },
  { id: 'G', position: { x: 50, y: 450 }, data: { label: 'G: Domain Admin Access' }, type: 'output', style: { background: 'rgba(30,41,59,0.8)', color: 'white', border: '1px solid #475569' } },
];

const initialEdges = [
  { id: 'eA-B', source: 'A', target: 'B', animated: false, style: { stroke: 'rgba(255,255,255,0.2)' } },
  { id: 'eB-C', source: 'B', target: 'C', animated: false, style: { stroke: 'rgba(255,255,255,0.2)' } },
  { id: 'eC-D', source: 'C', target: 'D', animated: false, style: { stroke: 'rgba(255,255,255,0.2)' } },
  { id: 'eC-F', source: 'C', target: 'F', animated: false, style: { stroke: 'rgba(255,255,255,0.2)' } },
  { id: 'eD-G', source: 'D', target: 'G', animated: false, style: { stroke: 'rgba(255,255,255,0.2)' } },
  { id: 'eF-G', source: 'F', target: 'G', animated: false, style: { stroke: 'rgba(255,255,255,0.2)' } },
];

export default function Dashboard() {
  const [isAgenticMode, setIsAgenticMode] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  // Shared state for Manual Mode tracking
  const [manualPhase, setManualPhase] = useState('init'); // init, simulating, secured
  const [chatKey, setChatKey] = useState(0); // Used to force-remount the chat when toggling

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Initialize nodes immediately in manual mode
  useEffect(() => {
    if (!isAgenticMode) {
      setNodes(initialNodes.map(n => ({...n, hidden: false})));
      setEdges(initialEdges);
      setManualPhase('init');
    } else {
      // If switching to Agentic Mode, wipe the map clean for the "Discovery" intro
      setNodes([]);
      setEdges([]);
      setChatKey(prev => prev + 1); // Reset the Chat component state
    }
  }, [isAgenticMode]);

  // Unified Action Handler for React Flow
  const triggerGraphAnimation = (action) => {
    if (action === 'init_map') {
      setNodes(initialNodes.map(n => ({...n, hidden: false})));
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
           if (n.id === 'B') return { ...n, style: { background: 'rgba(239,68,68,0.2)', border: '2px solid #ef4444', color: 'white', boxShadow: '0 0 15px rgba(239,68,68,0.5)' } };
           return n;
        }));
      }, 2000);
    }
    
    if (action === 'secure_path') {
      setNodes(nds => nds.map(n => {
        if (n.id === 'B') return { ...n, style: { background: 'rgba(16,185,129,0.2)', border: '2px solid #10b981', color: 'white' }, data: { label: 'B: Shadow API (SECURED)' } };
        return n;
      }));
      setManualPhase('secured');
      
      setEdges(eds => eds.map(e => {
         if (e.id === 'eA-B') return { ...e, animated: false, style: { stroke: '#10b981', strokeWidth: 2 } };
         return { ...e, animated: false, style: { stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 } };
      }));
    }
  };

  return (
    <div className="dashboard-container">
      {/* Visual Attack Path Engine */}
      <div style={{ position: 'relative' }}>
         
         {/* Toggle Component fixed to bottom-left */}
         <div style={{ position: 'absolute', bottom: '24px', left: '24px', zIndex: 100, background: 'rgba(15,23,42,0.9)', padding: '12px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: isAgenticMode ? 'normal' : '600', color: isAgenticMode ? '#94a3b8' : 'white' }}>Manual Dashboard</span>
            
            {/* Simple CSS Switch */}
            <div 
              style={{ width: '44px', height: '24px', background: isAgenticMode ? '#3b82f6' : '#475569', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
              onClick={() => setIsAgenticMode(!isAgenticMode)}
            >
               <div style={{ position: 'absolute', top: '2px', left: isAgenticMode ? '22px' : '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: '0.3s' }} />
            </div>

            <span style={{ fontSize: '12px', fontWeight: isAgenticMode ? '600' : 'normal', color: isAgenticMode ? 'white' : '#94a3b8' }}>Agent DAE</span>
         </div>

         <ReactFlow 
           nodes={nodes} 
           edges={edges}
           onNodesChange={onNodesChange}
           onEdgesChange={onEdgesChange}
           fitView
           proOptions={{ hideAttribution: true }}
         >
           <Background color="#1e293b" gap={16} />
           <Controls style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.1)' }} />
         </ReactFlow>
         
         {isAgenticMode && !nodes.length && (
           <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', color:'#64748b', fontSize:'14px' }}>
              Awaiting Autonomous Discovery...
           </div>
         )}
      </div>

      {/* Dynamic Right Panel Rendering */}
      {isAgenticMode ? (
        <AgentDaeChat key={chatKey} onAction={triggerGraphAnimation} />
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
