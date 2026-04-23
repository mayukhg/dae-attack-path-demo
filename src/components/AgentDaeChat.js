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
  const [showAudit, setShowAudit] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const endOfChatRef = useRef(null);
  const initRef = useRef(false);

  const pushMessage = (msg, delay) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, msg]);
      if (chatPhase.startsWith('phase3')) {
         setAuditLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: `${msg.identity || 'System'}: ${msg.content || 'Action executed'}` }]);
      }
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

  const handleWhyRecommendation = () => {
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "Why did you recommend this?" }]);
    
    setTimeout(() => {
       pushMessage({ 
         sender: 'agent', 
         identity: 'Remediation Agent', 
         color: '#fb923c', 
         type: 'text', 
         content: "I recommended a Hardware MFA because the simulation showed the attacker successfully bypasses traditional password-based sessions via NTLM extraction at Node F. Deploying MFA acts as an immediate circuit breaker." 
       }, 1500);
    }, 500);
  };

  const handleExportPaC = () => {
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "Export Policy-as-Code (Terraform)" }]);
    
    setTimeout(() => {
       pushMessage({ 
         sender: 'agent', 
         identity: 'Remediation Agent', 
         color: '#fb923c', 
         type: 'pac_export' 
       }, 1500);
    }, 500);
  };

  const handleWhatIf = () => {
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "What if we move this database to a different VPC?" }]);
    
    setTimeout(() => {
       pushMessage({ 
         sender: 'agent', 
         identity: 'Simulation Agent', 
         color: '#a855f7', 
         type: 'what_if_result' 
       }, 1500);
    }, 500);
  };

  const handleGenerateReport = () => {
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "Generate Executive Report" }]);
    
    setTimeout(() => {
       pushMessage({ 
         sender: 'agent', 
         identity: 'Reporting Agent', 
         color: '#14b8a6', 
         type: 'executive_report' 
       }, 2000);
    }, 500);
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

  // --- Phase 3 Flows ---
  const handleStartPhase3 = () => {
    setChatPhase('phase3_discovery');
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "Begin Phase 3: Advanced Command Center" }]);
    
    setTimeout(() => {
        pushMessage({ sender: 'agent', identity: 'Mapping Agent', color: '#3b82f6', type: 'text', content: "Executing advanced parallel topography scan..." }, 1000);
        onAction('init_phase3_map');
        setSharedState({ activePaths: 3, pcsScore: 0 }); 
    }, 500);

    setTimeout(() => {
        pushMessage({ sender: 'agent', identity: 'Mapping Agent', color: '#3b82f6', type: 'text', content: "I've discovered 3 critical paths simultaneously. Path 1 is the highest priority because it converges with Path 2 at Node B (Shadow API) — this is a critical choke point that, if secured, collapses both paths." }, 4500);
    }, 500);

    setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'agent', type: 'phase3_selection' }]);
        setChatPhase('phase3_selection');
    }, 7500);
  };

  const handlePhase3Simulate = () => {
    setChatPhase('phase3_simulating');
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "Simulate Prioritized Path & Enumerate Blast Radius" }]);
    onAction('simulate_phase3_path');
    setSharedState({ isSimulating: true });
    setAuditLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: `System: Path traversal initiated on Path 1` }]);
    
    setTimeout(() => {
       pushMessage({ sender: 'agent', identity: 'Simulation Agent', color: '#a855f7', type: 'text', content: "Traversing Path 1 with confidence scoring and MITRE technique evaluation..." }, 500);
    }, 500);

    setTimeout(() => {
       onAction('simulate_blast_radius');
       setMessages(prev => [...prev, { sender: 'agent', type: 'phase3_blast_radius' }]);
       setAuditLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: `Simulation Agent: Lateral movement achieved. 14 assets exposed.` }]);
       setChatPhase('phase3_remediation_options');
       setSharedState({ isSimulating: false, pcsScore: 9.9 });
    }, 5500);
  };

  const handlePhase3Mitigate = (option) => {
    setChatPhase('phase3_fixing');
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: `Deploy ${option}` }]);
    
    setTimeout(() => {
       pushMessage({ sender: 'agent', identity: 'Remediation Agent', color: '#fb923c', type: 'text', content: `Applying mitigation. Target: Node B. Securing the choke point.` }, 1000);
    }, 500);
    
    setTimeout(() => {
       setMessages(prev => [...prev, { sender: 'agent', type: 'mitigation_success' }]);
       onAction('secure_phase3_path'); 
    }, 3000);

    setTimeout(() => {
       setMessages(prev => [...prev, { sender: 'agent', type: 'phase3_bypass_prompt' }]);
       setChatPhase('phase3_bypass');
       setSharedState({ pcsScore: 7.7, activePaths: 1 });
    }, 6000);
  };

  const handlePhase3Bypass = () => {
    setChatPhase('phase3_bypassing');
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "Yes, simulate bypass" }]);
    onAction('simulate_bypass');
    
    setTimeout(() => {
       pushMessage({ sender: 'agent', identity: 'Simulation Agent', color: '#a855f7', type: 'text', content: "Attempting alternate traversal via T1059 (Command and Scripting Interpreter)..." }, 1000);
    }, 500);

    setTimeout(() => {
       setMessages(prev => [...prev, { sender: 'agent', type: 'phase3_complete' }]);
       setChatPhase('phase3_complete');
    }, 4500);
  };

  const handlePhase3NLQ = (e) => {
    e.preventDefault();
    const q = e.target.elements.q.value;
    if (!q) return;
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: q }]);
    e.target.reset();
    
    setTimeout(() => {
       pushMessage({ sender: 'agent', identity: 'Analytics Agent', color: '#6366f1', type: 'text', content: "Analyzing hypothetical scenario... If the VPN gateway (Node K) was lost, Path 3 would be entirely severed. The global PCS would reduce to 4.2, but 35 remote employees would lose access to the internal HR network." }, 1000);
    }, 500);
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
                 Which demonstration phase would you like to execute?
              </p>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                 <button className="btn-primary" style={{width:'100%'}} onClick={handleStartScoping} disabled={chatPhase !== 'intro'}>
                   Phase 1: Critical Attack Path Discovery
                 </button>
                 <button className="btn-primary" style={{width:'100%', background: '#10b981'}} onClick={handleStartPhase2} disabled={chatPhase !== 'intro'}>
                   Phase 2: AI Agent Posture Validation
                 </button>
                 <button className="btn-primary" style={{width:'100%', background: '#eab308'}} onClick={handleStartPhase3} disabled={chatPhase !== 'intro'}>
                   Phase 3: Advanced Command Center
                 </button>
              </div>
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
             <p style={{fontSize:'12px', marginBottom:'12px', color: '#10b981'}}><strong>Business Impact Projection:</strong> Severing this path protects an estimated $2.4M in daily transaction volume facilitated by this API.</p>
             <div className="mitigation-card mt-2">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight:600, color:'#10b981'}}>1 Mitigation Option</span>
                  <span style={{fontSize: '9px', background: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap'}}>Closes 2 additional paths</span>
                </div>
                <div style={{marginTop:'8px', fontSize:'12px'}}>
                  Deploy Virtual WAF & Enforce Hardware MFA Circuit Breaker <br/>
                  Target: Node B (Shadow API)
                </div>
                <button className="btn-outline" style={{marginTop:'12px', fontSize: '10px', padding: '4px 8px'}} onClick={handleWhyRecommendation} disabled={chatPhase !== 'remediation_options'}>
                   Why this recommendation?
                </button>
             </div>
             <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px'}}>
                 <button className="btn-primary" style={{width:'100%'}} onClick={handleMitigate} disabled={chatPhase !== 'remediation_options'}>
                   Deploy Mitigation + Revalidate
                 </button>
                 <button className="btn-outline" style={{width:'100%'}} onClick={handleExportPaC} disabled={chatPhase !== 'remediation_options'}>
                   Export Policy-as-Code (Terraform)
                 </button>
                 <button className="btn-outline" style={{width:'100%'}} onClick={handleWhatIf} disabled={chatPhase !== 'remediation_options'}>
                   What-If Sandbox: Move DB to isolated VPC
                 </button>
             </div>
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
                 <>
                   <button className="btn-primary" style={{marginTop:'12px', width:'100%', background: '#14b8a6'}} onClick={handleGenerateReport}>
                     Generate Executive Report
                   </button>
                   <button className="btn-primary" style={{marginTop:'12px', width:'100%'}} onClick={handleStartPhase2}>
                     Begin Phase 2: AI Agent Posture Validation
                   </button>
                   <button className="btn-primary" style={{marginTop:'12px', width:'100%', background: '#eab308'}} onClick={handleStartPhase3}>
                     Begin Phase 3: Advanced Command Center
                   </button>
                 </>
              )}
              <button className="btn-outline" style={{marginTop:'12px', width:'100%', borderColor: '#64748b', color: '#cbd5e1'}} onClick={handleAgentReset}>
                ↻ Restart Agent Workflow // End Part 1
              </button>
           </div>
         );

      case 'pac_export':
         return (
           <div className="card-container border-green">
              <div style={{color:'#10b981', fontWeight:600, marginBottom:'8px'}}>Terraform Exported</div>
              <pre style={{background:'#1e293b', padding:'8px', borderRadius:'4px', fontSize:'10px', color:'#cbd5e1', overflowX:'auto'}}>
{`resource "aws_wafv2_web_acl" "shadow_api_waf" {
  name  = "shadow-api-protection"
  scope = "REGIONAL"

  rule {
    name     = "mfa-circuit-breaker"
    priority = 1
    action { block {} }
    statement {
      # Custom logic mapped
    }
  }
}`}
              </pre>
              <p style={{fontSize:'12px', marginTop:'8px'}}>The Terraform snippet is ready. You can merge this directly into your GitOps pipeline.</p>
           </div>
         );

      case 'what_if_result':
         return (
           <div className="card-container" style={{borderColor: '#a855f7'}}>
              <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px'}}>
                 <span style={{fontSize:'10px', background:'#a855f7', padding:'2px 6px', borderRadius:'4px', color:'white', fontWeight:'bold'}}>SIMULATION AGENT</span>
                 <h4 style={{color:'#a855f7'}}>Sandbox Result</h4>
              </div>
              <p style={{fontSize:'12px', marginBottom:'8px'}}>If we move the Customer Root Database to a different, isolated VPC:</p>
              <ul style={{fontSize:'11px', paddingLeft:'20px', color:'#cbd5e1', listStyleType:'circle'}}>
                 <li style={{marginBottom:'4px'}}>The PCS score of our Domain Admin path drops from 9.9 to <strong>3.2</strong>.</li>
                 <li><span style={{color: '#facc15', fontWeight:'bold'}}>Warning:</span> It introduces an estimated 45ms latency for the Finance Application.</li>
              </ul>
           </div>
         );

      case 'executive_report':
         return (
           <div className="card-container" style={{borderColor: '#14b8a6', background: 'rgba(20, 184, 166, 0.05)'}}>
              <h4 style={{color:'#14b8a6', marginBottom:'12px', borderBottom:'1px solid rgba(20,184,166,0.2)', paddingBottom:'8px'}}>EXECUTIVE SUMMARY</h4>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', fontSize:'11px'}}>
                 <div style={{color:'#94a3b8'}}>Paths Discovered:</div>
                 <div style={{fontWeight:'bold', color:'white'}}>3 Critical Paths</div>
                 <div style={{color:'#94a3b8'}}>PCS Before/After:</div>
                 <div style={{fontWeight:'bold', color:'#10b981'}}>9.9 → 7.7</div>
                 <div style={{color:'#94a3b8'}}>Remediation:</div>
                 <div style={{fontWeight:'bold', color:'white'}}>WAF & MFA Enforced</div>
                 <div style={{color:'#94a3b8'}}>Time Elapsed:</div>
                 <div style={{fontWeight:'bold', color:'white'}}>~15 Seconds</div>
                 <div style={{color:'#94a3b8'}}>Assets Protected:</div>
                 <div style={{fontWeight:'bold', color:'#10b981'}}>$2.4M Daily Vol. / AD Core</div>
              </div>
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
              <button className="btn-primary" style={{marginTop:'12px', width:'100%', background: '#eab308'}} onClick={handleStartPhase3}>
                 Begin Phase 3: Advanced Command Center
              </button>
              <button className="btn-outline" style={{marginTop:'12px', width:'100%', borderColor: '#64748b', color: '#cbd5e1'}} onClick={handleAgentReset}>
                ↻ Supercharge Complete (Back to Start)
              </button>
           </div>
         );

      // --- Phase 3 Cards ---
      case 'phase3_selection':
         return (
           <div className="card-container">
             <h4><span style={{color:'#facc15'}}>★</span> Multi-Path Prioritization</h4>
             <p style={{fontSize:'12px', marginTop:'8px'}}>I have mapped 3 distinct attack vectors. Path 1 is the critical priority due to convergence.</p>
             <button className="btn-primary" style={{marginTop:'12px', width:'100%'}} onClick={handlePhase3Simulate} disabled={chatPhase !== 'phase3_selection'}>
               Simulate Prioritized Path & Blast Radius
             </button>
           </div>
         );

      case 'phase3_blast_radius':
         return (
           <div className="card-container" style={{borderColor: '#ef4444'}}>
              <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px'}}>
                 <span style={{fontSize:'10px', background:'#a855f7', padding:'2px 6px', borderRadius:'4px', color:'white', fontWeight:'bold'}}>SIMULATION AGENT</span>
              </div>
              <h4 style={{color:'#ef4444'}}>Lateral Movement & Blast Radius</h4>
              <p style={{fontSize:'12px', marginTop:'8px'}}>Simulation traversed successfully (T1190 -> T1505 -> T1003 -> T1550). Shadow API breached.</p>
              <p style={{fontSize:'12px', marginTop:'8px', fontWeight:'bold', color:'#fca5a5'}}>If this path is exploited, the attacker gains access to 14 additional assets including the production HR Database and Finance API.</p>
              <div style={{marginTop:'12px'}}>
                 <h5 style={{color:'#94a3b8', fontSize:'10px', marginBottom:'8px'}}>MULTI-REMEDIATION TRADE-OFFS</h5>
                 <div className="mitigation-card mt-2" style={{cursor:'pointer'}} onClick={() => chatPhase === 'phase3_remediation_options' && handlePhase3Mitigate('WAF Rule')}>
                   <div style={{fontWeight:600, color:'#10b981', fontSize:'11px'}}>Option 1: Emergency WAF Rule</div>
                   <div style={{fontSize:'10px', color:'#94a3b8', marginTop:'4px'}}>Deploys in seconds. Blocks 90% of variants. (Temporary)</div>
                 </div>
                 <div className="mitigation-card mt-2" style={{cursor:'pointer', borderColor:'rgba(250,204,21,0.3)'}} onClick={() => chatPhase === 'phase3_remediation_options' && handlePhase3Mitigate('Patch CVE-2023-50164')}>
                   <div style={{fontWeight:600, color:'#facc15', fontSize:'11px'}}>Option 2: Patch CVE-2023-50164</div>
                   <div style={{fontSize:'10px', color:'#94a3b8', marginTop:'4px'}}>Permanent fix. Requires 4-hour maintenance window.</div>
                 </div>
                 <div className="mitigation-card mt-2" style={{cursor:'pointer', borderColor:'rgba(59,130,246,0.3)'}} onClick={() => chatPhase === 'phase3_remediation_options' && handlePhase3Mitigate('Network Seg + MFA')}>
                   <div style={{fontWeight:600, color:'#3b82f6', fontSize:'11px'}}>Option 3: Segment Network + MFA</div>
                   <div style={{fontSize:'10px', color:'#94a3b8', marginTop:'4px'}}>Blocks lateral movement entirely. Zero downtime.</div>
                 </div>
              </div>
           </div>
         );

      case 'phase3_bypass_prompt':
         return (
           <div className="card-container border-green">
              <p style={{fontSize:'12px'}}>Mitigation holds. Would you like me to simulate what happens if this WAF rule is bypassed by an advanced persistent threat?</p>
              <button className="btn-primary" style={{marginTop:'12px', width:'100%'}} onClick={handlePhase3Bypass} disabled={chatPhase !== 'phase3_bypass'}>
                Yes, simulate bypass
              </button>
           </div>
         );

      case 'phase3_complete':
         return (
           <div className="card-container">
              <h4 style={{color:'#10b981'}}>No Viable Bypass Found</h4>
              <p style={{fontSize:'12px', marginTop:'8px'}}>Secondary traversal blocked. Remediation holds. Total environment PCS stabilized at 7.7.</p>
              <button className="btn-outline" style={{marginTop:'12px', width:'100%', borderColor: '#64748b', color: '#cbd5e1'}} onClick={handleAgentReset}>
                ↻ Restart to Phase 1 Workflow
              </button>
           </div>
         );

      default: return null;
    }
  };

  return (
    <div className="agent-chat-container" style={{ flex: 1, minHeight: 0 }}>
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

      {chatPhase.startsWith('phase3') && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.95)', zIndex: 10 }}>
           <div 
             style={{ padding: '8px 16px', fontSize: '11px', color: '#94a3b8', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
             onClick={() => setShowAudit(!showAudit)}
           >
             <span style={{fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'}}>Audit Trail & Compliance Log</span>
             <span>{showAudit ? '▼' : '▲'}</span>
           </div>
           
           {showAudit && (
             <div style={{ padding: '0 16px 16px 16px', maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {auditLogs.length === 0 ? <div style={{fontSize:'11px', color:'#64748b'}}>No actions logged yet.</div> : 
                 auditLogs.map((log, i) => (
                   <div key={i} style={{fontSize: '11px', color: '#cbd5e1', display: 'flex', gap: '12px', borderLeft: '2px solid #3b82f6', paddingLeft: '8px'}}>
                     <span style={{color: '#64748b', minWidth: '60px'}}>{log.time}</span>
                     <span>{log.text}</span>
                   </div>
                 ))
                }
             </div>
           )}

           {chatPhase === 'phase3_complete' && (
             <form onSubmit={handlePhase3NLQ} style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <input name="q" placeholder="Ask a hypothetical scenario..." style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', fontSize: '12px' }} autoComplete="off" />
             </form>
           )}
        </div>
      )}
    </div>
  );
}
