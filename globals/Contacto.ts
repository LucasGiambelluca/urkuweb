import type { GlobalConfig } from 'payload';
import { soloAutenticado } from '../access/roles';
import { purgarCacheDeLaHome } from './revalidar';

export const Contacto: GlobalConfig = {
  slug: 'contacto',
  label: 'Contacto y redes',
  admin: {
    group: 'Contenido del sitio',
    description: 'Datos que aparecen en la seccion de contacto, el pie y el boton flotante.',
  },
  access: {
    read: () => true,
    update: soloAutenticado,
  },
  hooks: { afterChange: [() => purgarCacheDeLaHome()] },
  fields: [
    {
      name: 'direccion',
      type: 'textarea',
      required: true,
      defaultValue:
        'René Gonzalo Rojas Paz, Ingeniero Budge, Provincia de Buenos Aires, Argentina',
      label: 'Direccion del predio',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      defaultValue: 'contacto.urku@gmail.com',
      label: 'Correo de contacto',
    },
    {
      name: 'horarios',
      type: 'text',
      required: true,
      defaultValue: 'Lunes, miércoles y sábado de 7:00 a 14:00 hs.',
      label: 'Horario de atencion',
    },
    {
      name: 'whatsapp',
      type: 'group',
      label: 'WhatsApp',
      fields: [
        {
          name: 'numero',
          type: 'text',
          required: true,
          defaultValue: '541124240338',
          label: 'Numero, solo digitos',
          admin: { description: 'Con codigo de pais y sin espacios ni signos. Es el que usa el enlace.' },
        },
        {
          name: 'visible',
          type: 'text',
          required: true,
          defaultValue: '+54 11 2424-0338',
          label: 'Como se muestra',
        },
        {
          name: 'mensaje',
          type: 'text',
          required: true,
          defaultValue: 'Hola Feria Urkupiña, quisiera realizar una consulta.',
          label: 'Mensaje predefinido',
          admin: { description: 'Es el texto que aparece ya escrito cuando alguien abre el chat.' },
        },
      ],
    },
    {
      name: 'whatsappAlquiler',
      type: 'group',
      label: 'WhatsApp comercial de alquiler',
      admin: {
        description:
          'Es un contacto distinto al general: atiende consultas de alquiler de puestos. Aparece en la seccion de servicios.',
      },
      fields: [
        {
          name: 'numero',
          type: 'text',
          required: true,
          defaultValue: '541168615707',
          label: 'Numero, solo digitos',
        },
        {
          name: 'mensaje',
          type: 'text',
          required: true,
          defaultValue: 'Hola! Quiero consultar por el alquiler de un puesto en Paseo Urkupiña',
          label: 'Mensaje predefinido',
        },
      ],
    },
    {
      name: 'redes',
      type: 'group',
      label: 'Redes sociales',
      fields: [
        {
          name: 'instagram',
          type: 'text',
          defaultValue: 'https://www.instagram.com/urkupina.s.a/?hl=es',
          label: 'Instagram',
        },
        {
          name: 'facebook',
          type: 'text',
          defaultValue: 'https://www.facebook.com/urkupinaSA/?locale=es_LA',
          label: 'Facebook',
        },
        {
          name: 'youtube',
          type: 'text',
          defaultValue: 'https://youtube.com/@ULIVE_STREAM',
          label: 'YouTube',
        },
      ],
    },
  ],
};
