import { useState, useEffect, useRef } from 'react';

const mockCVEs = [
  { id: 'CVE-2020-1938', title: 'Apache Tomcat AJP File Inclusion Vulnerability', assets: 26, score: 9.6 },
  { id: 'CVE-2021-40438', title: 'Apache HTTP Server Multiple Vulnerabilities', assets: 3, score: 10.0 },
  { id: 'CVE-2024-4577', title: 'PHP CGI Argument Injection Vulnerability', assets: 2, score: 10.0 }
];

export default function AgentDaeChat({ onAction }) {
  const [messages, setMessages] = useState([]);
  const [chatPhase, setChatPhase] = useState('discovery'); // discovery, selection, scanning, remediation_options, fixing, complete
  const [selectedCVE, setSelectedCVE] = useState('');
  const endOfChatRef = useRef(null);

  // Initialize opening message sequence
  useEffect(() => {
    if (chatPhase === 'discovery' && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          { sender: 'agent', type: 'text', content: "Hello, I am Agent DAE. I continuously validate whether your risky exposures are exploitable, using real attacker techniques in a safe, controlled manner." },
        ]);
      }, 500);

      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'agent', type: 'text', content: "Analysing your environment, hold tight..." }]);
        onAction('init_map'); // Triggers React Flow to draw initial nodes mapping UAT out
      }, 2000);

      setTimeout(() => {
        setMessages(prev => [...prev, 
          { sender: 'agent', type: 'text', content: "You're off to a great start in validating your risk posture! I've done some groundwork and analyzed 3 trending CVEs relevant to the Technology industry uncovering 33 instances across 31 assets." },
          { sender: 'agent', type: 'cve_selection', data: mockCVEs }
        ]);
        setChatPhase('selection');
      }, 4500);
    }
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatPhase, messages.length]);

  const handleCVESelect = (cveId) => {
    setSelectedCVE(cveId);
    setMessages(prev => [...prev, 
      { sender: 'user', type: 'text', content: `Validate ${cveId}` },
      { sender: 'agent', type: 'text', content: `Great choice, I will run a safe exploit validation on the identified CVE. The test will be executed through the most appropriate external Qualys scanner to provide a true hacker's-eye view.` },
      { sender: 'agent', type: 'assessment_action', cveId: cveId }
    ]);
  };

  const handleRunAssessment = () => {
    setChatPhase('scanning');
    setMessages(prev => [...prev, { sender: 'user', type: 'text', content: "Run DAE Assessment" }]);
    onAction('simulate_path'); // Triggers the map's simulation routing animation
    
    setTimeout(() => {
      setMessages(prev => [...prev, 
        { sender: 'agent', type: 'scanning_results', cveId: selectedCVE }
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
      { sender: 'agent', type: 'text', content: `Mitigation deployment initiated for ${selectedCVE} on 98.93.250.26. The system is now applying the workaround.` }
    ]);
    
    setTimeout(() => {
       setMessages(prev => [...prev, { sender: 'agent', type: 'mitigation_success' }]);
       onAction('secure_path'); // Triggers the map to break the edge visually
    }, 2500);

    setTimeout(() => {
       setMessages(prev => [...prev, { sender: 'agent', type: 'revalidation_results' }]);
       setChatPhase('complete');
    }, 5500);
  };

  // --- Render Helpers ---
  const renderMessageContent = (msg, i) => {
    switch (msg.type) {
      case 'text':
        return <div className="chat-bubble">{msg.content}</div>;
      
      case 'cve_selection':
        return (
          <div className="card-container">
            <h4><span style={{color:'#facc15'}}>★</span> Recommendation</h4>
            <p style={{fontSize:'12px', marginBottom:'12px'}}>3 CVEs stand out as immediate priorities. I recommend validating one at a time.</p>
            <div className="cve-list">
              {msg.data.map(cve => (
                <div key={cve.id} className={`cve-card ${selectedCVE === cve.id ? 'selected' : ''}`} onClick={() => handleCVESelect(cve.id)}>
                   <div style={{fontWeight:600}}>{cve.id}</div>
                   <div style={{fontSize:'11px', color:'#94a3b8'}}>{cve.title}</div>
                   <div className="cve-stats">
                     <span>Assets: {cve.assets}</span>
                     <span className="qd-score">{cve.score}</span>
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
               Run DAE Assessment
             </button>
           </div>
         );

      case 'scanning_results':
         return (
           <div className="card-container">
              <h4>Scanning Assets</h4>
              <p style={{fontSize:'12px', marginBottom:'12px'}}>
                The scan findings targeting 98.93.250.26 show a QVSS score increase from 9.6 to 9.9. Exploit validation status is confirmed, indicating a high risk.
              </p>
              <div className="score-compare-card">
                 <div className="score-box">
                   <h2>9.60</h2>
                   <span>QVSS</span>
                 </div>
                 <div className="validation-middle">
                   <div className="bug-icon">🐞</div>
                   <span style={{fontSize:'10px'}}>Exploit Validated ↑ 0.3</span>
                 </div>
                 <div className="score-box critical">
                   <h2>9.90</h2>
                   <span>QVSS</span>
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
             <p style={{fontSize:'12px', marginBottom:'12px'}}>I'd recommend you go with the mitigation option and then do a quick DAE revalidation.</p>
             <div className="mitigation-card mt-2">
                <div className="flex justify-between">
                  <span style={{fontWeight:600, color:'#10b981'}}>1 Mitigation</span>
                  <span style={{fontSize:'10px', background:'#334155', padding:'2px 6px', borderRadius:'4px'}}>High ⓘ</span>
                </div>
                <div style={{marginTop:'8px', fontSize:'12px'}}>
                  Update Config File (Source: Qualys) <br/>
                  Impact Factor: 90
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
              <p style={{fontSize:'12px', marginTop:'8px'}}>Re-launching DAE assessment for CVE-2020-1938 to verify remediation effectiveness...</p>
           </div>
         );

      case 'revalidation_results':
         return (
           <div className="card-container">
              <h4>QVSS Score After Remediation</h4>
              <div className="score-compare-card">
                 <div className="score-box">
                   <h2>9.60</h2>
                   <span>Base</span>
                 </div>
                 <div className="validation-middle">
                   <div className="shield-icon">🛡️</div>
                   <span style={{fontSize:'10px', color:'#10b981'}}>Exploit Ruled Out ↓ 1.9</span>
                 </div>
                 <div className="score-box safe">
                   <h2>7.70</h2>
                   <span>QVSS</span>
                 </div>
              </div>
              <p style={{fontSize:'12px', marginTop:'12px'}}>⭐ Done! Your exploit validation summary has been sent to your Teams channel.</p>
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
