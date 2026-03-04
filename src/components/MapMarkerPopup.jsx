const typeColors = {
  capital: '#ff0040',
  nuclear: '#ff6600',
  military: '#ff6600',
  naval: '#00aaff',
  airbase: '#ff6600',
  oil: '#ffcc00',
  strategic: '#ffcc00',
  strike: '#ff0040',
  diplomatic: '#00ff41',
};

const typeLabels = {
  capital: 'CAPITAL',
  nuclear: 'NUCLEAR',
  military: 'MILITARY',
  naval: 'NAVAL',
  airbase: 'AIR BASE',
  oil: 'OIL/ENERGY',
  strategic: 'STRATEGIC',
  strike: 'STRIKE ZONE',
  diplomatic: 'DIPLOMATIC',
};

const statusColors = {
  'high-alert': '#ff0040',
  active: '#ff6600',
  monitoring: '#00ff41',
};

const statusLabels = {
  'high-alert': 'HIGH ALERT',
  active: 'ACTIVE',
  monitoring: 'MONITORING',
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

export default function MapMarkerPopup({ zone, articles = [] }) {
  const typeColor = typeColors[zone.type] || '#c9d1d9';
  const statusColor = statusColors[zone.status] || '#6e7681';

  return (
    <div style={{ minWidth: 320, maxWidth: 440 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontWeight: 'bold', fontSize: 18, color: typeColor }}>
          {zone.name}
        </span>
        <span
          style={{
            fontSize: 11,
            padding: '3px 7px',
            borderRadius: 3,
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            background: `${typeColor}22`,
            color: typeColor,
          }}
        >
          {typeLabels[zone.type] || zone.type.toUpperCase()}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: 14, color: '#c9d1d9', marginBottom: 10, lineHeight: 1.5 }}>
        {zone.description}
      </p>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: articles.length ? 10 : 0 }}>
        <span
          style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, display: 'inline-block' }}
        />
        <span style={{ fontSize: 12, fontWeight: 'bold', letterSpacing: '0.05em', color: statusColor }}>
          {statusLabels[zone.status] || zone.status.toUpperCase()}
        </span>
      </div>

      {/* Related news */}
      {articles.length > 0 && (
        <div style={{ borderTop: '1px solid #1b3a2a', paddingTop: 8 }}>
          <div style={{ fontSize: 11, color: '#00ff41', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: 8 }}>
            LATEST NEWS
          </div>
          {articles.map((article, i) => (
            <a
              key={i}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                fontSize: 13,
                color: '#c9d1d9',
                textDecoration: 'none',
                padding: '4px 0',
                borderBottom: i < articles.length - 1 ? '1px solid #1b3a2a33' : 'none',
                lineHeight: 1.4,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ff6600'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#c9d1d9'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    padding: '2px 5px',
                    borderRadius: 3,
                    background: `${article.sourceColor || '#6e7681'}22`,
                    color: article.sourceColor || '#6e7681',
                  }}
                >
                  {article.source}
                </span>
                <span style={{ fontSize: 10, color: '#6e7681' }}>
                  {timeAgo(article.pubDate)}
                </span>
              </div>
              <span>{article.title}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
