import React, { useEffect, useMemo, useRef } from 'react';
import { Modal, Form, Input, Checkbox, Row, Col, Select } from 'antd';
import { useQuery } from '@tanstack/react-query';
import {
    getDepartamentos,
    getProvinciasByDepartamento,
    getDistritosByProvincia,
    getDistrito,
    getProvincia,
} from '../../api/ubigeo.api.js';

const TELEFONO_MIN_DIGITS = 9;
const TELEFONO_MAX_DIGITS = 15;
const UBIGEO_QUERY_KEYS = {
    departamentos: ['ubigeo', 'departamentos'],
    provincias: (departamentoId) => ['ubigeo', 'provincias', departamentoId ?? null],
    distritos: (provinciaId) => ['ubigeo', 'distritos', provinciaId ?? null],
    distritoDetail: (distritoId) => ['ubigeo', 'distrito', distritoId ?? null],
    provinciaDetail: (provinciaId) => ['ubigeo', 'provincia', provinciaId ?? null],
};

const telefonoValidator = (_, value) => {
    if (!value) {
        return Promise.resolve();
    }

    const digitsOnly = value.replace(/\D/g, '');
    if (
        digitsOnly.length < TELEFONO_MIN_DIGITS ||
        digitsOnly.length > TELEFONO_MAX_DIGITS ||
        !/^\d+$/.test(digitsOnly)
    ) {
        return Promise.reject(new Error(`Ingresa un teléfono válido (ej. +51 987 678 789, ${TELEFONO_MIN_DIGITS}-${TELEFONO_MAX_DIGITS} dígitos)`));
    }

    return Promise.resolve();
};

