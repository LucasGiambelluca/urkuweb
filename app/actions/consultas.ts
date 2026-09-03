'use server';

import { getPayload } from 'payload';
import { headers } from 'next/headers';
import config from '@payload-config';
import { validarConsulta } from '@/lib/consultas/validacion';
import { limitadorDeConsultas } from '@/lib/consultas/limite';
import type { EstadoEnvio } from '@/lib/consultas/estado';

// Este archivo solo puede exportar funciones async: 'use server' convierte
// todo lo demas en referencias remotas. El tipo y el estado inicial viven en
// lib/consultas/estado.ts.

const ipDelVisitante = async (): Promise<string> => {
  const cabeceras = await headers();
  // nginx reenvia las dos; la primera de x-forwarded-for es la del visitante.
  const reenviada = cabeceras.get('x-forwarded-for');
  if (reenviada) return reenviada.split(',')[0].trim();
  return cabeceras.get('x-real-ip') ?? 'desconocida';
};

export async function enviarConsulta(
  _estadoPrevio: EstadoEnvio,
  formData: FormData,
): Promise<EstadoEnvio> {
  const texto = (campo: string) => (formData.get(campo) as string | null) ?? '';

  const resultado = validarConsulta({
    tipo: texto('tipo'),
    nombre: texto('nombre'),
    email: texto('email'),
    telefono: texto('telefono'),
    empresa: texto('empresa'),
    asunto: texto('asunto'),
    formato: texto('formato'),
    mensaje: texto('mensaje'),
    trampa: texto('sitioWeb'),
  });

  if (!resultado.ok) {
    // Al spam se le contesta lo mismo que a un envio bueno: si se le avisa
    // que fue detectado, el bot ajusta y vuelve.
    if (resultado.esSpam) {
      return { estado: 'ok', errores: {} };
    }
    return {
      estado: 'error',
      errores: resultado.errores,
      mensajeGeneral: 'Revisa los campos marcados.',
    };
  }

  if (!limitadorDeConsultas.permitir(await ipDelVisitante())) {
    return {
      estado: 'error',
      errores: {},
      mensajeGeneral:
        'Recibimos varias consultas desde esta conexion. Espera un rato antes de enviar otra.',
    };
  }

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: 'consultas',
      data: { ...resultado.datos, estado: 'nueva' },
      // La coleccion tiene create cerrado para la API REST. Acá corremos del
      // lado del servidor, que es el unico camino habilitado para dar de alta.
      overrideAccess: true,
    });
  } catch (error) {
    console.error('[consultas] no se pudo guardar la consulta:', error);
    return {
      estado: 'error',
      errores: {},
      mensajeGeneral:
        'No pudimos registrar tu consulta. Volve a intentar en unos minutos o escribinos por WhatsApp.',
    };
  }

  return { estado: 'ok', errores: {} };
}
