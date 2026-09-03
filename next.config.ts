import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

// Las imagenes se guardan en disco local (public/media) y se sirven desde el
// propio dominio, asi que no hace falta declarar dominios remotos.
const nextConfig: NextConfig = {};

export default withPayload(nextConfig);
