'use client';

import { RefreshRouteOnSave as RefrescarPayload } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';

/**
 * Escucha los avisos que manda el panel al guardar y refresca la ruta, para
 * que la vista previa muestre el cambio sin que nadie recargue a mano.
 *
 * Solo hace algo cuando la pagina esta embebida en el panel; en una visita
 * normal no interfiere.
 */
export const RefrescarAlGuardar = ({ url }: { url: string }) => {
  const router = useRouter();

  return <RefrescarPayload refresh={() => router.refresh()} serverURL={url} />;
};
