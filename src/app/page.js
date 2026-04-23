"use client";
import { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MarkerType, 
  applyNodeChanges, 
  applyEdgeChanges 
} from 'reactflow';
import 'reactflow/dist/style.css';
import AgentDaeChat from '../components/AgentDaeChat';

const initialNodes = [
  { id: 'A', position: { x: 50, y: 50 }, data: { label: 'A: UAT Dev Environment (Discovery)' }, type: 'input', style: { background: 'rgba(30,41,59,0.8)', color: 'white', border: '1px solid #475569' } },
  { id: 'B', position: { x: 50, y: 150 }, data: { label: 'B: Shadow API - BOLA (CVE-2020-1938)' }, style: { background: 'rgba(30,41,59,0.8)', color: 'white', border: '1px solid #475569' } },
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
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Agent Chat Interaction Sync
  const handleAgentChatAction = (action) => {
    console.log("Agent requested action:", action);
    
    if (action === 'init_map') {
      // Simulate mapping dropping nodes in
      setNodes(initialNodes.map(n => ({...n, hidden: false})));
      setEdges(initialEdges);
    }
    
    if (action === 'simulate_path') {
      // Turn Edges red & animated to simulate testing
      setEdges(eds => eds.map(e => ({
        ...e,
        animated: true,
        style: { stroke: '#ef4444', strokeWidth: 2 }
      })));
      
      // Highlight the choke point (Node B)
      setTimeout(() => {
        setNodes(nds => nds.map(n => {
           if (n.id === 'B') return { ...n, style: { background: 'rgba(239,68,68,0.2)', border: '2px solid #ef4444', color: 'white', boxShadow: '0 0 15px rgba(239,68,68,0.5)' } };
           return n;
        }));
      }, 2500);
    }
    
    if (action === 'secure_path') {
      // Re-style Node B to secure green
      setNodes(nds => nds.map(n => {
        if (n.id === 'B') return { ...n, style: { background: 'rgba(16,185,129,0.2)', border: '2px solid #10b981', color: 'white' }, data: { label: 'B: Shadow API (SECURED)' } };
        return n;
      }));
      
      // Gray out the paths stemming from B downwards
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
         {!nodes.length && (
           <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', color:'#64748b', fontSize:'14px' }}>
              Awaiting Autonomous Discovery...
           </div>
         )}
      </div>

      {/* Advanced Agent Chat Workflow */}
      <AgentDaeChat onAction={handleAgentChatAction} />
    </div>
  );
}
