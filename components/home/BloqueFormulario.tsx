import Image from 'next/image';
import Formulario from '@/components/home/Formulario';
import type { CampoDeFormulario } from '@/lib/formularios/validacion';

export type FormularioVisible = {
  id: string | number;
  titulo: string;
  campos: CampoDeFormulario[];
  anchos: Record<string, number>;
  textoDelBoton: string;
  mensajeDeGracias: string;
  imagen?: { url: string; alt: string; ancho: number; alto: number };
  lado: 'izquierda' | 'derecha';
  ancla?: string;
};

/**
 * La seccion que muestra un formulario con una imagen al lado.
 *
 * Componente de servidor: la pagina ya consulto la definicion, aca solo se
 * arma el JSX. El formulario en si es de cliente porque maneja el envio.
 */
export default function BloqueFormulario({ formulario }: { formulario: FormularioVisible }) {
  const { imagen } = formulario;

  return (
    <section
      id={formulario.ancla || undefined}
      className="relative section-lg scroll-mt-20"
      aria-label={formulario.titulo}
    >
      <div className="mx-auto max-w-7xl content-pad">
        <h2 className="mb-12 font-display text-[clamp(36px,5vw,72px)] uppercase leading-[.9] tracking-[-.05em] text-foreground">
          {formulario.titulo}
        </h2>

        <div
          className={`flex flex-col gap-12 lg:flex-row lg:items-start ${
            formulario.lado === 'derecha' ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {imagen ? (
            <div className="w-full lg:w-1/2">
              <Image
                src={imagen.url}
                alt={imagen.alt}
                width={imagen.ancho}
                height={imagen.alto}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full rounded-[30px]"
              />
            </div>
          ) : null}

          <div className={imagen ? 'w-full lg:w-1/2' : 'w-full'}>
            <Formulario
              id={formulario.id}
              campos={formulario.campos}
              anchos={formulario.anchos}
              textoDelBoton={formulario.textoDelBoton}
              mensajeDeGracias={formulario.mensajeDeGracias}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
