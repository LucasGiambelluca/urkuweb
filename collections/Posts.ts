import type { CollectionConfig } from 'payload';
import { revalidatePath } from 'next/cache';
import { completarFechaDePublicacion } from '../lib/contenido/publicacion';
import { aSlug } from '../lib/contenido/slug';

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt', 'updatedAt'],
  },
  labels: {
    singular: 'Nota',
    plural: 'Notas',
  },
  access: {
    read: ({ req }) => {
      // Si el usuario está autenticado en el admin, puede ver todo
      if (req.user) return true;
      // Lectura pública sólo para posts publicados
      return {
        status: {
          equals: 'published',
        },
      };
    },
  },
  hooks: {
    beforeChange: [
      // Una nota que sale publicada sin fecha queda con publishedAt en null, y
      // los nulos se ordenan antes que cualquier fecha: tapaban al resto de
      // las novedades en la home. Se completa con la fecha del momento.
      ({ data, originalDoc }) => completarFechaDePublicacion(data, originalDoc),
    ],
    afterChange: [
      async ({ doc }) => {
        // Ejecutar purga de caché cuando el post está publicado o se actualiza
        if (doc.status === 'published') {
          try {
            // 1. Purga de caché interna en Next.js App Router (ISR)
            revalidatePath('/novedades');
            if (doc.slug) {
              revalidatePath(`/novedades/${doc.slug}`);
            }
            revalidatePath(`/novedades/${doc.id}`);
            revalidatePath('/');
            console.log(`[Cache Revalidation] Caché purgada con éxito para slug: ${doc.slug || doc.id}`);
          } catch (err) {
            console.error('[Cache Revalidation Error] Error revalidando rutas:', err);
          }

          // 2. Disparo de Webhook de Vercel (si VERCEL_REVALIDATION_WEBHOOK_URL está configurada)
          const webhookUrl = process.env.VERCEL_REVALIDATION_WEBHOOK_URL;
          if (webhookUrl) {
            try {
              const res = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(process.env.VERCEL_REVALIDATION_TOKEN
                    ? { Authorization: `Bearer ${process.env.VERCEL_REVALIDATION_TOKEN}` }
                    : {}),
                },
                body: JSON.stringify({
                  event: 'post.published',
                  id: doc.id,
                  slug: doc.slug,
                  title: doc.title,
                  timestamp: new Date().toISOString(),
                }),
              });
              console.log(`[Vercel Webhook] Purga en Vercel enviada con status ${res.status}`);
            } catch (webhookErr) {
              console.error('[Vercel Webhook Error] Error llamando al webhook de Vercel:', webhookErr);
            }
          }
        }
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenido Principal',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Título del Artículo',
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              label: 'URL Slug',
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    const actual = typeof value === 'string' ? value.trim() : '';
                    if (actual !== '') return aSlug(actual);
                    // Si el editor no lo escribio, sale del titulo.
                    return data?.title ? aSlug(String(data.title)) : value;
                  },
                ],
              },
              admin: {
                description: 'Se completa solo a partir del titulo. Se usa en la direccion web de la nota.',
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              required: true,
              label: 'Categoría',
            },
            {
              name: 'featuredImage',
              type: 'relationship',
              relationTo: 'media',
              label: 'Imagen Destacada / Portada',
            },
            {
              name: 'isFeatured',
              type: 'checkbox',
              defaultValue: false,
              label: 'Destacar en Portada (Artículo Destacado)',
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              label: 'Cuerpo del Artículo (Editor tipo Medium / Notion)',
            },
          ],
        },
        {
          label: 'SEO & Publicación',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              label: 'Meta Título (SEO)',
              admin: {
                description: 'Título personalizado para motores de búsqueda (máx. 60 caracteres).',
              },
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              label: 'Meta Descripción (SEO)',
              admin: {
                description: 'Resumen descriptivo para resultados de Google (150 - 160 caracteres).',
              },
            },
            {
              name: 'status',
              type: 'select',
              label: 'Estado de publicación',
              defaultValue: 'draft',
              options: [
                { label: 'Borrador', value: 'draft' },
                { label: 'Publicado', value: 'published' },
              ],
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'publishedAt',
              type: 'date',
              label: 'Fecha de Publicación Programada',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                position: 'sidebar',
                description: 'Si asignás una fecha futura, se programará automáticamente.',
              },
            },
          ],
        },
      ],
    },
  ],
};
