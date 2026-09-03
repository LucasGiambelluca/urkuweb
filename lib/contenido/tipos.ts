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

export type PreciosDeServicios = {
  internet: {
    diario: PrecioSimple & { detalle: string };
    mensual: PrecioSimple & { detalle: string };
  };
  estacionamiento: PrecioSimple & { titulo: string };
};

export const PRECIOS_RESPALDO: PreciosDeServicios = {
  internet: {
    diario: { precio: '$1.000', moneda: 'ARS', detalle: 'Valido por 24 horas para 1 dispositivo.' },
    mensual: { precio: '$10.000', moneda: 'ARS', detalle: '30 dias corridos para locatarios y personal.' },
  },
  estacionamiento: { precio: '$10.000', moneda: 'ARS', titulo: 'Estadia Completa' },
};
