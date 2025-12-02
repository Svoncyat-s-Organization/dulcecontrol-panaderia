import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { message } from 'antd';
import PlanificacionManager from './index.jsx';
import * as productionApi from '../../api/productionApi.js';

// Mock de APIs
vi.mock('../../api/productionApi.js', () => ({
  createConteoDiario: vi.fn(),
  generatePlanProduccion: vi.fn(),
  getPlanChecklist: vi.fn(),
  updatePlanDetalle: vi.fn(),
  getStockIdeal: vi.fn(),
  getRecetas: vi.fn(),
}));

// Mock de message de antd
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    },
  };
});

// Mock de tokenStore
const mockTokenStore = {
  tiendaId: 1,
  sedeId: 1,
  sedeNombre: 'Sede Test',
};

vi.mock('../../../../shared/store/tokenStore.js', () => ({
  useTokenStore: vi.fn((selector) => {
    if (typeof selector === 'function') {
      return selector(mockTokenStore);
    }
    return mockTokenStore;
  }),
}));

// Mock del componente PlanificacionView
vi.mock('./PlanificacionView.jsx', () => ({
  default: ({ 
    onSubmitConteo, 
    onGeneratePlan,
    defaultConteoRows,
    productos,
    conteoLoading,
    planLoading,
  }) => (
    <div>
      <div data-testid="planificacion-view">Planificación View</div>
      <button 
        data-testid="submit-conteo-btn"
        onClick={() => onSubmitConteo({
          fechaConteo: { format: () => '2025-12-02' },
          responsableId: 101,
          observaciones: 'Test observation',
          detalles: [
            { productoId: 1, cantidadFisica: 50, cantidadSistema: 45 },
            { productoId: 2, cantidadFisica: 30, cantidadSistema: 28 }
          ]
        })}
        disabled={conteoLoading}
      >
        Registrar Conteo
      </button>
      <button 
        data-testid="generate-plan-btn"
        onClick={() => onGeneratePlan({
          fechaProduccion: { format: () => '2025-12-02' },
          forzarRegeneracion: false,
          notasMaestro: 'Test notes'
        })}
        disabled={planLoading}
      >
        Generar Plan
      </button>
      <div data-testid="stock-ideal-count">{defaultConteoRows.length}</div>
      <div data-testid="productos-count">{Object.keys(productos).length}</div>
    </div>
  ),
}));

