src/
└── features/
└── tiendas/
├── api/
│   └── tiendas.api.js
│       // CONTENEDOR DE LÓGICA DE API (MOTOR)
│       // - Aquí vive Axios.
│       // - No sabe nada de React, hooks, ni estado.
│       // - export const getTiendas = async (queryParams) => { ... }
│       // - export const createTienda = async (payload) => { ... }
│       // - export const deleteTienda = async (id) => { ... }
│
├── components/
│   ├── TiendasTabla/
│   │   ├── index.jsx
│   │   │   // EL CONTENEDOR INTELIGENTE (CEREBRO)
│   │   │   // - Este es el archivo que se importa por defecto.
│   │   │   // - Usa useQuery(['tiendas'], getTiendas).
│   │   │   // - Usa useMutation(deleteTienda).
│   │   │   // - Importa y renderiza <TiendasTablaUI /> pasándole props.
│   │   │   // - Maneja el "Cuándo" y el "Qué" de la lógica de datos.
│   │   │
│   │   └── TiendasTablaUI.jsx
│   │       // EL COMPONENTE TONTO (VISTA)
│   │       // - No usa Tanstack.
│   │       // - Solo recibe props: (data, isLoading, onDeleteClick).
│   │       // - Es 100% reutilizable y fácil de testear.
│   │
│   ├── TiendaForm/
│   │   ├── index.jsx
│   │   │   // EL CONTENEDOR INTELIGENTE (CEREBRO DEL FORMULARIO)
│   │   │   // - Maneja el estado del formulario (ej. con react-hook-form).
│   │   │   // - Llama al hook de validaciones: useTiendaValidations.
│   │   │   // - Usa useMutation(createTienda) o (updateTienda).
│   │   │   // - Pasa todas las props necesarias a <TiendaFormUI />.
│   │   │
│   │   └── TiendaFormUI.jsx
│   │       // EL COMPONENTE TONTO (VISTA DEL FORMULARIO)
│   │       // - Solo inputs, botones y labels.
│   │       // - Recibe props: (register, handleSubmit, errors, isLoading).
│   │
│   └── TiendasFiltros/
│       ├── index.jsx
│       │   // EL CONTENEDOR INTELIGENTE (CEREBRO DE FILTROS)
│       │   // - Usa useState para manejar el estado de los filtros.
│       │   // - (Idea avanzada): Podría usar un store (Zustand)
│       │   //   para compartir los filtros con TiendasTabla/index.jsx
│       │   // - Renderiza <TiendasFiltrosUI />
│       │
│       └── TiendasFiltrosUI.jsx
│           // EL COMPONENTE TONTO (VISTA DE FILTROS)
│           // - Solo inputs, selects, etc.
│           // - Recibe props (onFilterChange, etc.)
│
├── pages/
│   ├── TiendasPage.jsx
│   │   // LA PÁGINA (ENSAMBLADOR / CONTENEDOR LIGERO)
│   │   // - ¡Ya no tiene 900 líneas!
│   │   // - Su única responsabilidad es componer la página.
│   │   // - Renderiza:
│   │   //   <PageHeader title="Gestión de Tiendas" />
│   │   //   <TiendasFiltros />  <- Importa el contenedor inteligente
│   │   //   <TiendasTabla />    <- Importa el contenedor inteligente
│   │
│   └── TiendaFormPage.jsx
│       // LA PÁGINA (ENSAMBLADOR / CONTENEDOR LIGERO)
│       // - Obtiene el :id de la URL.
│       // - Si hay :id, usa useQuery(getTiendaById) para cargar datos.
│       // - Renderiza:
│       //   <TiendaForm initialData={data} />
│
├── hooks/
│   └── useTiendaValidations.js
│       // HOOK DE LÓGICA DE UI/DOMINIO (NO-API)
│       // - Lógica reutilizable que NO es de API.
│       // - export function useTiendaValidations() { ... }
│       // - Es usado por TiendaForm/index.jsx
│
└── constants/
└── tienda.constants.js
// Constantes puras.
// - export const ESTADOS_DE_TIENDA = [...]
// - export const TIPOS_DOCUMENTO = [...]