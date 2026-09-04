import { describe, expect, it } from 'vitest';
import { validarRespuesta, type CampoDeFormulario } from './validacion';

const texto = (extra: Partial<CampoDeFormulario> = {}): CampoDeFormulario => ({
  blockType: 'text',
  name: 'razonSocial',
  label: 'Razón social',
  required: true,
  ...extra,
});

describe('validarRespuesta', () => {
  it('acepta una respuesta completa', () => {
    const r = validarRespuesta([texto()], { razonSocial: 'Textiles del Sur' });
    expect(r.ok).toBe(true);
  });

  it('marca el campo obligatorio vacio', () => {
    const r = validarRespuesta([texto()], { razonSocial: '   ' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores.razonSocial).toBe('Este campo es obligatorio.');
  });

  it('deja pasar un campo opcional vacio', () => {
    const r = validarRespuesta([texto({ name: 'cargo', required: false })], { cargo: '' });
    expect(r.ok).toBe(true);
  });

  it('rechaza un correo mal escrito', () => {
    const campo = texto({ blockType: 'email', name: 'email', label: 'Correo' });
    const r = validarRespuesta([campo], { email: 'sin-arroba' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores.email).toBe('Ingresá un correo electrónico válido.');
  });

  it('acepta un correo bien escrito', () => {
    const campo = texto({ blockType: 'email', name: 'email', label: 'Correo' });
    expect(validarRespuesta([campo], { email: 'hola@ejemplo.com' }).ok).toBe(true);
  });

  it('rechaza un numero que no es numero', () => {
    const campo = texto({ blockType: 'number', name: 'cantidad', label: 'Cantidad' });
    const r = validarRespuesta([campo], { cantidad: 'diez' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores.cantidad).toBe('Ingresá un número.');
  });

  it('rechaza una opcion que no esta en la lista', () => {
    const campo: CampoDeFormulario = {
      blockType: 'select',
      name: 'rubro',
      label: 'Rubro',
      required: true,
      options: [{ label: 'Textil', value: 'textil' }],
    };
    const r = validarRespuesta([campo], { rubro: 'mineria' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores.rubro).toBe('Elegí una de las opciones.');
  });

  it('acepta el largo justo en el tope de un texto', () => {
    expect(validarRespuesta([texto()], { razonSocial: 'a'.repeat(200) }).ok).toBe(true);
  });

  it('rechaza un texto mas largo que el tope', () => {
    const r = validarRespuesta([texto()], { razonSocial: 'a'.repeat(201) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores.razonSocial).toBe('Este texto es demasiado largo.');
  });

  it('el area de texto tolera mas largo que un texto', () => {
    const campo = texto({ blockType: 'textarea', name: 'mensaje', label: 'Mensaje' });
    expect(validarRespuesta([campo], { mensaje: 'a'.repeat(2000) }).ok).toBe(true);
    expect(validarRespuesta([campo], { mensaje: 'a'.repeat(2001) }).ok).toBe(false);
  });

  it('devuelve los valores limpios cuando esta todo bien', () => {
    const r = validarRespuesta([texto()], { razonSocial: '  Textiles del Sur  ' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.valores).toEqual({ razonSocial: 'Textiles del Sur' });
  });

  it('una definicion sin campos no rompe', () => {
    expect(validarRespuesta([], {}).ok).toBe(true);
  });
});
