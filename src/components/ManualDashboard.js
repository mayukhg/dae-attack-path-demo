import React, { useState } from 'react';

export default function ManualDashboard({ onSimulate, onMitigate, phase }) {
  const [isSimulating, setIsSimulating] = useState(false);

  const triggerManualSimulation = () => {
    // Fake the slow legacy loading speed
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      onSimulate();
    }, 3500);
  };

  const triggerManualFixes = () => {
    // Artificial friction
    const isConfirmed = window.confirm("WARNING: Deploying these static fixes will modify core firewall routing tables. Proceed?");
    if (isConfirmed) {
       onMitigate();
    }
  };

  return (
    <div style={{ height: '100vh', background: '#0f172a', borderLeft: '2px solid #334155', padding: '24px', fontFamily: 'monospace' }}>
      
      <div style={{ borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', color: '#94a3b8' }}>Legacy SecOps Console (Static)</h2>
        <span style={{ fontSize: '10px', color: '#64748b' }}>Last Scan: 14 hours ago</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Utilitarian Discovered Paths List */}
        <div>
          <h3 style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '12px', textTransform: 'uppercase' }}>Identified Vulnerability Paths</h3>
          <table style={{ width: '100%', fontSize: '11px', textAlign: 'left', border: '1px solid #334155' }}>
            <thead style={{ background: '#1e293b' }}>
               <tr>
                 <th style={{ padding: '8px', borderRight: '1px solid #334155' }}>Path ID</th>
                 <th style={{ padding: '8px', borderRight: '1px solid #334155' }}>CVE Chain</th>
                 <th style={{ padding: '8px' }}>Syslog Priority</th>
               </tr>
            </thead>
            <tbody>
               <tr style={{ borderBottom: '1px solid #334155' }}>
                 <td style={{ padding: '8px', borderRight: '1px solid #334155' }}>PATH-092 (UAT {'->'} DC)</td>
                 <td style={{ padding: '8px', borderRight: '1px solid #334155' }}>CVE-2023-XYZ, NTLM</td>
                 <td style={{ padding: '8px', color: '#cbd5e1' }}>P1</td>
               </tr>
               <tr style={{ borderBottom: '1px solid #334155' }}>
                 <td style={{ padding: '8px', borderRight: '1px solid #334155' }}>PATH-011 (DMZ {'->'} Kube)</td>
                 <td style={{ padding: '8px', borderRight: '1px solid #334155' }}>Container Breakout</td>
                 <td style={{ padding: '8px', color: '#cbd5e1' }}>P1</td>
               </tr>
            </tbody>
          </table>
        </div>

        {/* Manual Interaction Container */}
        <div style={{ border: '1px solid #334155', padding: '16px', background: '#1e293b' }}>
           <h3 style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '16px', textTransform: 'uppercase' }}>Manual Command Execution</h3>
           
           <button 
             style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #64748b', color: '#cbd5e1', cursor: (phase !== 'init' || isSimulating) ? 'not-allowed' : 'pointer', opacity: (phase !== 'init') ? 0.3 : 1 }}
             onClick={triggerManualSimulation}
             disabled={phase !== 'init' || isSimulating}
           >
             {isSimulating ? 'EXECUTING PING TRACE...' : 'Execute Manual Ping Trace'}
           </button>

           {phase === 'simulating' && (
              <div style={{ padding: '16px', borderLeft: '4px solid #ef4444', background: '#450a0a', marginTop: '16px', color: '#fca5a5' }}>
                 <strong>SYSLOG ALERT:</strong> Unidentified lateral movement detected at 10.0.4.52 (Shadow API). Requires immediate SecOps review to draft iptables.
              </div>
           )}

           <button 
             style={{ width: '100%', padding: '12px', background: '#dc2626', border: 'none', color: 'white', marginTop: '16px', cursor: phase !== 'simulating' ? 'not-allowed' : 'pointer', opacity: phase !== 'simulating' ? 0.3 : 1 }}
             onClick={triggerManualFixes}
             disabled={phase !== 'simulating'}
           >
             Push Static Mitigation State
           </button>
        </div>

      </div>
    </div>
  );
}
