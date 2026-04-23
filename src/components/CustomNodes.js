import { Handle, Position } from 'reactflow';

// Common base style for CXO nodes
const baseNodeStyle = {
  background: 'rgba(15, 23, 42, 0.75)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '12px',
  width: '180px',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '4px',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
};

const handleStyle = { background: '#94a3b8', width: '8px', height: '8px', border: 'none' };

export const BaseNode = ({ data }) => {
  return (
    <div style={{ ...baseNodeStyle, ...data.styleOverrides }}>
      {/* Dynamic Target/Secured Overlays */}
      {data.status === 'compromised' && (
        <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 10px #ef4444' }} />
      )}
      {data.status === 'secured' && (
        <div style={{ position: 'absolute', inset: 0, border: '2px solid #10b981', borderRadius: '8px', pointerEvents: 'none' }} />
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
         <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '6px', fontSize:'14px' }}>
            {data.icon || '🖥️'}
         </div>
         <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{data.assetType || 'HOST'}</div>
      </div>
      
      <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>{data.label}</div>

      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
};

export const CrownJewelNode = ({ data }) => {
  return (
    <div style={{ 
      ...baseNodeStyle, 
      border: '2px solid #facc15', 
      background: 'rgba(250, 204, 21, 0.1)',
      boxShadow: '0 0 20px rgba(250, 204, 21, 0.3)',
      ...data.styleOverrides 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
         <div style={{ background: '#facc15', padding: '6px', borderRadius: '6px', fontSize:'14px' }}>
            👑
         </div>
         <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#fef08a' }}>CROWN JEWEL</div>
      </div>
      
      <div style={{ fontSize: '10px', color: '#fef08a', marginTop: '4px' }}>{data.label}</div>

      <Handle type="target" position={Position.Top} style={handleStyle} />
    </div>
  );
};

export const AiAgentNode = ({ data }) => {
  return (
    <div style={{ ...baseNodeStyle, position: 'relative', border: '1px solid #8b5cf6', background: 'rgba(139, 92, 246, 0.1)', ...data.styleOverrides }}>
      {/* Threat Tags */}
      {data.showThreats && (
         <div style={{ position: 'absolute', top: '-40px', left: '-20px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 10 }}>
            <div style={{ background: '#eab308', color: 'black', fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', boxShadow: '0 0 10px #eab308' }}>
               🌐 INTERNET EXPOSED
            </div>
            <div style={{ background: '#ef4444', color: 'white', fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', boxShadow: '0 0 10px #ef4444' }}>
               🔒 SENSITIVE CUSTOMER DATA
            </div>
         </div>
      )}
      
      {data.status === 'compromised' && (
        <div style={{ position: 'absolute', inset: 0, border: '2px solid #ef4444', borderRadius: '8px', pointerEvents: 'none', boxShadow: '0 0 15px #ef4444', zIndex: 1 }} />
      )}
      {data.status === 'secured' && (
        <div style={{ position: 'absolute', inset: 0, border: '2px solid #10b981', borderRadius: '8px', pointerEvents: 'none', boxShadow: '0 0 15px #10b981', zIndex: 1 }} />
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', zIndex: 2 }}>
         <div style={{ background: '#8b5cf6', padding: '6px', borderRadius: '6px', fontSize:'14px' }}>
            🤖
         </div>
         <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#e2e8f0' }}>{data.assetType || 'AI AGENT'}</div>
      </div>
      
      <div style={{ fontSize: '10px', color: '#cbd5e1', marginTop: '4px', zIndex: 2 }}>{data.label}</div>

      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
};
