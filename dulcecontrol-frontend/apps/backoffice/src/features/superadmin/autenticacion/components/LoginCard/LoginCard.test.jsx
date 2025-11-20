import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { message } from 'antd';
import LoginCard from './index.jsx';
import { useTokenStore } from '../../../../../shared/store/tokenStore.js';
import { postSuperadminLogin } from '../../api/auth.api.js';

const mockNavigate = vi.fn();
let mockFormValues = { email: '', password: '' };
const featureFlagsMock = { devLoginEnabled: false };

vi.mock('../../api/auth.api.js', () => ({
    postSuperadminLogin: vi.fn(),
}));

vi.mock('./LoginCardView.jsx', () => ({
    default: ({ onSubmit, loading, errorMessage, devLoginEnabled, onDevLogin }) => (
        <>
            <button
                type="button"
                data-error={errorMessage ?? ''}
                disabled={loading}
                onClick={() => onSubmit(mockFormValues)}
            >
                Ingresar
            </button>
            {devLoginEnabled && (
                <button type="button" onClick={onDevLogin}>
                    Dev Login
                </button>
            )}
        </>
    ),
}));

vi.mock('../../../../../config/featureFlags.js', () => ({
    featureFlags: featureFlagsMock,
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderLoginCard = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <LoginCard redirectPath="/panel" />
            </MemoryRouter>
        </QueryClientProvider>
    );
};

const resetStore = () => {
    useTokenStore.setState({
        token: null,
        userType: null,
        tiendaId: null,
        expiresAt: null,
        isAuthenticated: false,
    });
};

let successSpy;
let errorSpy;
let infoSpy;

describe('LoginCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        sessionStorage.clear();
        mockNavigate.mockReset();
        resetStore();
        successSpy = vi.spyOn(message, 'success').mockImplementation(() => {});
        errorSpy = vi.spyOn(message, 'error').mockImplementation(() => {});
        infoSpy = vi.spyOn(message, 'info').mockImplementation(() => {});
        featureFlagsMock.devLoginEnabled = false;
    });

    it('stores token data and redirects after a successful login', async () => {
        postSuperadminLogin.mockResolvedValue({
            token: 'fake-token',
            userType: 'SUPERADMIN',
            tiendaId: null,
            expiresIn: 3600,
        });

        mockFormValues = {
            email: 'root@dulcecontrol.com',
            password: 'verysecure',
        };

        renderLoginCard();
        fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

        await waitFor(() => {
            expect(postSuperadminLogin).toHaveBeenCalled();
        });

        const [payload] = postSuperadminLogin.mock.calls.at(-1);
        expect(payload).toEqual({
            email: 'root@dulcecontrol.com',
            password: 'verysecure',
        });

        await waitFor(() => {
            expect(useTokenStore.getState().token).toBe('fake-token');
        });

        expect(successSpy).toHaveBeenCalledWith('Sesión iniciada correctamente');
        expect(mockNavigate).toHaveBeenCalledWith('/panel', { replace: true });
    });

    it('surface backend errors through the UI message helper', async () => {
        postSuperadminLogin.mockRejectedValue({
            response: { data: { message: 'Credenciales inválidas' } },
        });

        mockFormValues = {
            email: 'root@dulcecontrol.com',
            password: 'badpass',
        };

        renderLoginCard();
        fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

        await waitFor(() => {
            expect(errorSpy).toHaveBeenCalledWith('Credenciales inválidas');
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Ingresar/i }).dataset.error).toBe(
                'Credenciales inválidas'
            );
        });

        expect(useTokenStore.getState().token).toBeNull();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('treats responses without token as errors', async () => {
        postSuperadminLogin.mockResolvedValue({ message: 'Credenciales inválidas' });

        mockFormValues = {
            email: 'root@dulcecontrol.com',
            password: 'badpass',
        };

        renderLoginCard();
        fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

        await waitFor(() => {
            expect(errorSpy).toHaveBeenCalledWith('Credenciales inválidas');
        });

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Ingresar/i }).dataset.error).toBe(
                'Credenciales inválidas'
            );
        });

        expect(useTokenStore.getState().token).toBeNull();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('permite el acceso directo al panel corporativo cuando el modo dev está activo', async () => {
        featureFlagsMock.devLoginEnabled = true;

        renderLoginCard();
        const devButton = screen.getByRole('button', { name: /Dev Login/i });
        fireEvent.click(devButton);

        await waitFor(() => {
            expect(useTokenStore.getState().token).toBe('dev-superadmin-token');
        });

        expect(infoSpy).toHaveBeenCalledWith('Modo desarrollador activado. Token temporal generado.');
        expect(mockNavigate).toHaveBeenCalledWith('/panel', { replace: true });
        expect(postSuperadminLogin).not.toHaveBeenCalled();
    });
});
