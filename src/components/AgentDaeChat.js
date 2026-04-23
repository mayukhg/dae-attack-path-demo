import { useState, useEffect, useRef } from 'react';

const mockPaths = [
  { id: 'Path 1: UAT Dev -> Shadow API', nexus: 'API BOLA Abuse', nodes: 5, score: 9.6 },
  { id: 'Path 2: DMZ -> Kubelet', nexus: 'Container Escape', nodes: 3, score: 10.0 },
  { id: 'Path 3: Phishing -> VPN', nexus: 'Credential Theft', nodes: 4, score: 10.0 }
];

const TypingIndicator = () => (
  <div className="typing-indicator" style={{ display: 'flex', gap: '4px', padding: '12px 16px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '12px', width: 'fit-content' }}>
    <span className="dot"></span><span className="dot"></span><span className="dot"></span>
  </div>
);

export default function AgentDaeChat({ onAction, setSharedState }) {
  const [messages, setMessages] = useState([]);
  const [chatPhase, setChatPhase] = useState('intro');
  const [selectedPath, setSelectedPath] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfChatRef = useRef(null);
  const initRef = useRef(false);

  const pushMessage = (msg, delay) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, msg]);
    }, delay);
  };

  useEffect(() => {
    if (chatPhase === 'intro' && messages.length === 0 && !initRef.current) {
      initRef.current = true;
      pushMessage({ sender: 'agent', identity: 'Mapping Agent', color: '#3b82f6', type: 'intro_prompt' }, 1500);
    }
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatPhase, messages.length]);

  const handleStartScoping = () => {
    setChatPhase('discovery');
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "Yes, start critical attack path discovery" }]);
    
    setTimeout(() => {
        pushMessage({ sender: 'agent', identity: 'Mapping Agent', color: '#3b82f6', type: 'text', content: "Validating your topology, hold tight..." }, 1000);
        onAction('init_map');
    }, 1500);

    setTimeout(() => {
        pushMessage({ sender: 'agent', identity: 'Mapping Agent', color: '#3b82f6', type: 'text', content: "You're off to a great start! I've analyzed 3 critical attack paths converging on your core assets. Please select an attack path to proceed further with the flow" }, 1500);
    }, 6000);

    setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'agent', type: 'path_selection', data: mockPaths }]);
        setChatPhase('selection');
        setSharedState({ activePaths: 3, pcsScore: 0 }); // Update global metrics
    }, 8500);
  };

  const handlePathSelect = (pathId) => {
    setSelectedPath(pathId);
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: `Validate ${pathId}` }]);
    
    // Pass off to Simulation Agent
    setTimeout(() => {
       pushMessage({ sender: 'agent', identity: 'Simulation Agent', color: '#a855f7', type: 'text', content: `Simulation Agent engaging. I will execute a safe exploit validation simulating a lateral movement chain along this path.` }, 1500);
    }, 500);

    setTimeout(() => {
       setMessages(prev => [...prev, { sender: 'agent', type: 'assessment_action', pathId: pathId }]);
    }, 2500);
  };

  const handleRunAssessment = () => {
    setChatPhase('scanning');
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "Simulate Attack Path" }]);
    onAction('simulate_path'); 
    setSharedState({ isSimulating: true });
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'agent', type: 'scanning_results', pathId: selectedPath }]);
      setChatPhase('remediation_options');
      setSharedState({ isSimulating: false, pcsScore: 9.9 });
    }, 4500);
  };

  const handleViewRemediation = () => {
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "View Remediation Options" }]);
    
    // Hand off to Remediation Agent
    setTimeout(() => {
       pushMessage({ sender: 'agent', identity: 'Remediation Agent', color: '#fb923c', type: 'mitigation_options' }, 2000);
    }, 500);
  };

  const handleMitigate = () => {
    setChatPhase('fixing');
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "Deploy Mitigation + Revalidate" }]);
    
    setTimeout(() => {
       pushMessage({ sender: 'agent', identity: 'Remediation Agent', color: '#fb923c', type: 'text', content: `Mitigation deployment initiated for ${selectedPath}. Target: Node B (Shadow API). Circuit breaker applied.` }, 1500);
    }, 500);
    
    setTimeout(() => {
       setMessages(prev => [...prev, { sender: 'agent', type: 'mitigation_success' }]);
       onAction('secure_path'); 
    }, 3500);

    setTimeout(() => {
       setIsTyping(true);
    }, 4500);

    setTimeout(() => {
       setIsTyping(false);
       setMessages(prev => [...prev, { sender: 'agent', type: 'revalidation_results' }]);
       setChatPhase('complete');
       setSharedState({ pcsScore: 7.7, activePaths: 2 }); // Path drops
    }, 6500);
  };

  const handleAgentReset = () => {
    initRef.current = false;
    setMessages([]);
    setSelectedPath('');
    setChatPhase('intro');
    setSharedState({ activePaths: 0, pcsScore: 0, isSimulating: false });
    onAction('init_map'); 
  };

  const handleStartPhase2 = () => {
    setChatPhase('phase2_discovery');
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "Begin Phase 2: AI Agent Posture Validation" }]);
    
    setTimeout(() => {
        pushMessage({ sender: 'agent', identity: 'Mapping Agent', color: '#3b82f6', type: 'text', content: "I am now shifting focus to your AI supply chain. I am now building a dynamic inventory of your AI based applications to understand what AI related implementations your teams are doing" }, 1500);
        onAction('init_ai_map'); 
        setSharedState({ activePaths: 1, pcsScore: 0 }); 
    }, 500);

    setTimeout(() => {
        pushMessage({ sender: 'agent', identity: 'Mapping Agent', color: '#3b82f6', type: 'text', content: "I have successfully mapped the new Finance AI architecture. I am natively flagging that this AI agent is currently 🌐 Internet Exposed and possesses active bindings to 🔒 Sensitive Customer Data." }, 5500);
    }, 1500);

    setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'agent', type: 'phase2_review_prompt' }]);
        setChatPhase('phase2_review');
    }, 9000);
  };

  const handlePhase2Simulate = () => {
     setChatPhase('phase2_simulating');
     setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "Authorize Security Review Simulation" }]);
     onAction('simulate_ai_path');
     
     setTimeout(() => {
        pushMessage({ sender: 'agent', identity: 'Simulation Agent', color: '#a855f7', type: 'text', content: "I am now taking over to conduct an automated security review at AI-speed without requiring manual DevOps reviews. I am simulating an external Prompt Injection attack against the Finance AI Agent to see if it can be manipulated into leaking the Customer Root Database." }, 1000);
     }, 500);

     setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'agent', type: 'phase2_remediation_prompt' }]);
        setChatPhase('phase2_remediation');
        setSharedState({ pcsScore: 10.0 });
     }, 6000);
  };

  const handlePhase2Mitigate = () => {
     setChatPhase('phase2_complete');
     setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "Authorize Dev Handoff & Secure" }]);
     
     setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'agent', type: 'mitigation_success' }]);
        onAction('secure_ai_path'); 
     }, 1500);
     
     setTimeout(() => {
        setIsTyping(true);
     }, 2500);

     setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { sender: 'agent', type: 'phase2_revalidation_results' }]);
        setSharedState({ pcsScore: 0.0, activePaths: 0 });
     }, 4500);
  };

  // --- Render Helpers ---
  const renderMessageContent = (msg, i) => {
    switch (msg.type) {
      case 'text':
        return <div className="chat-bubble">{msg.content}</div>;

      case 'intro_prompt':
         return (
           <div className="card-container text-left" style={{marginTop:'4px', marginBottom:'12px'}}>
              <p style={{marginBottom: '12px', fontSize: '13px', lineHeight: '1.4'}}>
                 Hello! I am <strong>Agent DAE (Dynamic Agentic Experience)</strong>.
              </p>
              <p style={{marginBottom: '4px', fontSize: '12px', color: '#94a3b8'}}>I perform the following actions:</p>
              <ul style={{fontSize: '12px', paddingLeft: '24px', marginBottom: '12px', color: '#cbd5e1', listStyleType: 'disc'}}>
                 <li>Autonomous critical attack path discovery</li>
                 <li>Real-time Lateral Movement Simulation</li>
                 <li>Target-specific Threat Remediation</li>
              </ul>
              <p style={{marginBottom: '4px', fontSize: '12px', color: '#94a3b8'}}>Which give you the following benefits:</p>
              <ul style={{fontSize: '12px', paddingLeft: '24px', marginBottom: '16px', color: '#cbd5e1', listStyleType: 'disc'}}>
                 <li>Drastically Reduced MTTR</li>
                 <li>Preemptive Choke-point Identification</li>
                 <li>Elimination of Legacy Manual Friction</li>
              </ul>
              <p style={{marginBottom: '16px', fontSize: '12px', fontWeight: 'bold', color: '#facc15'}}>
                 Can I start with the following action: critical attack path discovery?
              </p>
              <button className="btn-primary" style={{width:'100%'}} onClick={handleStartScoping} disabled={chatPhase !== 'intro'}>
                Yes, start critical attack path discovery
              </button>
           </div>
         );
      
      case 'path_selection':
        return (
          <div className="card-container">
            <h4><span style={{color:'#facc15'}}>★</span> Recommendation</h4>
            <div className="cve-list mt-2">
              {msg.data.map(p => (
                <div key={p.id} className={`cve-card ${selectedPath === p.id ? 'selected' : ''}`} onClick={() => handlePathSelect(p.id)}>
                   <div style={{fontWeight:600}}>{p.id}</div>
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
              <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px'}}>
                 <span style={{fontSize:'10px', background:'#a855f7', padding:'2px 6px', borderRadius:'4px', color:'white', fontWeight:'bold'}}>SIMULATION AGENT</span>
                 <h4>Lateral Movement Achieved</h4>
              </div>
              <p style={{fontSize:'12px', marginBottom:'12px'}}>
                Simulation traversed successfully. Shadow API breached. Path Criticality Score (PCS) skyrocketed from 9.6 to 9.9.
              </p>
              <button className="btn-outline" style={{width:'100%'}} onClick={handleViewRemediation} disabled={chatPhase !== 'remediation_options'}>
                View Remediation Options
              </button>
           </div>
         );

      case 'mitigation_options':
         return (
           <div className="card-container">
             <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px'}}>
                 <span style={{fontSize:'10px', background:'#fb923c', padding:'2px 6px', borderRadius:'4px', color:'white', fontWeight:'bold'}}>REMEDIATION AGENT</span>
             </div>
             <p style={{fontSize:'12px', marginBottom:'12px'}}>I recommend severing the choke point immediately.</p>
             <div className="mitigation-card mt-2">
                <div className="flex justify-between">
                  <span style={{fontWeight:600, color:'#10b981'}}>1 Mitigation Option</span>
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
              <p style={{fontSize:'12px'}}>Re-launching DAE simulation across the topography to verify remediation effectiveness...</p>
           </div>
         );

      case 'revalidation_results':
         return (
           <div className="card-container">
              <h4 style={{color:'#10b981'}}>Path Completely Severed</h4>
              <p style={{fontSize:'12px', marginTop:'12px'}}>⭐ Done! Your path validation summary has been sent. The PCS score dropped safely to 7.7.</p>
              {chatPhase === 'complete' && (
                 <button className="btn-primary" style={{marginTop:'12px', width:'100%'}} onClick={handleStartPhase2}>
                   Begin Phase 2: AI Agent Posture Validation
                 </button>
              )}
              <button className="btn-outline" style={{marginTop:'8px', width:'100%', borderColor: '#64748b', color: '#cbd5e1'}} onClick={handleAgentReset}>
                ↻ Restart Agent Workflow // End Part 1
              </button>
           </div>
         );

      case 'phase2_review_prompt':
         return (
           <div className="card-container text-right">
             <button className="btn-primary" onClick={handlePhase2Simulate} disabled={chatPhase !== 'phase2_review'}>
               Authorize Security Review Simulation
             </button>
           </div>
         );

      case 'phase2_remediation_prompt':
         return (
           <div className="card-container">
              <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px'}}>
                  <span style={{fontSize:'10px', background:'#fb923c', padding:'2px 6px', borderRadius:'4px', color:'white', fontWeight:'bold'}}>REMEDIATION AGENT</span>
              </div>
              <p style={{fontSize:'12px', marginBottom:'8px'}}>Simulation validated. The AI Agent is vulnerable. I have automatically drafted the exact architectural fix required to secure the egress perimeter.</p>
              <p style={{fontSize:'12px', marginBottom:'12px'}}>Rather than creating a manual ticket, I have automatically compiled this fix into code and sent it as a Pull Request (PR) directly to the Finance Dev Team's native GitHub repository to completely eliminate friction. Do you authorize this commit?</p>
              <button className="btn-primary" style={{width:'100%'}} onClick={handlePhase2Mitigate} disabled={chatPhase !== 'phase2_remediation'}>
                Authorize Dev Handoff & Secure
              </button>
           </div>
         );

      case 'phase2_revalidation_results':
         return (
           <div className="card-container">
              <h4 style={{color:'#10b981'}}>AI Supply Chain Secured</h4>
              <p style={{fontSize:'12px', marginTop:'12px'}}>⭐ PR successfully merged. Finance Dev Team notified organically. The PCS score neutralized completely.</p>
              <button className="btn-outline" style={{marginTop:'12px', width:'100%', borderColor: '#64748b', color: '#cbd5e1'}} onClick={handleAgentReset}>
                ↻ Supercharge Complete (Back to Start)
              </button>
           </div>
         );

      default: return null;
    }
  };

  return (
    <div className="agent-chat-container" style={{ height: '100%' }}>
      <div className="chat-header">
        <div className="agent-avatar">🤖</div>
        <div style={{fontWeight:600}}>Agent Ecosystem</div>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message-row ${msg.sender}`}>
            {msg.sender === 'agent' && (
              <div style={{display:'flex', flexDirection:'column', gap:'4px'}}>
                 {msg.identity && <div style={{fontSize:'9px', fontWeight:'bold', color: msg.color||'#3b82f6', marginLeft:'40px', textTransform:'uppercase'}}>{msg.identity}</div>}
                 <div style={{display:'flex', gap:'8px', alignItems:'flex-end'}}>
                   <div className="mini-avatar" style={{background: msg.color||'#3b82f6'}}>🤖</div>
                   <div className="message-content">{renderMessageContent(msg, i)}</div>
                 </div>
              </div>
            )}
            {msg.sender === 'user' && (
               <>
                 <div className="message-content">{renderMessageContent(msg, i)}</div>
                 <div className="mini-avatar user">👤</div>
               </>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="message-row agent">
            <div className="mini-avatar" style={{background: '#475569'}}>🤖</div>
            <TypingIndicator />
          </div>
        )}
        <div ref={endOfChatRef} style={{height:'10px'}} />
      </div>
    </div>
  );
}
