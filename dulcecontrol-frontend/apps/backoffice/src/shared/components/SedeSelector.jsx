import { useState } from 'react';
import { Select } from 'antd';

const fallbackOptions = [
  { label: 'Sede Central', value: 'central' },
  { label: 'Miraflores', value: 'miraflores' },
  { label: 'Barranco', value: 'barranco' },
];

const selectStyle = {
  minWidth: 200,
  borderRadius: 12,
};

const SedeSelector = ({ options = fallbackOptions, value, onChange, ...selectProps }) => {
  const [internalValue, setInternalValue] = useState(() => options[0]?.value);
  const isControlled = value !== undefined;
  const mergedValue = isControlled ? value : internalValue;

  const handleChange = (nextValue) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  return (
    <Select
      value={mergedValue}
      onChange={handleChange}
      options={options}
      placeholder="Selecciona una sede"
      style={selectStyle}
      popupMatchSelectWidth={false}
      variant="filled"
      {...selectProps}
    />
  );
};

export default SedeSelector;
