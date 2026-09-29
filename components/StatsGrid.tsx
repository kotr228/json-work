export interface StatItem {
  label: string;
  value: string | number;
}

export function StatsGrid({ items }: { items: StatItem[] }) {
  return (
    <div className="stats-grid">
      {items.map((item) => (
        <div key={item.label} className="stat-item">
          <div className="stat-value">{item.value}</div>
          <div className="stat-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
