/**
 * Crea el formulario de inscripcion de expositores de EXPOURKU y lo deja
 * puesto en la home, con el ancla "inscripcion" para que el popup apunte ahi.
 *
 * Es una siembra, no codigo: despues se edita todo desde el panel.
 * Es idempotente: si el formulario ya existe, no lo duplica.
 *
 * Uso: npm run sembrar:formulario-expo
 */
import { getPayload } from 'payload';
import config from '../payload.config';

const TITULO = 'Inscripción de expositores EXPOURKU';

/** Los once campos que paso el cliente. El ancho es el que ocupan en pantalla. */
const CAMPOS = [
  { name: 'razonSocial', label: 'Razón social', required: true, width: 50 },
  { name: 'nombreComercial', label: 'Nombre comercial / Marca', required: true, width: 50 },
  { name: 'cuit', label: 'CUIT', required: true, width: 50 },
  { name: 'rubro', label: 'Rubro / actividad', required: true, width: 50 },
  { name: 'responsable', label: 'Nombre y apellido del responsable', required: true, width: 50 },
  { name: 'cargo', label: 'Cargo', required: false, width: 50 },
  { name: 'telefono', label: 'Teléfono / WhatsApp', required: true, width: 50 },
  { name: 'instagram', label: 'Instagram', required: false, width: 50 },
  { name: 'paginaWeb', label: 'Página web', required: false, width: 50 },
  { name: 'localidad', label: 'Localidad / Provincia', required: false, width: 50 },
];

const sembrar = async () => {
  const payload = await getPayload({ config });

  const existentes = await payload.find({
    collection: 'forms',
    where: { title: { equals: TITULO } },
    limit: 1,
    overrideAccess: true,
  });

  if (existentes.totalDocs > 0) {
    console.log('- formulario de EXPOURKU: ya existe, se omite');
    return;
  }

  const formulario = await payload.create({
    collection: 'forms',
    data: {
      title: TITULO,
      submitButtonLabel: 'Quiero participar',
      confirmationType: 'message',
      // Obligatorio cuando el tipo de confirmacion es "message". Es el texto
      // que reemplaza al formulario despues de enviarlo, y el que lee la home
      // con textoPlano. Se edita desde el panel como cualquier otro.
      confirmationMessage: {
        root: {
          type: 'root',
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'paragraph',
              version: 1,
              direction: 'ltr',
              format: '',
              indent: 0,
              children: [
                {
                  type: 'text',
                  version: 1,
                  text: '¡Gracias! Recibimos tus datos y te vamos a contactar a la brevedad.',
                  format: 0,
                  detail: 0,
                  mode: 'normal',
                  style: '',
                },
              ],
            },
          ],
        },
      },
      fields: [
        ...CAMPOS.map((c) => ({ blockType: 'text' as const, ...c })),
        // El correo va aparte porque su tipo valida el formato.
        {
          blockType: 'email' as const,
          name: 'email',
          label: 'Correo electrónico',
          required: true,
          width: 50,
        },
      ],
    } as never,
    overrideAccess: true,
  });

  const home = await payload.findGlobal({ slug: 'home', overrideAccess: true });
  const secciones = (home.secciones ?? []) as { blockType: string }[];

  await payload.updateGlobal({
    slug: 'home',
    data: {
      secciones: [
        ...secciones,
        {
          blockType: 'formulario',
          formulario: formulario.id,
          lado: 'izquierda',
          ancla: 'inscripcion',
        },
      ],
    } as never,
    overrideAccess: true,
  });

  console.log('+ formulario de EXPOURKU: creado y agregado a la home con el ancla "inscripcion"');
};

// Con await de nivel superior, no con sembrar().catch(). `payload run` termina
// el proceso apenas el modulo deja de evaluarse.
try {
  await sembrar();
} catch (error) {
  console.error('Fallo la siembra del formulario:', error);
  process.exit(1);
}

process.exit(0);
