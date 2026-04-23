import React from 'react';

export default function ManualDashboard({ onSimulate, onMitigate, phase }) {
  return (
    <div className="glass-panel" style={{ height: '100vh', borderRadius: 0, borderTop: 0, borderRight: 0, borderBottom: 0 }}>
      
      <div className="panel-header">
        <div className="panel-title">
          <span>Static Path Analytics Console</span>
        </div>
        <div className="badge badge-map" style={{ background: '#475569', color: 'white', borderColor: '#64748b' }}>Manual Mode</div>
      </div>
      
      <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Discovered Paths List */}
        <div className="card-container" style={{ background: 'transparent' }}>
          <h3 style={{ fontSize: '15px', marginBottom: '8px' }}>Discovered Paths</h3>
          <table style={{ width: '100%', fontSize: '12px', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                 <th style={{ paddingBottom: '8px' }}>Path Nexus</th>
                 <th style={{ paddingBottom: '8px' }}>Nodes</th>
                 <th style={{ paddingBottom: '8px' }}>Criticality</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                 <td style={{ paddingTop: '8px' }}>UAT -> Domain Admin</td>
                 <td style={{ paddingTop: '8px' }}>5</td>
                 <td style={{ paddingTop: '8px', color: '#f8fafc' }}>High</td>
               </tr>
               <tr>
                 <td style={{ paddingTop: '8px' }}>DMZ -> Kubelet</td>
                 <td style={{ paddingTop: '8px' }}>3</td>
                 <td style={{ paddingTop: '8px', color: '#f8fafc' }}>Critical</td>
               </tr>
               <tr>
                 <td style={{ paddingTop: '8px' }}>Phishing -> VPN</td>
                 <td style={{ paddingTop: '8px' }}>4</td>
                 <td style={{ paddingTop: '8px', color: '#f8fafc' }}>Critical</td>
               </tr>
            </tbody>
          </table>
        </div>

        {/* Manual Interaction Container */}
        <div className="card-container">
           <h3 style={{ fontSize: '15px' }}>Path Interaction</h3>
           <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>Select an action to execute across the topology.</p>
           
           <button 
             className="btn-outline" 
             style={{ width: '100%', marginBottom: '12px', opacity: phase === 'init' ? 1 : 0.5 }}
             onClick={onSimulate}
             disabled={phase !== 'init'}
           >
             Trigger Simulation Ping
           </button>

           {phase === 'simulating' && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                 <div style={{ color: '#fca5a5', fontSize: '12px', fontWeight: 600 }}>! Alert: Node B (Shadow API) Breached</div>
                 <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Path requires immediate manual review and mitigation ruleset authoring.</div>
              </div>
           )}

           <button 
             className="btn-primary" 
             style={{ width: '100%', background: '#3b82f6', color: 'white' }}
             onClick={onMitigate}
             disabled={phase !== 'simulating'}
           >
             Deploy Manual Fixes
           </button>
        </div>

      </div>
    </div>
  );
}
