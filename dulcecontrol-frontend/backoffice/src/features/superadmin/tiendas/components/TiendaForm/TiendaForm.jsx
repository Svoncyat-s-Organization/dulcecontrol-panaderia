import React, { useEffect, useMemo, useRef } from 'react';
import { Modal, Form, Input, Select, Row, Col } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { TIENDA_ESTADO_OPTIONS } from '../../constants/tiendaOptions';
import { getDepartamentos, getProvinciasByDepartamento, getDistritosByProvincia } from '../../api/ubigeo.api.js';

const TELEFONO_MIN_DIGITS = 9;
const TELEFONO_MAX_DIGITS = 15;
const UBIGEO_LENGTH = 6;
const UBIGEO_QUERY_KEYS = {
    departamentos: ['ubigeo', 'departamentos'],
    provincias: (departamentoId) => ['ubigeo', 'provincias', departamentoId ?? null],
    distritos: (provinciaId) => ['ubigeo', 'distritos', provinciaId ?? null],
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
        return Promise.reject(new Error(`Ingresa un teléfono válido (ej. +51 987 678 456, ${TELEFONO_MIN_DIGITS}-${TELEFONO_MAX_DIGITS} dígitos)`));
    }

    return Promise.resolve();
};

const ubigeoValidator = (_, value) => {
    if (!value) {
        return Promise.reject(new Error('Selecciona el distrito fiscal (6 dígitos)'));
    }

    const sanitized = value.trim();
    if (!/^\d+$/.test(sanitized) || sanitized.length !== UBIGEO_LENGTH) {
        return Promise.reject(new Error('El ubigeo debe tener exactamente 6 dígitos numéricos'));
    }

    return Promise.resolve();
};

