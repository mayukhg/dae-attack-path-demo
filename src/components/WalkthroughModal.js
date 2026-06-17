import { useState } from 'react';

const steps = [
  {
    title: 'Welcome to Agent Iris',
    subtitle: 'Your autonomous security co-pilot',
    content: (
      <div>
        <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '16px' }}>
          Agent Iris is a multi-agent autonomous security platform that discovers, proves, and
          remediates attack paths — without manual intervention.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { color: '#3b82f6', icon: '🗺️', label: 'Mapping Agent', desc: 'Topology & inventory' },
            { color: '#a855f7', icon: '⚡', label: 'Attack Path Validation Agent', desc: 'Lateral movement proof' },
            { color: '#fb923c', icon: '🛡️', label: 'Remediation Agent', desc: 'Choke point fixes' },
            { color: '#14b8a6', icon: '📋', label: 'Reporting Agent', desc: 'Executive summaries' },
          ].map(a => (
            <div key={a.label} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${a.color}30`, borderRadius: '8px', padding: '10px' }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>{a.icon}</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: a.color }}>{a.label}</div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Attack Path Discovery & Validation',
    subtitle: 'Live backend · TruConfirm proof · ranked mitigations · bypass test',
    content: (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
          {[
            { icon: '🔍', step: 'Topology Scan', desc: 'Mapping Agent builds your full asset graph via backend API' },
            { icon: '🎯', step: 'Path Selection', desc: 'You choose from 3 ranked attack chains (3–4 hops, PCS scored)' },
            { icon: '⚡', step: 'Path Traversal', desc: 'Attack Path Validation Agent traverses with real MITRE techniques' },
            { icon: '🔬', step: 'TruConfirm Validation', desc: 'Empirical proof per node — SHA-256 hash, OAST callback, pattern output' },
            { icon: '⚖️', step: 'Ranked Mitigations', desc: 'Multiple options with deploy time, downtime, paths closed, approval gate' },
            { icon: '🔄', step: 'Bypass Test', desc: 'Attacker retries alternate traversal after fix — blocked' },
            { icon: '📄', step: 'Executive Report', desc: 'Backend-generated with headline, business impact & rollback plan' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0' }}>{s.icon} {s.step}</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', padding: '10px' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Outputs</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['Cryptographic Exploit Proof', 'Blast Radius', 'MITRE Technique Chain', 'Terraform Policy-as-Code', 'Audit Trail'].map(t => (
              <span key={t} style={{ fontSize: '10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '4px', padding: '2px 8px', color: '#93c5fd' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'AI Agent Posture Validation',
    subtitle: 'Treat your AI supply chain as a first-class attack surface',
    content: (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
          {[
            { icon: '🤖', step: 'AI Inventory Mapped', desc: 'Dynamic scan of AI agents and their data bindings' },
            { icon: '🌐', step: 'Exposure Flagged', desc: 'Internet-exposed agent with PII bindings detected' },
            { icon: '💉', step: 'Prompt Injection Simulated', desc: 'External attacker attempts to manipulate AI output' },
            { icon: '🔀', step: 'Auto PR Generated', desc: 'Architectural fix compiled and sent to dev repo' },
            { icon: '✅', step: 'Supply Chain Secured', desc: 'PR merged, egress perimeter locked, PCS neutralized' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0' }}>{s.icon} {s.step}</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', padding: '10px' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Outputs</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['AI Inventory Map', 'Prompt Injection Proof', 'Auto GitHub PR', 'Zero-friction Dev Handoff'].map(t => (
              <span key={t} style={{ fontSize: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '4px', padding: '2px 8px', color: '#6ee7b7' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Key Concepts',
    subtitle: 'Understand the building blocks before you begin',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          {
            term: 'PCS — Path Criticality Score',
            color: '#ef4444',
            desc: 'A 0–10 composite risk score factoring exploitability, privilege gain, control weakness, and confidence. A score of 10.0 means a fully validated, high-impact path.',
          },
          {
            term: 'TruConfirm',
            color: '#3b82f6',
            desc: 'Empirical exploit validation engine. Proves exploitability with cryptographic evidence — SHA-256 hash matching, out-of-band OAST DNS callbacks, or pattern-matched output extraction.',
          },
          {
            term: 'Choke Point',
            color: '#10b981',
            desc: 'A single node in the attack graph whose remediation simultaneously closes multiple downstream paths, maximising security ROI with minimum blast to operations.',
          },
          {
            term: 'Audit Trail',
            color: '#14b8a6',
            desc: 'A time-series compliance ledger of every agent action — delegations, validations, mitigations — available for replay during incident response or compliance review.',
          },
        ].map(c => (
          <div key={c.term} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${c.color}25`, borderRadius: '8px', padding: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: c.color, marginBottom: '4px' }}>{c.term}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.5' }}>{c.desc}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "You're Ready",
    subtitle: 'Agent Iris will handle the rest autonomously',
    content: (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
        <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '20px' }}>
          Select an agentic workflow to begin. Each workflow is self-contained
          and guided — Agent Iris will narrate every action it takes in real time.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          {[
            { label: 'Attack Path Discovery & Validation', color: '#3b82f6', desc: '3 attack chains · TruConfirm proof · ranked mitigations · bypass test' },
            { label: 'AI Agent Posture Validation', color: '#10b981', desc: 'AI supply chain · prompt injection · auto PR' },
          ].map(p => (
            <div key={p.label} style={{ background: `${p.color}10`, border: `1px solid ${p.color}30`, borderRadius: '8px', padding: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: p.color }}>{p.label}</div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function WalkthroughModal({ onClose }) {
  const [current, setCurrent] = useState(0);
  const isLast = current === steps.length - 1;
  const step = steps[current];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        width: '100%', maxWidth: '460px', maxHeight: '90vh',
        background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px', display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 0 20px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            {steps.map((_, i) => (
              <div key={i} style={{
                height: '3px', flex: 1, borderRadius: '2px',
                background: i <= current ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                Step {current + 1} of {steps.length}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{step.title}</h3>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0' }}>{step.subtitle}</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '4px', flexShrink: 0 }}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {step.content}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px', flexShrink: 0 }}>
          {current > 0 && (
            <button
              onClick={() => setCurrent(c => c - 1)}
              style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={isLast ? onClose : () => setCurrent(c => c + 1)}
            style={{ flex: 2, padding: '10px', background: isLast ? '#10b981' : '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            {isLast ? 'Begin →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
