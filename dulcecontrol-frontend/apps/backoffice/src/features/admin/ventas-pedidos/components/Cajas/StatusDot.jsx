const StatusDot = ({ color, label }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span
            style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: color,
                display: 'inline-block',
            }}
        />
        <span style={{ fontWeight: 500 }}>{label}</span>
    </span>
);

export default StatusDot;