const TiendaForm = ({ visible, onCancel, onSubmit, initialValues, form, loading }) => {
    const departamentoId = Form.useWatch('departamentoId', form);
    const provinciaId = Form.useWatch('provinciaId', form);
    const distritoId = Form.useWatch('distritoId', form);
    const initialUbigeoCode = initialValues?.ubigeoFiscal?.trim();
    const isValidInitialUbigeo = Boolean(initialUbigeoCode && /^\d{6}$/.test(initialUbigeoCode));
    const userModifiedUbigeoRef = useRef(false);

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

    useEffect(() => {
        userModifiedUbigeoRef.current = false;
    }, [visible, initialValues?.id]);

    useEffect(() => {
        if (userModifiedUbigeoRef.current || !isValidInitialUbigeo || departamentoId) {
            return;
        }
        if (!departamentos.length) {
            return;
        }
        const departamentoCode = initialUbigeoCode.slice(0, 2);
        const match = departamentos.find((dep) => dep.codigoUbigeo === departamentoCode);
        if (match) {
            form.setFieldsValue({ departamentoId: match.id });
        }
    }, [departamentos, departamentoId, form, initialUbigeoCode, isValidInitialUbigeo]);

    useEffect(() => {
        if (userModifiedUbigeoRef.current || !isValidInitialUbigeo || provinciaId || !departamentoId) {
            return;
        }
        const selectedDepartamento = departamentos.find((dep) => String(dep.id) === String(departamentoId));
        if (!selectedDepartamento || selectedDepartamento.codigoUbigeo !== initialUbigeoCode.slice(0, 2)) {
            return;
        }
        if (!provincias.length) {
            return;
        }
        const provinciaCode = initialUbigeoCode.slice(0, 4);
        const match = provincias.find((prov) => prov.codigoUbigeo === provinciaCode);
        if (match) {
            form.setFieldsValue({ provinciaId: match.id });
        }
    }, [departamentoId, departamentos, form, initialUbigeoCode, isValidInitialUbigeo, provinciaId, provincias]);

    useEffect(() => {
        if (userModifiedUbigeoRef.current || !isValidInitialUbigeo || distritoId || !provinciaId) {
            return;
        }
        const selectedProvincia = provincias.find((prov) => String(prov.id) === String(provinciaId));
        if (!selectedProvincia || selectedProvincia.codigoUbigeo !== initialUbigeoCode.slice(0, 4)) {
            return;
        }
        if (!distritos.length) {
            return;
        }
        const match = distritos.find((dist) => dist.codigoUbigeo === initialUbigeoCode);
        if (match) {
            form.setFieldsValue({ distritoId: match.id, ubigeoFiscal: match.codigoUbigeo });
        }
    }, [distritoId, distritos, form, initialUbigeoCode, isValidInitialUbigeo, provinciaId, provincias]);

    useEffect(() => {
        if (!distritoId) {
            return;
        }
        const selectedDistrito = distritos.find((dist) => String(dist.id) === String(distritoId));
        if (selectedDistrito) {
            form.setFieldsValue({ ubigeoFiscal: selectedDistrito.codigoUbigeo });
        }
    }, [distritoId, distritos, form]);

    const departamentoOptions = useMemo(() => (
        departamentos.map((dep) => ({ label: dep.nombre, value: dep.id }))
    ), [departamentos]);

    const provinciaOptions = useMemo(() => (
        provincias.map((prov) => ({ label: prov.nombre, value: prov.id }))
    ), [provincias]);

    const distritoOptions = useMemo(() => (
        distritos.map((dist) => ({ label: dist.nombre, value: dist.id }))
    ), [distritos]);

    const handleDepartamentoChange = (value) => {
        userModifiedUbigeoRef.current = true;
        form.setFieldsValue({
            departamentoId: value ?? undefined,
            provinciaId: undefined,
            distritoId: undefined,
            ubigeoFiscal: undefined,
        });
    };

    const handleProvinciaChange = (value) => {
        userModifiedUbigeoRef.current = true;
        form.setFieldsValue({
            provinciaId: value ?? undefined,
            distritoId: undefined,
            ubigeoFiscal: undefined,
        });
    };

    const handleDistritoChange = (value) => {
        userModifiedUbigeoRef.current = true;
        const selectedDistrito = distritos.find((dist) => String(dist.id) === String(value));
        form.setFieldsValue({
            distritoId: value ?? undefined,
            ubigeoFiscal: selectedDistrito?.codigoUbigeo,
        });
    };

    const renderSelectOptions = (options) =>
        options.map((option) => (
            <Select.Option key={option.value} value={option.value}>
                {option.label}
            </Select.Option>
        ));

    return (
        <Modal
            title={initialValues ? 'Editar tienda' : 'Registrar tienda'}
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={800}
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="nombreComercial"
                            label="Nombre comercial"
                            rules={[
                                { required: true, message: 'Ingresa el nombre comercial' },
                                { max: 255, message: 'Máximo 255 caracteres' },
                            ]}
                        >
                            <Input placeholder="Ej. Panadería Dulce Sabor" autoComplete="off" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="numeroDoc"
                            label="RUC"
                            rules={[
                                { required: true, message: 'Ingresa el RUC' },
                                { pattern: /^\d{11}$/, message: 'El RUC debe tener 11 dígitos numéricos' },
                            ]}
                        >
                            <Input placeholder="20123456789" autoComplete="off" maxLength={11} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="nombreDoc"
                            label="Razón social"
                            rules={[
                                { required: true, message: 'Ingresa la razón social' },
                                { max: 255, message: 'Máximo 255 caracteres' },
                            ]}
                        >
                            <Input placeholder="Inversiones Dulce Manjar S.A.C." autoComplete="off" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="correoContacto"
                            label="Correo de contacto"
                            rules={[
                                { required: true, message: 'Ingresa el correo de contacto' },
                                { type: 'email', message: 'El correo ingresado no es válido' },
                                { max: 255, message: 'Máximo 255 caracteres' },
                            ]}
                        >
                            <Input autoComplete="off" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="telefonoContacto"
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

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="direccionFiscal"
                            label="Dirección fiscal"
                            rules={[
                                { required: true, message: 'Ingresa la dirección fiscal' },
                                { max: 500, message: 'Máximo 500 caracteres' },
                            ]}
                        >
                            <Input.TextArea rows={3} showCount maxLength={500} autoComplete="off" placeholder="Av. Principal 123, Lima" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="departamentoId"
                            label="Departamento fiscal"
                            rules={[{ required: true, message: 'Selecciona el departamento' }]}
                        >
                            <Select
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
                        <Form.Item
                            name="provinciaId"
                            label="Provincia fiscal"
                            rules={[{ required: true, message: 'Selecciona la provincia' }]}
                        >
                            <Select
                                placeholder="Selecciona la provincia"
                                disabled={!departamentoId}
                                showSearch
                                optionFilterProp="label"
                                options={provinciaOptions}
                                onChange={handleProvinciaChange}
                                loading={loadingProvincias}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="distritoId"
                            label="Distrito fiscal"
                            rules={[{ required: true, message: 'Selecciona el distrito' }]}
                        >
                            <Select
                                placeholder="Selecciona el distrito"
                                disabled={!provinciaId}
                                showSearch
                                optionFilterProp="label"
                                options={distritoOptions}
                                onChange={handleDistritoChange}
                                loading={loadingDistritos}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="ubigeoFiscal"
                            label="Código de ubigeo"
                            rules={[{ validator: ubigeoValidator }]}
                        >
                            <Input autoComplete="off" maxLength={UBIGEO_LENGTH} placeholder="Selecciona un distrito" readOnly />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="estado"
                    label="Estado"
                    rules={[{ required: true, message: 'Selecciona el estado' }]}
                >
                    <Select placeholder="Selecciona el estado">{renderSelectOptions(TIENDA_ESTADO_OPTIONS)}</Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TiendaForm;
