export type NumerosDelPredio = {
  puestos: string;
  personasDiarias: string;
  empleos: string;
  aniosTrayectoria: string;
  diasActividad: string;
};

/**
 * Valores de respaldo: son los que estaban escritos en los componentes antes
 * de que salieran de la base. Se usan solo si la consulta falla, para que una
 * caida de base no deje la home sin numeros.
 */
export const NUMEROS_RESPALDO: NumerosDelPredio = {
  puestos: '2.200+',
  personasDiarias: '5.000+',
  empleos: '5.000+',
  aniosTrayectoria: '30+',
  diasActividad: '365',
};

/** Quita el "+" final, para textos que ya dicen "Mas de ...". */
export const sinMas = (valor: string): string => valor.replace(/\+$/, '');

export type PrecioSimple = { precio: string; moneda: string };

export type CondicionDeAlquiler = { titulo: string; detalle: string };

export const ALQUILER_RESPALDO: CondicionDeAlquiler[] = [
  { titulo: 'Valor Mensual', detalle: '$1.900.000 ARS (Con expensas incluidas)' },
  { titulo: 'Forma de Pago', detalle: 'Pago completo del mes o hasta el 50% (Solo Transferencia)' },
  { titulo: 'Medidas del Puesto', detalle: 'Puesto de 2x2 Mts listo para operar' },
  { titulo: 'Condicion Fiscal', detalle: 'Monotributo (Minimo Categoria C)' },
  { titulo: 'Documentacion', detalle: 'DNI original en mano al momento de firmar' },
  { titulo: 'Cobros Electronicos', detalle: 'POSNET habilitado para ventas con tarjeta' },
];

export type PreciosDeServicios = {
  internet: {
    diario: PrecioSimple & { detalle: string };
    mensual: PrecioSimple & { detalle: string };
  };
  estacionamiento: PrecioSimple & { titulo: string };
  alquiler: CondicionDeAlquiler[];
};

export const PRECIOS_RESPALDO: PreciosDeServicios = {
  internet: {
    diario: { precio: '$1.000', moneda: 'ARS', detalle: 'Valido por 24 horas para 1 dispositivo.' },
    mensual: { precio: '$10.000', moneda: 'ARS', detalle: '30 dias corridos para locatarios y personal.' },
  },
  estacionamiento: { precio: '$10.000', moneda: 'ARS', titulo: 'Estadia Completa' },
  alquiler: ALQUILER_RESPALDO,
};

export type DatosDeContacto = {
  direccion: string;
  email: string;
  horarios: string;
  whatsapp: { numero: string; visible: string; mensaje: string };
  whatsappAlquiler: { numero: string; mensaje: string };
  redes: { instagram: string; facebook: string; youtube: string };
};

export const CONTACTO_RESPALDO: DatosDeContacto = {
  direccion: 'Rene Gonzalo Rojas Paz, Ingeniero Budge, Provincia de Buenos Aires, Argentina',
  email: 'contacto.urku@gmail.com',
  horarios: 'Lunes, miercoles y sabado de 7:00 a 14:00 hs.',
  whatsapp: {
    numero: '541124240338',
    visible: '+54 11 2424-0338',
    mensaje: 'Hola Feria Urkupina, quisiera realizar una consulta.',
  },
  whatsappAlquiler: {
    numero: '541168615707',
    mensaje: 'Hola! Quiero consultar por el alquiler de un puesto en Paseo Urkupina',
  },
  redes: {
    instagram: 'https://www.instagram.com/urkupina.s.a/?hl=es',
    facebook: 'https://www.facebook.com/urkupinaSA/?locale=es_LA',
    youtube: 'https://youtube.com/@ULIVE_STREAM',
  },
};

/**
 * Arma el enlace de WhatsApp con el mensaje ya escrito.
 *
 * Existe para que el enlace se construya en un solo lugar: la misma URL con
 * el mismo texto codificado a mano estaba repetida en tres archivos.
 */
export const enlaceWhatsapp = (whatsapp: {
  numero: string;
  mensaje: string;
}): string => `https://wa.me/${whatsapp.numero}?text=${encodeURIComponent(whatsapp.mensaje)}`;