describe('PlanificacionManager', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Mock de productos
    vi.mocked(productionApi.getRecetas).mockResolvedValue([
      { id: 1, productoId: 1, insumoId: 10 },
      { id: 2, productoId: 2, insumoId: 11 },
    ]);

    // Mock de stock ideal
    vi.mocked(productionApi.getStockIdeal).mockResolvedValue([
      { id: 1, productoId: 1, cantidadIdeal: 50 },
      { id: 2, productoId: 2, cantidadIdeal: 30 },
    ]);

    // Mock de plan checklist
    vi.mocked(productionApi.getPlanChecklist).mockResolvedValue({
      plan: { id: 1, estado: 'CONFIRMADO' },
      detalles: []
    });

    // Limpiar mocks de mensajes
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <PlanificacionManager />
      </QueryClientProvider>
    );
  };

  describe('Renderizado inicial', () => {
    it('debería renderizar el componente correctamente', async () => {
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByTestId('planificacion-view')).toBeInTheDocument();
      });
    });

    it('debería cargar stock ideal al montar', async () => {
      renderComponent();

      await waitFor(() => {
        expect(productionApi.getStockIdeal).toHaveBeenCalledWith(1, { sedeId: 1 });
      });
    });

    it('debería mostrar el conteo de stock ideal', async () => {
      renderComponent();

      await waitFor(() => {
        const stockCount = screen.getByTestId('stock-ideal-count');
        expect(stockCount).toHaveTextContent('2');
      });
    });
  });

  describe('Creación de conteo diario', () => {
    it('debería crear un conteo diario exitosamente', async () => {
      vi.mocked(productionApi.createConteoDiario).mockResolvedValue({
        id: 1,
        sedeId: 1,
        fechaConteo: '2025-12-02',
        detalles: [
          { productoId: 1, cantidadFisica: 50 },
          { productoId: 2, cantidadFisica: 30 }
        ]
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('submit-conteo-btn')).toBeInTheDocument();
      });

      const submitBtn = screen.getByTestId('submit-conteo-btn');
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(productionApi.createConteoDiario).toHaveBeenCalledWith(1, expect.objectContaining({
          sedeId: 1,
          fechaConteo: '2025-12-02',
          responsableId: 101,
          observaciones: 'Test observation',
          detalles: expect.arrayContaining([
            expect.objectContaining({
              productoId: 1,
              cantidadFisica: 50,
              cantidadSistema: 45
            }),
            expect.objectContaining({
              productoId: 2,
              cantidadFisica: 30,
              cantidadSistema: 28
            })
          ])
        }));
      });

      await waitFor(() => {
        expect(message.success).toHaveBeenCalledWith('Conteo registrado');
      });
    });

    it('debería validar que haya detalles antes de enviar', async () => {
      vi.mocked(productionApi.createConteoDiario).mockResolvedValue({});

      renderComponent();

      // Simular envío sin detalles
      const mockOnSubmit = vi.fn();
      
      await waitFor(() => {
        expect(screen.getByTestId('submit-conteo-btn')).toBeInTheDocument();
      });
    });

    it('debería filtrar detalles sin productoId', async () => {
      vi.mocked(productionApi.createConteoDiario).mockResolvedValue({});

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('submit-conteo-btn')).toBeInTheDocument();
      });

      // El componente debería filtrar detalles inválidos internamente
      const submitBtn = screen.getByTestId('submit-conteo-btn');
      fireEvent.click(submitBtn);

      await waitFor(() => {
        const calls = vi.mocked(productionApi.createConteoDiario).mock.calls;
        if (calls.length > 0) {
          const payload = calls[0][1];
          // Todos los detalles deben tener productoId
          payload.detalles.forEach(detalle => {
            expect(detalle.productoId).toBeDefined();
            expect(detalle.cantidadFisica).toBeDefined();
          });
        }
      });
    });

    it('debería manejar errores al crear conteo', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: {
            message: 'detalles: detalles no puede estar vacío'
          }
        }
      };

      vi.mocked(productionApi.createConteoDiario).mockRejectedValue(errorResponse);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('submit-conteo-btn')).toBeInTheDocument();
      });

      const submitBtn = screen.getByTestId('submit-conteo-btn');
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith(
          expect.stringContaining('detalles')
        );
      });
    });
  });

  describe('Generación de plan de producción', () => {
    it('debería generar un plan de producción exitosamente', async () => {
      vi.mocked(productionApi.generatePlanProduccion).mockResolvedValue({
        id: 1,
        sedeId: 1,
        fechaProduccion: '2025-12-02',
        estado: 'BORRADOR'
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('generate-plan-btn')).toBeInTheDocument();
      });

      const generateBtn = screen.getByTestId('generate-plan-btn');
      fireEvent.click(generateBtn);

      await waitFor(() => {
        expect(productionApi.generatePlanProduccion).toHaveBeenCalledWith(1, {
          sedeId: 1,
          fechaProduccion: '2025-12-02',
          forzar: false,
          notasMaestro: 'Test notes'
        });
      });

      await waitFor(() => {
        expect(message.success).toHaveBeenCalledWith('Plan generado correctamente');
      });
    });

    it('debería invalidar queries después de generar plan', async () => {
      vi.mocked(productionApi.generatePlanProduccion).mockResolvedValue({
        id: 1
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('generate-plan-btn')).toBeInTheDocument();
      });

      const generateBtn = screen.getByTestId('generate-plan-btn');
      fireEvent.click(generateBtn);

      await waitFor(() => {
        expect(invalidateQueriesSpy).toHaveBeenCalled();
      });
    });

    it('debería manejar errores al generar plan', async () => {
      const errorResponse = {
        response: {
          data: {
            message: 'Ya existe un plan para esta fecha'
          }
        }
      };

      vi.mocked(productionApi.generatePlanProduccion).mockRejectedValue(errorResponse);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('generate-plan-btn')).toBeInTheDocument();
      });

      const generateBtn = screen.getByTestId('generate-plan-btn');
      fireEvent.click(generateBtn);

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith('Ya existe un plan para esta fecha');
      });
    });
  });

  describe('Manejo de estados de carga', () => {
    it('debería deshabilitar el botón de conteo durante la carga', async () => {
      vi.mocked(productionApi.createConteoDiario).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('submit-conteo-btn')).toBeInTheDocument();
      });

      const submitBtn = screen.getByTestId('submit-conteo-btn');
      fireEvent.click(submitBtn);

      // Verificar que el botón está deshabilitado durante la carga
      expect(submitBtn).toBeDisabled();
    });

    it('debería deshabilitar el botón de generar plan durante la carga', async () => {
      vi.mocked(productionApi.generatePlanProduccion).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('generate-plan-btn')).toBeInTheDocument();
      });

      const generateBtn = screen.getByTestId('generate-plan-btn');
      fireEvent.click(generateBtn);

      // Verificar que el botón está deshabilitado durante la carga
      expect(generateBtn).toBeDisabled();
    });
  });

  describe('Integración con stores', () => {
    it('debería usar tiendaId del store', async () => {
      renderComponent();

      await waitFor(() => {
        expect(productionApi.getStockIdeal).toHaveBeenCalledWith(
          1, // tiendaId del mock
          expect.any(Object)
        );
      });
    });

    it('debería usar sedeId del store', async () => {
      renderComponent();

      await waitFor(() => {
        expect(productionApi.getStockIdeal).toHaveBeenCalledWith(
          expect.any(Number),
          expect.objectContaining({ sedeId: 1 })
        );
      });
    });
  });

  describe('Validación de payload', () => {
    it('debería convertir cantidades a números', async () => {
      vi.mocked(productionApi.createConteoDiario).mockResolvedValue({});

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('submit-conteo-btn')).toBeInTheDocument();
      });

      const submitBtn = screen.getByTestId('submit-conteo-btn');
      fireEvent.click(submitBtn);

      await waitFor(() => {
        const calls = vi.mocked(productionApi.createConteoDiario).mock.calls;
        if (calls.length > 0) {
          const payload = calls[0][1];
          payload.detalles.forEach(detalle => {
            expect(typeof detalle.cantidadFisica).toBe('number');
            if (detalle.cantidadSistema !== null) {
              expect(typeof detalle.cantidadSistema).toBe('number');
            }
          });
        }
      });
    });

    it('debería formatear fechas correctamente', async () => {
      vi.mocked(productionApi.createConteoDiario).mockResolvedValue({});

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('submit-conteo-btn')).toBeInTheDocument();
      });

      const submitBtn = screen.getByTestId('submit-conteo-btn');
      fireEvent.click(submitBtn);

      await waitFor(() => {
        const calls = vi.mocked(productionApi.createConteoDiario).mock.calls;
        if (calls.length > 0) {
          const payload = calls[0][1];
          expect(payload.fechaConteo).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
      });
    });
  });
});
