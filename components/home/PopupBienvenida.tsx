'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { esEnlaceExterno, type PopupVisible } from '@/lib/contenido/popup';

/** Lo que el atrapador de foco considera alcanzable con Tab. */
const ALCANZABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * El aviso que aparece al abrir la portada.
 *
 * Arranca abierto y se renderiza tambien en el servidor, para que no aparezca
 * de golpe una vez que la pagina ya se veia. El costo de eso es que sin
 * JavaScript el boton de cerrar no responde, asi que un <noscript> lo oculta:
 * quien no tenga JavaScript se pierde una promocion, no el sitio.
 */
export default function PopupBienvenida({ popup }: { popup: PopupVisible }) {
  const [abierto, setAbierto] = useState(true);
  const dialogoRef = useRef<HTMLDivElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const focoPrevio = useRef<HTMLElement | null>(null);
  // El click en el fondo cierra, pero solo si ahi empezo. Si el visitante
  // apreta sobre la imagen y suelta afuera (un temblor de trackpad alcanza),
  // el navegador despacha el click sobre el ancestro comun, que es el fondo:
  // sin esta guarda el popup se cerraria sin que nadie lo pidiera.
  const empezoEnElFondo = useRef(false);

  const cerrar = useCallback(() => setAbierto(false), []);

  useEffect(() => {
    if (!abierto) return;

    focoPrevio.current = document.activeElement as HTMLElement | null;
    cerrarRef.current?.focus();

    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        cerrar();
        return;
      }
      if (evento.key !== 'Tab' || !dialogoRef.current) return;

      // Atrapa el foco: mientras el modal esta abierto, Tab no se escapa a la
      // pagina de atras, que para el visitante esta tapada.
      const focos = [...dialogoRef.current.querySelectorAll<HTMLElement>(ALCANZABLES)];
      if (focos.length === 0) return;

      const primero = focos[0];
      const ultimo = focos[focos.length - 1];

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener('keydown', alTeclear);
    const desbordeOriginal = document.body.style.overflow;
    const rellenoOriginal = document.body.style.paddingRight;
    // Al ocultar la barra de scroll la pagina se corre hacia la derecha. Se
    // compensa con el mismo ancho que la barra ocupaba.
    const anchoDeLaBarra = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (anchoDeLaBarra > 0) {
      document.body.style.paddingRight = `${anchoDeLaBarra}px`;
    }

    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = desbordeOriginal;
      document.body.style.paddingRight = rellenoOriginal;
      focoPrevio.current?.focus?.();
    };
  }, [abierto, cerrar]);

  if (!abierto) return null;

  const imagen = (
    <Image
      src={popup.imagen}
      alt={popup.alt}
      width={popup.ancho}
      height={popup.alto}
      sizes="(max-width: 960px) 92vw, 900px"
      priority
      className="h-auto w-full rounded-2xl"
    />
  );

  const externo = popup.enlace ? esEnlaceExterno(popup.enlace) : false;

  return (
    <>
      {/* Sin JavaScript el boton de cerrar no responde: mejor no mostrarlo. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: '<style>#popup-bienvenida{display:none!important}</style>',
        }}
      />

      <div
        id="popup-bienvenida"
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onMouseDown={(evento) => {
          empezoEnElFondo.current = evento.target === evento.currentTarget;
        }}
        onClick={() => {
          if (empezoEnElFondo.current) cerrar();
        }}
      >
        <div
          ref={dialogoRef}
          role="dialog"
          aria-modal="true"
          aria-label="Aviso"
          // El click en la imagen no tiene que cerrar el modal; el del fondo si.
          onClick={(evento) => evento.stopPropagation()}
          className="relative w-full max-w-[900px]"
        >
          {popup.enlace ? (
            <a
              href={popup.enlace}
              target={externo ? '_blank' : undefined}
              rel={externo ? 'noopener noreferrer' : undefined}
              // Un ancla del sitio navega por debajo del modal: si no se
              // cierra, el visitante no ve a donde lo llevo.
              onClick={externo ? undefined : cerrar}
              className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2"
            >
              {imagen}
            </a>
          ) : (
            imagen
          )}

          <button
            ref={cerrarRef}
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
            className="absolute -right-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#0E1626] text-white shadow-xl transition hover:bg-[#EB2347] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
}
