"use client";
import { useState, useEffect, useRef } from 'react';

const NODES = [
  { id: 'A', title: 'UAT Dev Environment', sub: 'Discovery', y: 10, x: 30 },
  { id: 'B', title: 'Shadow API - BOLA', sub: 'Unauthorized Data Access', y: 25, x: 70 },
  { id: 'C', title: 'RCE / Web Shell', sub: 'CVE-2023-50164 | App Compromise', y: 40, x: 40 },
  { id: 'D', title: 'Container Escape', sub: 'CVE-2019-5736 | Host Root Access', y: 56, x: 75 },
  { id: 'F', title: 'NTLM/Kerberos Extraction', sub: 'Credential Theft', y: 72, x: 50 },
  { id: 'G', title: 'Domain Admin Access', sub: 'AD Compromise', y: 88, x: 80 },
];

export default function Dashboard() {
  const [phase, setPhase] = useState('init'); // init, mapping, simulating, remediation_ready, secured
  const [visibleNodes, setVisibleNodes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [score, setScore] = useState(85); // Starts healthy until discovery
  const logEndRef = useRef(null);

  const addLog = (agent, msg) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString('en-US', { hour12: false }), agent, msg }]);
  };

  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  useEffect(() => {
    if (phase === 'init') {
      setTimeout(() => setPhase('mapping'), 1000);
    } else if (phase === 'mapping') {
      let currentIdx = 0;
      addLog('map', 'Continuous Autonomous Discovery initiated.');
      const interval = setInterval(() => {
        if (currentIdx < NODES.length) {
          setVisibleNodes(prev => [...prev, NODES[currentIdx].id]);
          addLog('map', `Mapped node: ${NODES[currentIdx].title}`);
          if (currentIdx === 0) setScore(72);
          if (currentIdx === 2) setScore(55);
          if (currentIdx === 5) setScore(31);
          currentIdx++;
        } else {
          clearInterval(interval);
          setPhase('simulating');
        }
      }, 1000);
      return () => clearInterval(interval);
    } else if (phase === 'simulating') {
      addLog('sim', 'Recursive Threat Simulation triggered on topology update.');
      setTimeout(() => {
         addLog('sim', 'Testing exploits... Web Shell → Container Escape successful.');
         setScore(28);
      }, 2000);
      setTimeout(() => {
         addLog('sim', 'Testing permutations... Unauthorized Data Access → RCE successful.');
      }, 4000);
      setTimeout(() => {
         addLog('rem', 'Critical Path detected to Domain Admin Access.');
         addLog('rem', 'Identifying Choke Point: Shadow API - BOLA.');
         setPhase('remediation_ready');
      }, 6000);
    }
  }, [phase]);

  const handleRemediate = () => {
    setPhase('secured');
    setScore('...');
    addLog('rem', 'Executing Virtual Patch (WAF) and Identity Circuit Breaker (MFA).');
    
    setTimeout(() => {
      addLog('sim', 'Re-testing perimeter post-remediation...');
      setScore(65);
    }, 2000);
    setTimeout(() => {
      addLog('sim', 'Path B neutralized. Extrapolated attack matrix nullified.');
      setScore(94);
    }, 4500);
  };

  const getEdgeClass = (idx) => {
    if (phase === 'init' || idx >= visibleNodes.length - 1) return 'edge-path';
    if (phase === 'secured' && idx === 0) return 'edge-path secured'; // The link from A to B is blocked
    if (phase === 'simulating' || phase === 'remediation_ready') return 'edge-path active';
    return 'edge-path';
  };

  const getNodeClass = (node) => {
    if (!visibleNodes.includes(node.id)) return 'graph-node';
    if (phase === 'secured' && node.id === 'B') return 'graph-node node-secured';
    if ((phase === 'simulating' || phase === 'remediation_ready') && node.id === 'B') return 'graph-node node-critical';
    if (phase === 'mapping' || phase === 'simulating') return 'graph-node node-active';
    return 'graph-node node-neutral';
  };

  return (
    <div className="dashboard-container">
      {/* Left Panel - Agents Log */}
      <div className="glass-panel">
        <div className="panel-header">
          <div className="panel-title">
            <span>DAE Agents</span>
          </div>
          <div className="badge badge-map">Orchestration</div>
        </div>
        <div className="panel-content log-container">
          {logs.map((log, i) => (
            <div key={i} className="log-item">
              <div className="log-item-header">
                <span className={`badge badge-${log.agent}`}>{log.agent.toUpperCase()} AGENT</span>
                <span className="log-time">{log.time}</span>
              </div>
              <div className="log-message">{log.msg}</div>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* Center Panel - The Map */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 className="header-title">Live Attack Path Ecosystem</h2>
        <p className="text-sub" style={{ marginBottom: '24px' }}>Dynamic topography synchronized with telemetry.</p>
        
        <div className="map-canvas">
          <svg className="edges-svg">
            <defs>
              <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                <stop offset="100%" stopColor="rgba(139, 92, 246, 0.4)" />
              </linearGradient>
            </defs>
            {NODES.map((node, i) => {
              if (i >= NODES.length - 1) return null;
              const nextNode = NODES[i + 1];
              if (!visibleNodes.includes(nextNode.id)) return null;
              
              return (
                <line
                  key={`edge-${i}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${nextNode.x}%`}
                  y2={`${nextNode.y}%`}
                  className={getEdgeClass(i)}
                />
              );
            })}
          </svg>
          
          {NODES.map((node) => {
             if (!visibleNodes.includes(node.id)) return null;
             return (
               <div 
                 key={node.id} 
                 className={getNodeClass(node)}
                 style={{
                   position: 'absolute',
                   top: `${node.y}%`,
                   left: `${node.x}%`,
                   transform: 'translate(-50%, -50%)',
                 }}
               >
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3>{node.title}</h3>
                    {node.id === 'B' && phase === 'secured' && (
                      <span className="badge badge-rem" style={{ marginLeft: '12px' }}>Blocked</span>
                    )}
                 </div>
                 <p>{node.sub}</p>
                 <div style={{ position: 'absolute', top: '-6px', right: '-6px' }}>
                    {node.id === 'B' && (phase === 'remediation_ready' || phase === 'simulating') && (
                      <div className="score-circle pulsing-red" style={{ width: '12px', height: '12px', margin: 0, border: 'none', background: '#ef4444' }} />
                    )}
                 </div>
               </div>
             );
          })}
        </div>
      </div>

      {/* Right Panel - Remediation */}
      <div className="glass-panel">
        <div className="panel-header">
          <div className="panel-title">Posture Status</div>
        </div>
        <div className="panel-content">
          <div className="score-circle" style={{ '--score': typeof score === 'number' ? score : 0 }}>
            <span className="score-value">{score}</span>
            <span className="score-label">Confidence</span>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Risk Evaluation</h3>
            <p className="text-sub">Continuous environmental stress testing.</p>
          </div>

          <div style={{ opacity: phase === 'remediation_ready' || phase === 'secured' ? 1 : 0.3, transition: 'opacity 0.5s' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>Action Required</h3>
            <div className="choke-point-card">
              <div className="choke-title">
                 <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                 Choke Point Identified
              </div>
              <p style={{ fontSize: '13px', color: '#f8fafc', marginBottom: '6px' }}>Node B: Shadow API</p>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>
                Securing this node collapses 100% of currently known pathways to Domain Admin credentials.
              </p>
            </div>

            <button 
              className="btn-remediate" 
              onClick={handleRemediate}
              disabled={phase !== 'remediation_ready'}
            >
              {phase === 'secured' ? 'Virtual Patch Applied' : 'Execute Safe Fix'}
            </button>
            <p style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', marginTop: '12px' }}>
              Deploys temporary WAF policy & requires hardware MFA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
