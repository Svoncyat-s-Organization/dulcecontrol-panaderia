import { Empty, Skeleton, Space, Tag, Typography, theme } from 'antd';

const buildTileStyle = (token, selected, disabled) => ({
  border: `1px solid ${selected ? token.colorPrimary : token.colorBorder}`,
  backgroundColor: selected ? token.colorPrimaryBg : token.colorBgContainer,
  borderRadius: 12,
  padding: 16,
  cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  minHeight: 90,
  boxShadow: selected ? `0 0 0 1px ${token.colorPrimary}` : 'none',
  opacity: disabled && !selected ? 0.6 : 1,
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
  outline: 'none',
});

const buildGridStyle = () => ({
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  width: '100%',
});

const SedeCardSelector = ({ value, onChange, options = [], loading = false, disabled = false }) => {
  const { token } = theme.useToken();
  const selectedValues = Array.isArray(value) ? value : [];

  const toggleSelection = (sedeId) => {
    const alreadySelected = selectedValues.includes(sedeId);
    if (alreadySelected) {
      return selectedValues.filter((current) => current !== sedeId);
    }
    return [...selectedValues, sedeId];
  };

  const handleSelect = (sedeId) => {
    if (disabled) {
      return;
    }
    onChange?.(toggleSelection(sedeId));
  };

  const handleKeyDown = (event, sedeId) => {
    if (disabled) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onChange?.(toggleSelection(sedeId));
    }
  };

  if (loading) {
    return (
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Skeleton.Button active style={{ height: 88 }} />
        <Skeleton.Button active style={{ height: 88 }} />
      </Space>
    );
  }

  if (!options.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No hay sedes disponibles" />;
  }

  return (
    <div role="listbox" aria-multiselectable="true" style={buildGridStyle()}>
      {options.map((sede) => {
        const selected = selectedValues.includes(sede.id);
        const isPrincipal = selected && selectedValues[0] === sede.id;
        return (
          <div
            key={sede.id}
            role="option"
            aria-selected={selected}
            tabIndex={disabled ? -1 : 0}
            onClick={() => handleSelect(sede.id)}
            onKeyDown={(event) => handleKeyDown(event, sede.id)}
            style={buildTileStyle(token, selected, disabled)}
            data-selected={selected}
          >
            <Typography.Text strong>{sede.nombre}</Typography.Text>
            {sede.direccion && (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {sede.direccion}
              </Typography.Text>
            )}
            {selected ? (
              <Tag color={token.colorPrimary} style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                {isPrincipal ? 'Principal' : 'Asignada'}
              </Tag>
            ) : null}
            {!selected && sede.esPrincipal ? (
              <Tag color="blue" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                Actual principal
              </Tag>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default SedeCardSelector;
