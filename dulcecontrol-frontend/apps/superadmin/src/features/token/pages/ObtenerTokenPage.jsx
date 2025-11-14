import {useToken} from '../hooks/useToken';
import {TokenFormCard} from '../components/TokenFormCard';
import styles from './ObtenerTokenPage.module.css';

const ObtenerTokenPage = () => {
    const {
        control,
        generatedToken,
        isTokenVisible,
        isLoading,
        error,
        onSubmit,
        handleClearForm,
        toggleTokenVisibility,
        handleCopyToken,
    } = useToken();


    return (
        <div className={styles.container}>
            <TokenFormCard
            control={control}
            onSubmit={onSubmit}
            handleClearForm={handleClearForm}
            isLoading={isLoading}
            generatedToken={generatedToken}
            isTokenVisible={isTokenVisible}
            toggleTokenVisibility={toggleTokenVisibility}
            handleCopyToken={handleCopyToken}
            error={error}
        />
        </div>
    );
};

export default ObtenerTokenPage;