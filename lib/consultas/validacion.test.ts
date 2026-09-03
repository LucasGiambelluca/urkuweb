import { describe, expect, it } from 'vitest';
import { validarConsulta } from './validacion';

const base = {
  tipo: 'contacto',
  nombre: 'Carlos Rodriguez',
  email: 'carlos@ejemplo.com',
  telefono: '11 2345-6789',
  empresa: '',
  asunto: 'General',
  formato: '',
  mensaje: 'Quisiera consultar por los horarios de la feria.',
  trampa: '',
};

describe('validarConsulta', () => {
  it('acepta una consulta completa', () => {
    const r = validarConsulta(base);
    expect(r.ok).toBe(true);
  });

  it('normaliza los espacios sobrantes', () => {
    const r = validarConsulta({ ...base, nombre: '  Carlos  ', email: '  CARLOS@Ejemplo.com ' });
    expect(r.ok && r.datos.nombre).toBe('Carlos');
    expect(r.ok && r.datos.email).toBe('carlos@ejemplo.com');
  });

  it('exige el nombre', () => {
    const r = validarConsulta({ ...base, nombre: '   ' });
    expect(r.ok).toBe(false);
    expect(!r.ok && r.errores.nombre).toBeTruthy();
  });

  it('exige el email', () => {
    const r = validarConsulta({ ...base, email: '' });
    expect(!r.ok && r.errores.email).toBeTruthy();
  });

  it('rechaza un email con formato invalido', () => {
    const r = validarConsulta({ ...base, email: 'carlos@sinpunto' });
    expect(!r.ok && r.errores.email).toBeTruthy();
  });

  it('exige el mensaje', () => {
    const r = validarConsulta({ ...base, mensaje: '' });
    expect(!r.ok && r.errores.mensaje).toBeTruthy();
  });

  it('rechaza un mensaje demasiado corto', () => {
    const r = validarConsulta({ ...base, mensaje: 'hola' });
    expect(!r.ok && r.errores.mensaje).toBeTruthy();
  });

  it('rechaza un mensaje desmesurado', () => {
    const r = validarConsulta({ ...base, mensaje: 'a'.repeat(5001) });
    expect(!r.ok && r.errores.mensaje).toBeTruthy();
  });

  it('rechaza un tipo que no existe', () => {
    const r = validarConsulta({ ...base, tipo: 'cualquiera' });
    expect(!r.ok && r.errores.tipo).toBeTruthy();
  });

  it('acepta el tipo publicidad', () => {
    const r = validarConsulta({ ...base, tipo: 'publicidad', empresa: 'Textil SA' });
    expect(r.ok).toBe(true);
    expect(r.ok && r.datos.empresa).toBe('Textil SA');
  });

  it('conserva el formato publicitario elegido', () => {
    const r = validarConsulta({ ...base, tipo: 'publicidad', formato: 'carteleria' });
    expect(r.ok && r.datos.formato).toBe('carteleria');
  });

  it('descarta el envio si la trampa viene llena', () => {
    const r = validarConsulta({ ...base, trampa: 'http://spam.example' });
    expect(r.ok).toBe(false);
    expect(!r.ok && r.esSpam).toBe(true);
  });

  it('el telefono es opcional', () => {
    const r = validarConsulta({ ...base, telefono: '' });
    expect(r.ok).toBe(true);
  });

  it('acumula todos los errores juntos, no solo el primero', () => {
    const r = validarConsulta({ ...base, nombre: '', email: '', mensaje: '' });
    expect(!r.ok && Object.keys(r.errores)).toHaveLength(3);
  });
});
