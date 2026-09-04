/**
 * Estado del envio de un formulario, compartido entre la Server Action y el
 * componente de cliente.
 *
 * Vive aca y no en app/actions/formularios.ts a proposito: un archivo con
 * 'use server' convierte TODOS sus exports en referencias remotas, no solo las
 * funciones async. Es el mismo motivo por el que existe lib/consultas/estado.ts.
 */
export type EstadoDeEnvio = {
  estado: 'inicial' | 'ok' | 'error';
  errores: Record<string, string>;
  mensajeGeneral?: string;
  /**
   * Lo que cargo el visitante, para devolverselo si la validacion falla.
   *
   * React resetea el formulario cuando la accion termina, asi que sin esto
   * un error en un solo campo le borra los otros diez.
   */
  valores?: Record<string, string>;
};

export const estadoInicial: EstadoDeEnvio = { estado: 'inicial', errores: {} };
