const AdminStatCard = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>{title}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>{value}</div>
        {trend && (
          <div style={{ 
            color: trendUp ? 'var(--success)' : 'var(--danger)', 
            fontSize: '0.8rem', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginTop: '0.25rem'
           }}>
            {trendUp ? '↗' : '↘'} {trend}
          </div>
        )}
      </div>
      {icon && (
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'var(--primary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default AdminStatCard;