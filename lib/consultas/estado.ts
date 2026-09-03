/**
 * Estado del envio de un formulario, compartido entre la Server Action y los
 * componentes de cliente.
 *
 * Vive aca y no en app/actions/consultas.ts a proposito: un archivo con
 * 'use server' convierte TODOS sus exports en referencias remotas, no solo
 * las funciones async. Si `estadoInicial` se exportara desde ahi, el cliente
 * recibiria un stub invocable en lugar del objeto, y useActionState arrancaria
 * con un estado sin `errores`.
 */
export type EstadoEnvio = {
  estado: 'inicial' | 'ok' | 'error';
  errores: Record<string, string>;
  mensajeGeneral?: string;
};

export const estadoInicial: EstadoEnvio = { estado: 'inicial', errores: {} };
