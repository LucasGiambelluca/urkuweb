'use server';

import { getPayload } from 'payload';
import { headers } from 'next/headers';
import config from '@payload-config';
import { validarRespuesta, type CampoDeFormulario } from '@/lib/formularios/validacion';
import { LimitadorEnvios } from '@/lib/consultas/limite';
import type { EstadoDeEnvio } from '@/lib/formularios/estado';

/**
 * Cinco envios por hora y por IP, en una instancia propia.
 *
 * Separada de la del formulario de contacto a proposito: si comparten el
 * contador, alguien que mando cinco consultas se queda sin poder inscribirse.
 */
const limitador = new LimitadorEnvios({ maximo: 5, ventanaMs: 60 * 60 * 1000 });

const ipDelVisitante = async (): Promise<string> => {
  const cabeceras = await headers();
  // nginx reenvia las dos; la primera de x-forwarded-for es la del visitante.
  const reenviada = cabeceras.get('x-forwarded-for');
  if (reenviada) return reenviada.split(',')[0].trim();
  return cabeceras.get('x-real-ip') ?? 'desconocida';
};

export async function enviarFormulario(
  _estadoPrevio: EstadoDeEnvio,
  formData: FormData,
): Promise<EstadoDeEnvio> {
  const idDelFormulario = String(formData.get('formulario') ?? '');

  // Campo trampa: es invisible para las personas, asi que si viene con algo lo
  // cargo un bot. Se le contesta lo mismo que a un envio bueno: si se le avisa
  // que fue detectado, el bot ajusta y vuelve.
  if (String(formData.get('sitioWeb') ?? '').trim() !== '') {
    return { estado: 'ok', errores: {} };
  }

  try {
    const payload = await getPayload({ config });
    const definicion = await payload.findByID({
      collection: 'forms',
      id: idDelFormulario,
      depth: 0,
      overrideAccess: true,
    });

    const campos = (definicion.fields ?? []) as unknown as CampoDeFormulario[];

    const entrada: Record<string, string> = {};
    for (const campo of campos) {
      entrada[campo.name] = String(formData.get(campo.name) ?? '');
    }

    const resultado = validarRespuesta(campos, entrada);
    if (!resultado.ok) {
      return {
        estado: 'error',
        errores: resultado.errores,
        mensajeGeneral: 'Revisá los campos marcados.',
      };
    }

    if (!limitador.permitir(await ipDelVisitante())) {
      return {
        estado: 'error',
        errores: {},
        mensajeGeneral:
          'Recibimos varios envíos desde esta conexión. Esperá un rato antes de mandar otro.',
      };
    }

    await payload.create({
      collection: 'form-submissions',
      data: {
        form: definicion.id,
        submissionData: Object.entries(resultado.valores).map(([field, value]) => ({
          field,
          value,
        })),
      },
      // La coleccion tiene create cerrado para la API REST. Aca corremos del
      // lado del servidor, que es el unico camino habilitado para dar de alta.
      overrideAccess: true,
    });
  } catch (error) {
    console.error('[formularios] no se pudo guardar la respuesta:', error);
    return {
      estado: 'error',
      errores: {},
      mensajeGeneral:
        'No pudimos registrar tus datos. Volvé a intentar en unos minutos o escribinos por WhatsApp.',
    };
  }

  return { estado: 'ok', errores: {} };
}
