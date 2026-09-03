import { revalidatePath } from 'next/cache';

/**
 * revalidatePath solo funciona dentro del contexto de una peticion de Next.
 * Guardar desde el panel lo tiene; un script de linea de comandos o una
 * migracion, no, y ahi tira "static generation store missing".
 */
export const purgarCacheDeLaHome = () => {
  try {
    revalidatePath('/');
  } catch {
    // Fuera de una peticion no hay cache que purgar: no es un error.
  }
};
