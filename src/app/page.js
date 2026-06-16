"use client";
import AgentDaeChat from '../components/AgentDaeChat';

export default function Dashboard() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh',
      background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #000000 100%)',
    }}>
      <div style={{ width: '480px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <AgentDaeChat onAction={() => {}} setSharedState={() => {}} />
      </div>
    </div>
  );
}
