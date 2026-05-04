const StatCard = ({ icon, title, value, colorHex }) => {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: '16px',
      padding: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: `${colorHex}15`, // append 15 for opacity
        color: colorHex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
      <div>
        <h2 style={{ marginBottom: '0.1rem', fontSize: '1.5rem' }}>{value}</h2>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{title}</div>
      </div>
    </div>
  );
};

export default StatCard;