/**
 * Forma de la ficha tal como la necesita el popup. Se define aca en vez de
 * importar el tipo generado por Payload para que esta pieza se pueda probar
 * sin depender de que los tipos esten regenerados.
 */
export type FichaDePopup = {
  activo?: boolean | null;
  imagen?:
    | number
    | string
    | {
        url?: string | null;
        alt?: string | null;
        width?: number | null;
        height?: number | null;
      }
    | null;
  enlace?: string | null;
};

/** Lo que necesita el componente para dibujar el modal. */
export type PopupVisible = {
  imagen: string;
  alt: string;
  ancho: number;
  alto: number;
  enlace?: string;
};

/**
 * Un enlace que sale del sitio se abre en pestana nueva; un ancla o una ruta
 * propia, en la misma. Se decide por el protocolo y no por otra cosa: es lo
 * unico que distingue de forma confiable un destino externo.
 */
export const esEnlaceExterno = (enlace: string): boolean => /^https?:\/\//i.test(enlace);

/**
 * Decide si hay popup que mostrar y arma sus datos.
 *
 * Devuelve null en vez de un objeto a medias: prendido pero sin imagen no es
 * un error que haya que avisar, es simplemente que todavia no hay nada que
 * mostrar. Un recuadro vacio se ve peor que ningun popup.
 */
export const aPopupVisible = (ficha: FichaDePopup | null | undefined): PopupVisible | null => {
  if (!ficha?.activo) return null;

  const { imagen } = ficha;
  // Si la consulta no pidio depth, la relacion llega como id y no hay nada
  // que dibujar.
  if (typeof imagen !== 'object' || imagen === null) return null;
  // next/image necesita el tamano para reservar el espacio y no mover la
  // pagina cuando termina de cargar.
  if (!imagen.url || !imagen.width || !imagen.height) return null;

  const enlace = ficha.enlace?.trim();

  return {
    imagen: imagen.url,
    alt: imagen.alt ?? '',
    ancho: imagen.width,
    alto: imagen.height,
    enlace: enlace ? enlace : undefined,
  };
};
