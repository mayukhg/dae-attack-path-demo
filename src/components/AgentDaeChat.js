import { useState, useEffect, useRef } from 'react';

const mockPaths = [
  { id: 'Path 1: UAT Dev -> Shadow API', nexus: 'API BOLA Abuse', nodes: 5, score: 9.6 },
  { id: 'Path 2: DMZ -> Kubelet', nexus: 'Container Escape', nodes: 3, score: 10.0 },
  { id: 'Path 3: Phishing -> VPN', nexus: 'Credential Theft', nodes: 4, score: 10.0 }
];

export default function AgentDaeChat({ onAction }) {
  const [messages, setMessages] = useState([]);
  const [chatPhase, setChatPhase] = useState('discovery'); // discovery, selection, scanning, remediation_options, fixing, complete
  const [selectedPath, setSelectedPath] = useState('');
  const endOfChatRef = useRef(null);

  // Initialize opening message sequence
  useEffect(() => {
    if (chatPhase === 'discovery' && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          { sender: 'agent', type: 'text', content: "Hello, I am Agent DAE. I continuously map your infrastructure for blast radiuses and lateral movement paths, using real attacker techniques in a safe, controlled manner." },
        ]);
      }, 500);

      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'agent', type: 'text', content: "Validating your topology, hold tight..." }]);
        onAction('init_map');
      }, 2000);

      setTimeout(() => {
        setMessages(prev => [...prev, 
          { sender: 'agent', type: 'text', content: "You're off to a great start in mapping your risk posture! I've done some groundwork and analyzed 3 critical attack paths converging on your core assets." },
          { sender: 'agent', type: 'path_selection', data: mockPaths }
        ]);
        setChatPhase('selection');
      }, 4500);
    }
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatPhase, messages.length]);

  const handlePathSelect = (pathId) => {
    setSelectedPath(pathId);
    setMessages(prev => [...prev, 
      { sender: 'user', type: 'text', content: `Validate ${pathId}` },
      { sender: 'agent', type: 'text', content: `Great choice! I will execute a safe exploit validation simulating a lateral movement chain along this path.` },
      { sender: 'agent', type: 'assessment_action', pathId: pathId }
    ]);
  };

  const handleRunAssessment = () => {
    setChatPhase('scanning');
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "Simulate Attack Path" }]);
    onAction('simulate_path'); 
    
    setTimeout(() => {
      setMessages(prev => [...prev, 
        { sender: 'agent', type: 'scanning_results', pathId: selectedPath }
      ]);
      setChatPhase('remediation_options');
    }, 4000);
  };

  const handleViewRemediation = () => {
    setMessages(prev => [...prev, 
      { sender: 'user', type: 'text', content: "View Remediation Options" },
      { sender: 'agent', type: 'mitigation_options' }
    ]);
  };

  const handleMitigate = () => {
    setChatPhase('fixing');
    setMessages(prev => [...prev, 
      { sender: 'user', type: 'text', content: "Deploy Mitigation + Revalidate" },
      { sender: 'agent', type: 'text', content: `Mitigation deployment initiated for ${selectedPath}. Target node: 98.93.250.26 (Shadow API). The system is now applying the workaround.` }
    ]);
    
    setTimeout(() => {
       setMessages(prev => [...prev, { sender: 'agent', type: 'mitigation_success' }]);
       onAction('secure_path'); 
    }, 2500);

    setTimeout(() => {
       setMessages(prev => [...prev, { sender: 'agent', type: 'revalidation_results' }]);
       setChatPhase('complete');
    }, 5500);
  };

  const handleAgentReset = () => {
    setMessages([]);
    setSelectedPath('');
    setChatPhase('discovery');
    onAction('init_map'); 
  };

  // --- Render Helpers ---
  const renderMessageContent = (msg, i) => {
    switch (msg.type) {
      case 'text':
        return <div className="chat-bubble">{msg.content}</div>;
      
      case 'path_selection':
        return (
          <div className="card-container">
            <h4><span style={{color:'#facc15'}}>★</span> Recommendation</h4>
            <p style={{fontSize:'12px', marginBottom:'12px'}}>3 Paths pose immediate risk to your Domain Admin. I recommend validating one at a time.</p>
            <div className="cve-list">
              {msg.data.map(p => (
                <div key={p.id} className={`cve-card ${selectedPath === p.id ? 'selected' : ''}`} onClick={() => handlePathSelect(p.id)}>
                   <div style={{fontWeight:600}}>{p.id}</div>
                   <div style={{fontSize:'11px', color:'#94a3b8'}}>Nexus: {p.nexus}</div>
                   <div className="cve-stats">
                     <span>Nodes Traversed: {p.nodes}</span>
                     <span className="qd-score">{p.score}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'assessment_action':
         return (
           <div className="card-container text-right">
             <button className="btn-primary" onClick={handleRunAssessment} disabled={chatPhase !== 'selection'}>
               Simulate Attack Path
             </button>
           </div>
         );

      case 'scanning_results':
         return (
           <div className="card-container">
              <h4>Simulating Lateral Movement</h4>
              <p style={{fontSize:'12px', marginBottom:'12px'}}>
                The simulation traversed successfully. Shadow API identified as critical choke point. Path Criticality Score (PCS) increased from 9.6 to 9.9.
              </p>
              <div className="score-compare-card">
                 <div className="score-box">
                   <h2>9.60</h2>
                   <span>PCS Base</span>
                 </div>
                 <div className="validation-middle">
                   <div className="bug-icon">🐞</div>
                   <span style={{fontSize:'10px'}}>Choke Point Penetrated ↑ 0.3</span>
                 </div>
                 <div className="score-box critical">
                   <h2>9.90</h2>
                   <span>PCS</span>
                 </div>
              </div>
              <button 
                className="btn-outline" 
                style={{marginTop:'12px', width:'100%'}} 
                onClick={handleViewRemediation}
                disabled={chatPhase !== 'remediation_options'}
              >
                View Remediation Options
              </button>
           </div>
         );

      case 'mitigation_options':
         return (
           <div className="card-container">
             <p style={{fontSize:'12px', marginBottom:'12px'}}>I'd recommend you go with the mitigation option protecting the choke point, and then do a quick DAE revalidation.</p>
             <div className="mitigation-card mt-2">
                <div className="flex justify-between">
                  <span style={{fontWeight:600, color:'#10b981'}}>1 Mitigation</span>
                  <span style={{fontSize:'10px', background:'#334155', padding:'2px 6px', borderRadius:'4px'}}>High ⓘ</span>
                </div>
                <div style={{marginTop:'8px', fontSize:'12px'}}>
                  Deploy Virtual WAF & Enforce Hardware MFA Circuit Breaker <br/>
                  Target: Node B (Shadow API)
                </div>
             </div>
             <button className="btn-primary" style={{marginTop:'12px', width:'100%'}} onClick={handleMitigate} disabled={chatPhase !== 'remediation_options'}>
               Mitigate + Revalidate
             </button>
           </div>
         );

      case 'mitigation_success':
         return (
           <div className="card-container border-green">
              <div style={{color:'#10b981', fontWeight:600, marginBottom:'8px'}}>✔ Mitigation Deployment</div>
              <p style={{fontSize:'12px'}}>1/1 Successful.</p>
              <p style={{fontSize:'12px', marginTop:'8px'}}>Re-launching DAE simulation across the topography to verify remediation effectiveness...</p>
           </div>
         );

      case 'revalidation_results':
         return (
           <div className="card-container">
              <h4>Path Criticality Score After Remediation</h4>
              <div className="score-compare-card">
                 <div className="score-box">
                   <h2>9.60</h2>
                   <span>Base</span>
                 </div>
                 <div className="validation-middle">
                   <div className="shield-icon">🛡️</div>
                   <span style={{fontSize:'10px', color:'#10b981'}}>Path Completely Severed ↓ 1.9</span>
                 </div>
                 <div className="score-box safe">
                   <h2>7.70</h2>
                   <span>PCS</span>
                 </div>
              </div>
              <p style={{fontSize:'12px', marginTop:'12px'}}>⭐ Done! Your path validation summary has been sent to your Teams channel.</p>
              <button 
                className="btn-outline" 
                style={{marginTop:'12px', width:'100%', borderColor: '#64748b', color: '#cbd5e1'}} 
                onClick={handleAgentReset}
              >
                ↻ Restart Agent Workflow
              </button>
           </div>
         );

      default: return null;
    }
  };

  return (
    <div className="agent-chat-container">
      <div className="chat-header">
        <div className="agent-avatar">🤖</div>
        <div style={{fontWeight:600}}>Agent DAE</div>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message-row ${msg.sender}`}>
            {msg.sender === 'agent' && <div className="mini-avatar">🤖</div>}
            <div className="message-content">
              {renderMessageContent(msg, i)}
            </div>
            {msg.sender === 'user' && <div className="mini-avatar user">👤</div>}
          </div>
        ))}
        <div ref={endOfChatRef} />
      </div>
    </div>
  );
}