const SedeForm = ({ visible, onCancel, onSubmit, initialValues, form, loading }) => {
    const departamentoId = Form.useWatch('departamentoId', form);
    const provinciaId = Form.useWatch('provinciaId', form);
    const distritoId = Form.useWatch('distritoId', form);
    const autoDepartamentoSetRef = useRef(false);
    const autoProvinciaSetRef = useRef(false);

    useEffect(() => {
        autoDepartamentoSetRef.current = false;
        autoProvinciaSetRef.current = false;
    }, [visible, initialValues?.id]);

    const { data: departamentos = [], isLoading: loadingDepartamentos } = useQuery({
        queryKey: UBIGEO_QUERY_KEYS.departamentos,
        queryFn: getDepartamentos,
        staleTime: 1000 * 60 * 60,
    });

    const { data: provincias = [], isLoading: loadingProvincias } = useQuery({
        queryKey: UBIGEO_QUERY_KEYS.provincias(departamentoId),
        queryFn: () => getProvinciasByDepartamento(departamentoId),
        enabled: Boolean(departamentoId),
        staleTime: 1000 * 60 * 30,
    });

    const { data: distritos = [], isLoading: loadingDistritos } = useQuery({
        queryKey: UBIGEO_QUERY_KEYS.distritos(provinciaId),
        queryFn: () => getDistritosByProvincia(provinciaId),
        enabled: Boolean(provinciaId),
        staleTime: 1000 * 60 * 30,
    });

    const shouldFetchDistritoDetail = Boolean(distritoId && (!provinciaId || !departamentoId));
    const { data: distritoDetalle } = useQuery({
        queryKey: UBIGEO_QUERY_KEYS.distritoDetail(distritoId),
        queryFn: () => getDistrito(distritoId),
        enabled: shouldFetchDistritoDetail,
        staleTime: 1000 * 60 * 60,
    });

    const provinciaDetalleId = distritoDetalle?.provinciaId && !departamentoId
        ? distritoDetalle.provinciaId
        : null;
    const { data: provinciaDetalle } = useQuery({
        queryKey: UBIGEO_QUERY_KEYS.provinciaDetail(provinciaDetalleId),
        queryFn: () => getProvincia(provinciaDetalleId),
        enabled: Boolean(provinciaDetalleId),
        staleTime: 1000 * 60 * 60,
    });

    useEffect(() => {
        if (!provinciaDetalle?.departamentoId || departamentoId || autoDepartamentoSetRef.current) {
            return;
        }
        autoDepartamentoSetRef.current = true;
        form.setFieldsValue({ departamentoId: provinciaDetalle.departamentoId });
    }, [provinciaDetalle, departamentoId, form]);

    useEffect(() => {
        if (!distritoDetalle?.provinciaId || provinciaId || !provincias.length || autoProvinciaSetRef.current) {
            return;
        }
        const existsInCurrentList = provincias.some(
            (provincia) => String(provincia.id) === String(distritoDetalle.provinciaId),
        );
        if (!existsInCurrentList) {
            return;
        }
        autoProvinciaSetRef.current = true;
        form.setFieldsValue({ provinciaId: distritoDetalle.provinciaId });
    }, [distritoDetalle, provincias, provinciaId, form]);

    const departamentoOptions = useMemo(() => (
        departamentos.map((departamento) => ({ label: departamento.nombre, value: departamento.id }))
    ), [departamentos]);

    const provinciaOptions = useMemo(() => (
        provincias.map((provincia) => ({ label: provincia.nombre, value: provincia.id }))
    ), [provincias]);

    const distritoOptions = useMemo(() => (
        distritos.map((distrito) => ({ label: distrito.nombre, value: distrito.id }))
    ), [distritos]);

    const handleDepartamentoChange = (value) => {
        form.setFieldsValue({
            departamentoId: value ?? undefined,
            provinciaId: undefined,
            distritoId: undefined,
        });
    };

    const handleProvinciaChange = (value) => {
        form.setFieldsValue({
            provinciaId: value ?? undefined,
            distritoId: undefined,
        });
    };

    const handleDistritoChange = (value) => {
        form.setFieldsValue({ distritoId: value ?? undefined });
    };

    return (
        <Modal
            title={initialValues ? 'Editar sede' : 'Registrar sede'}
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={640}
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="nombre"
                            label="Nombre de la sede"
                            rules={[
                                { required: true, message: 'Ingresa el nombre de la sede' },
                                { max: 100, message: 'Máximo 100 caracteres' },
                            ]}
                        >
                            <Input placeholder="Ej. Sede central" autoComplete="off" maxLength={100} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="codigoInterno"
                            label="Código interno"
                            rules={[{ max: 50, message: 'Máximo 50 caracteres' }]}
                        >
                            <Input placeholder="Ej. SED-001" autoComplete="off" maxLength={50} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="direccion"
                    label="Dirección"
                    rules={[
                        { required: true, message: 'Ingresa la dirección' },
                        { max: 500, message: 'Máximo 500 caracteres' },
                    ]}
                >
                    <Input.TextArea rows={2} autoComplete="off" maxLength={500} showCount />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="departamentoId" label="Departamento">
                            <Select
                                allowClear
                                placeholder="Selecciona el departamento"
                                showSearch
                                optionFilterProp="label"
                                options={departamentoOptions}
                                onChange={handleDepartamentoChange}
                                loading={loadingDepartamentos}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="provinciaId" label="Provincia">
                            <Select
                                allowClear
                                placeholder="Selecciona la provincia"
                                showSearch
                                optionFilterProp="label"
                                options={provinciaOptions}
                                onChange={handleProvinciaChange}
                                disabled={!departamentoId}
                                loading={loadingProvincias}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="distritoId" label="Distrito">
                            <Select
                                allowClear
                                placeholder="Selecciona el distrito"
                                showSearch
                                optionFilterProp="label"
                                options={distritoOptions}
                                onChange={handleDistritoChange}
                                disabled={!provinciaId}
                                loading={loadingDistritos}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="telefono"
                            label="Teléfono de contacto"
                            rules={[
                                { max: 50, message: 'Máximo 50 caracteres' },
                                { validator: telefonoValidator },
                            ]}
                        >
                            <Input autoComplete="off" maxLength={50} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="esPrincipal" valuePropName="checked">
                    <Checkbox>Es sede principal</Checkbox>
                </Form.Item>

                {initialValues && (
                    <Form.Item name="activo" valuePropName="checked">
                        <Checkbox>Sede activa</Checkbox>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default SedeForm;
