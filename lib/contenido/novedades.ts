import type { Post } from '@/payload-types';

/**
 * Forma de una novedad tal como la muestra la home. Es mas chica que el
 * documento de Payload a proposito: la tarjeta solo necesita titulo, resumen,
 * fecha, imagen y categoria.
 */
export type NovedadVisible = {
  id: string | number;
  title: string;
  content: string;
  created_at?: string;
  image?: string;
  category?: string;
  isUpcoming?: boolean;
};

/**
 * Notas de ejemplo. Se usan solo mientras no haya ninguna publicada: una
 * seccion de novedades vacia se ve peor que una con contenido de muestra.
 * Estaban escritas dentro del componente; viven aca para que el componente
 * quede como vista pura y el respaldo se pueda probar.
 */
export const NOVEDADES_RESPALDO: NovedadVisible[] = [
  {
    id: 'fb-1',
    title: 'Optimización de Envíos Nacionales',
    category: 'Obras',
    isUpcoming: true,
    content:
      'Nuevos acuerdos de transporte de carga consolidada con Expreso Federal reducen los costos de envío hasta un 25% para compradores mayoristas.',
    created_at: '2026-06-20',
    image: '/images/one.png',
  },
  {
    id: 'fb-2',
    title: 'Implementación de Códigos QR',
    category: 'Obras',
    isUpcoming: true,
    content:
      'Todos los puestos contarán con un QR único institucional. Escaneándolo podrás guardar su contacto de WhatsApp y acceder a sus catálogos online.',
    created_at: '2026-06-18',
    image: '/images/pasillos.png',
  },
  {
    id: 'fb-3',
    title: 'Ampliación de Seguridad en el Predio',
    category: 'Obras',
    isUpcoming: false,
    content:
      'Despliegue de 120 cámaras domo 4K de alta definición y personal de seguridad motorizado en las zonas de estacionamiento de colectivos.',
    created_at: '2026-06-12',
    image: '/images/decenital.png',
  },
  {
    id: 'fb-4',
    title: 'Taller Cultural y Capacitaciones Textiles',
    category: 'Cultura',
    isUpcoming: false,
    content:
      'Nuevos talleres semanales de moldería industrial, e-commerce textil y gestión financiera sin costo para puestos y talleres asociados.',
    created_at: '2026-06-05',
    image: '/images/feria-hero.jpg',
  },
  {
    id: 'fb-5',
    title: 'Torneo Deportivo Integración Urkupiña',
    category: 'Deportes',
    isUpcoming: false,
    content:
      'Gran jornada deportiva inter-comercial con actividades recreativas para locatarios y familias del paseo.',
    created_at: '2026-05-28',
    image: '/images/pasillos.png',
  },
  {
    id: 'fb-6',
    title: 'Festival Anual de Colectividades y Eventos',
    category: 'Eventos',
    isUpcoming: false,
    content:
      'Presentación de la agenda de eventos gastronómicos, espectáculos en vivo y muestras artesanales.',
    created_at: '2026-05-15',
    image: '/images/histor.png',
  },
];

/** Nodo de Lexical visto de lejos: lo unico que interesa es el texto y los hijos. */
type NodoDeTexto = { text?: unknown; children?: unknown };

/**
 * Aplana el richText del editor a texto corrido.
 *
 * La tarjeta muestra un resumen de 130 caracteres, no el articulo con
 * formato: para eso alcanza con juntar el texto de todos los nodos.
 */
export const textoPlano = (contenido: Post['content'] | undefined): string => {
  const partes: string[] = [];

  const recorrer = (nodo: NodoDeTexto) => {
    if (typeof nodo.text === 'string' && nodo.text.length > 0) {
      partes.push(nodo.text);
    }
    if (Array.isArray(nodo.children)) {
      for (const hijo of nodo.children) {
        recorrer(hijo as NodoDeTexto);
      }
    }
  };

  if (contenido?.root) {
    recorrer(contenido.root as NodoDeTexto);
  }

  return partes.join(' ').replace(/\s+/g, ' ').trim();
};

/**
 * Traduce un post de Payload a lo que muestra la tarjeta.
 *
 * `ahora` se pasa por parametro para poder probar el caso de la nota con
 * fecha futura sin depender del reloj de la maquina.
 */
export const aNovedadVisible = (post: Post, ahora: Date = new Date()): NovedadVisible => {
  // Las relaciones vienen pobladas cuando la consulta pide depth; si vino
  // solo el id (un numero), no hay nombre ni url que mostrar.
  const categoria =
    typeof post.category === 'object' && post.category !== null ? post.category.name : '';
  const imagen =
    typeof post.featuredImage === 'object' && post.featuredImage !== null
      ? (post.featuredImage.url ?? undefined)
      : undefined;

  const fecha = post.publishedAt ?? post.createdAt;

  return {
    // El slug es unico y hace legible el enlace de la tarjeta.
    id: post.slug,
    title: post.title,
    content: post.seoDescription?.trim() || textoPlano(post.content),
    created_at: fecha,
    image: imagen,
    category: categoria,
    // Una nota publicada con fecha futura se anuncia como proxima, que es
    // para lo que sirve la fecha programada de la ficha.
    isUpcoming: Boolean(post.publishedAt) && new Date(post.publishedAt as string) > ahora,
  };
};
