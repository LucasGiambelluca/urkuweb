import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

// Las imagenes se guardan en disco local (public/media) y se sirven desde el
// propio dominio, asi que no hace falta declarar dominios remotos.
const nextConfig: NextConfig = {
  // Solo afecta a `next dev`: en produccion esta lista se ignora.
  //
  // Cuando el servidor de desarrollo se expone por un tunel (ngrok) para que
  // alguien pruebe el panel desde afuera, Next bloquea los pedidos a /_next/*
  // que vengan de un host distinto al local. El HTML llega igual, pero sin
  // JavaScript ni CSS: la pantalla queda en negro. El comodin evita tener que
  // editar esto cada vez que el tunel cambia de subdominio.
  allowedDevOrigins: ['*.ngrok-free.app', '*.ngrok.app'],
};

export default withPayload(nextConfig);
