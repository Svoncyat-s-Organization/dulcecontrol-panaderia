import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { message } from 'antd';
import LoginCard from './index.jsx';
import { useTokenStore } from '../../../../shared/store/tokenStore.js';
import { postAdminLogin } from '../../api/auth.api.js';

const mockNavigate = vi.fn();
let mockFormValues = { email: '', password: '' };

vi.mock('../../api/auth.api.js', () => ({
  postAdminLogin: vi.fn(),
}));

vi.mock('./LoginCardView.jsx', () => ({
  default: ({ onSubmit, loading, errorMessage }) => (
    <button
      type="button"
      data-error={errorMessage ?? ''}
      disabled={loading}
      onClick={() => onSubmit(mockFormValues)}
    >
      Ingresar
    </button>
  ),
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

describe('LoginCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    mockNavigate.mockReset();
    resetStore();
    successSpy = vi.spyOn(message, 'success').mockImplementation(() => {});
    errorSpy = vi.spyOn(message, 'error').mockImplementation(() => {});
  });

  it('stores token data and redirects after a successful login', async () => {
    postAdminLogin.mockResolvedValue({
      token: 'fake-token',
      userType: 'ADMIN',
      tiendaId: 10,
      expiresIn: 3600,
    });

    mockFormValues = {
      email: 'admin@dulcecontrol.pe',
      password: 'clave123',
    };

    renderLoginCard();
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

    await waitFor(() => {
      expect(postAdminLogin).toHaveBeenCalled();
    });

    const [payload] = postAdminLogin.mock.calls.at(-1);
    expect(payload).toEqual({
      email: 'admin@dulcecontrol.pe',
      password: 'clave123',
    });

    await waitFor(() => {
      expect(useTokenStore.getState().token).toBe('fake-token');
    });

    expect(successSpy).toHaveBeenCalledWith('Sesión iniciada correctamente');
    expect(mockNavigate).toHaveBeenCalledWith('/panel', { replace: true });
  });

  it('surface backend errors through the UI message helper', async () => {
    postAdminLogin.mockRejectedValue({
      response: { data: { message: 'Credenciales inválidas' } },
    });

    mockFormValues = {
      email: 'admin@dulcecontrol.pe',
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
    postAdminLogin.mockResolvedValue({ message: 'Credenciales inválidas' });

    mockFormValues = {
      email: 'admin@dulcecontrol.pe',
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
});
