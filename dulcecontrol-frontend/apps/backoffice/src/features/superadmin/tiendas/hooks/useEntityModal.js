import { useState, useCallback } from 'react';

const useEntityModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [entity, setEntity] = useState(null);

    const openForCreate = useCallback(() => {
        setEntity(null);
        setIsOpen(true);
    }, []);

    const openForEdit = useCallback((record) => {
        setEntity(record);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setEntity(null);
    }, []);

    return {
        isOpen,
        entity,
        openForCreate,
        openForEdit,
        close,
    };
};

export default useEntityModal;
