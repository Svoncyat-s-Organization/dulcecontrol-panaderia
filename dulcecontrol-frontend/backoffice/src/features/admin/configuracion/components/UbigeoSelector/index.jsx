import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import { getDepartamentos, getProvinciasByDepartamento, getDistritosByProvincia, getDistrito, getProvincia } from '../../api/ubigeo.api';
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

  // 1. Obtener distrito inicial para saber su provincia
  const { data: distritoInicial } = useQuery({
    queryKey: UBIGEO_KEYS.distrito ? UBIGEO_KEYS.distrito(value) : ['ubigeo', 'distrito', value],
    queryFn: () => getDistrito(value),
    enabled: !!value && !selectedProvincia,
    retry: false, // Don't retry if not found
  });

  // 2. Si el distrito no tiene departamentoId (solo tiene provinciaId), necesitamos buscar la provincia
  // para obtener el departamentoId.
  const provinciaIdToFetch = distritoInicial?.provinciaId &&
    !distritoInicial?.departamentoId &&
    !distritoInicial?.provincia?.departamentoId
    ? distritoInicial.provinciaId
    : null;

  const { data: provinciaInicial } = useQuery({
    queryKey: UBIGEO_KEYS.provincia ? UBIGEO_KEYS.provincia(provinciaIdToFetch) : ['ubigeo', 'provincia', provinciaIdToFetch],
    queryFn: () => getProvincia(provinciaIdToFetch),
    enabled: !!provinciaIdToFetch,
  });

  // Lógica principal de inicialización
  useEffect(() => {
    if (!value) return;

    // Caso A: El API de distrito ya nos da todo (Ej. anidado o flat completo)
    if (distritoInicial) {
      const depId = distritoInicial.departamentoId || distritoInicial.provincia?.departamentoId;
      const provId = distritoInicial.provinciaId;

      if (depId && provId) {
        setSelectedDepartamento(depId);
        setSelectedProvincia(provId);
        return;
      }
    }

    // Caso B: Necesitamos la provincia para saber el departamento
    if (provinciaInicial && distritoInicial) {
      if (provinciaInicial.departamentoId) {
        setSelectedDepartamento(provinciaInicial.departamentoId);
        setSelectedProvincia(distritoInicial.provinciaId);
      }
    }

  }, [distritoInicial, provinciaInicial, value]);

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
