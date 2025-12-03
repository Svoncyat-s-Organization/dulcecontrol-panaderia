import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import { getDepartamentos, getProvinciasByDepartamento, getDistritosByProvincia } from '../../api/ubigeo.api';
import { UBIGEO_KEYS } from '../../constants/queryKeys';

/**
 * Componente de selección en cascada de Ubigeo (Departamento -> Provincia -> Distrito)
 * @param {Object} props
 * @param {number} props.value - ID del distrito seleccionado
 * @param {function} props.onChange - Callback cuando cambia la selección
 * @param {boolean} props.disabled - Deshabilitar selector
 */
export default function UbigeoSelector({ value, onChange, disabled = false }) {
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [selectedProvincia, setSelectedProvincia] = useState(null);

  // Consulta departamentos
  const { data: departamentos = [], isLoading: loadingDepartamentos } = useQuery({
    queryKey: UBIGEO_KEYS.departamentos,
    queryFn: getDepartamentos,
  });

  // Consulta provincias cuando se selecciona un departamento
  const { data: provincias = [], isLoading: loadingProvincias } = useQuery({
    queryKey: UBIGEO_KEYS.provincias(selectedDepartamento),
    queryFn: () => getProvinciasByDepartamento(selectedDepartamento),
    enabled: !!selectedDepartamento,
  });

  // Consulta distritos cuando se selecciona una provincia
  const { data: distritos = [], isLoading: loadingDistritos } = useQuery({
    queryKey: UBIGEO_KEYS.distritos(selectedProvincia),
    queryFn: () => getDistritosByProvincia(selectedProvincia),
    enabled: !!selectedProvincia,
  });

  const handleDepartamentoChange = (departamentoId) => {
    setSelectedDepartamento(departamentoId);
    setSelectedProvincia(null);
    onChange(null);
  };

  const handleProvinciaChange = (provinciaId) => {
    setSelectedProvincia(provinciaId);
    onChange(null);
  };

  const handleDistritoChange = (distritoId) => {
    onChange(distritoId);
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Select
        placeholder="Departamento"
        value={selectedDepartamento}
        onChange={handleDepartamentoChange}
        disabled={disabled}
        loading={loadingDepartamentos}
        style={{ flex: 1 }}
        showSearch
        optionFilterProp="label"
        options={departamentos.map((d) => ({
          label: d.nombre,
          value: d.id,
        }))}
      />

      <Select
        placeholder="Provincia"
        value={selectedProvincia}
        onChange={handleProvinciaChange}
        disabled={disabled || !selectedDepartamento}
        loading={loadingProvincias}
        style={{ flex: 1 }}
        showSearch
        optionFilterProp="label"
        options={provincias.map((p) => ({
          label: p.nombre,
          value: p.id,
        }))}
      />

      <Select
        placeholder="Distrito"
        value={value}
        onChange={handleDistritoChange}
        disabled={disabled || !selectedProvincia}
        loading={loadingDistritos}
        style={{ flex: 1 }}
        showSearch
        optionFilterProp="label"
        options={distritos.map((d) => ({
          label: d.nombre,
          value: d.id,
        }))}
      />
    </div>
  );
}
