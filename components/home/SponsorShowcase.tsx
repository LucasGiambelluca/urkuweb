"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Handshake, Building2 } from "lucide-react";
import { motion } from "framer-motion";


export type SponsorVisible = {
  nombre: string;
  categoria: string;
  tamano: 'normal' | 'grande';
  logo: string;
  alt: string;
};

/**
 * Respaldo: es lo que habia hardcodeado antes de que los sponsors salieran de
 * la base. Se usa solo si la consulta falla, para que una caida de base no
 * deje la seccion vacia.
 */
const SPONSORS_RESPALDO: SponsorVisible[] = [
  { nombre: 'Commander Security', logo: '/images/sponsors/commandersecurity.png', categoria: 'Seguridad', tamano: 'grande', alt: 'Logo de Commander Security' },
  { nombre: 'Prosegur Seguridad', logo: '/images/sponsors/prosegur-vector-logo.png', categoria: 'Seguridad', tamano: 'grande', alt: 'Logo de Prosegur Seguridad' },
  { nombre: 'Acudir Emergencias', logo: '/images/sponsors/Acudir-01-1.png', categoria: 'Emergencias Medicas', tamano: 'normal', alt: 'Logo de Acudir Emergencias' },
  { nombre: 'Banco Provincia', logo: '/images/sponsors/Banco_Provincia_(Bs.As.,_2021).svg.webp', categoria: 'Banca Institucional', tamano: 'normal', alt: 'Logo de Banco Provincia' },
  { nombre: 'Banco Credicoop', logo: '/images/sponsors/creedicop.png', categoria: 'Banca Cooperativa', tamano: 'normal', alt: 'Logo de Banco Credicoop' },
];

const CLASES_POR_TAMANO: Record<SponsorVisible['tamano'], string> = {
  grande: 'max-h-24 sm:max-h-28 max-w-[90%]',
  normal: 'max-h-20 sm:max-h-24 max-w-[85%]',
};


export default function SponsorShowcase({ sponsors }: { sponsors?: SponsorVisible[] | null }) {
  // Si la consulta fallo (null) se usa el respaldo. Si devolvio una lista
  // vacia se respeta: puede ser que los hayan dado de baja a proposito.
  const lista = sponsors ?? SPONSORS_RESPALDO;

  return (

    <section
      id="sponsors"
      className="
      relative
      overflow-hidden
      bg-[#F8FAFC]
      dark:bg-[#080C14]
      section-lg
      scroll-mt-20
      transition-colors
      duration-300
      "
    >
      {/* Pattern texture: Crosses at right:0 outside grid */}
      <div className="absolute right-0 bottom-1/4 w-32 md:w-44 h-40 opacity-30 dark:opacity-15 pointer-events-none select-none z-0">
        <Image
          src="/images/masks/patron-cruces.png"
          alt=""
          fill
          // Tamano fijo por clases w-32/md:w-44, no crece con el viewport
          sizes="(min-width: 768px) 176px, 128px"
          className="object-contain object-right dark:invert"
        />
      </div>


      {/* Background */}

      <div
        className="
        absolute
        right-0
        top-0
        h-[500px]
        w-[500px]
        rounded-full
        bg-[#243A60]/10
        dark:bg-[#EB2347]/10
        blur-[160px]
        pointer-events-none
        "
      />


      <div className="mx-auto max-w-7xl content-pad relative">


        {/* Header */}

        <motion.div

          initial={{
            opacity: 0,
            y: 30
          }}

          whileInView={{
            opacity: 1,
            y: 0
          }}

          viewport={{
            once: true
          }}

          className="
          flex
          flex-col
          justify-between
          gap-8
          lg:flex-row
          lg:items-end
          "

        >

          <div>


            <div
              className="
              mb-6
              flex
              items-center
              gap-4
              "
            >

              <span
                className="
                h-[2px]
                w-12
                bg-[#EB2347]
                "
              />

              <span
                className="
                text-xs
                font-semibold
                uppercase
                tracking-[.35em]
                text-[#EB2347]
                "
              >
                Sponsors
              </span>

            </div>



            <h2 className="font-display text-[clamp(36px,4.5vw,72px)] sm:text-[clamp(42px,5vw,80px)] lg:text-[clamp(36px,3.8vw,56px)] xl:text-[clamp(44px,4.5vw,76px)] uppercase leading-[.9] tracking-[-.05em] text-foreground">
              Marcas que <br />
              <span className="relative inline-block text-[#EB2347]">
                nos acompañan
                <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-3 sm:h-5 pointer-events-none">
                  <Image
                    src="/images/masks/brush-stroke-4.png"
                    alt=""
                    fill
                    className="object-contain object-left filter drop-shadow-sm"
                  />
                </span>
              </span>
            </h2>


          </div>


          <p
            className="
            max-w-md
            text-lg
            leading-8
            text-muted
            "
          >

            Construimos vínculos con empresas que comparten
            nuestra visión de crecimiento, innovación y comunidad.

          </p>


        </motion.div>





        {/* Sponsors Grid */}

        <div
          className="
          mt-16
          grid
          gap-6
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-5
          "
        >

          {lista.map((item, index) => (

            <motion.div

              key={item.nombre}

              initial={{
                opacity: 0,
                y: 40
              }}

              whileInView={{
                opacity: 1,
                y: 0
              }}

              viewport={{
                once: true
              }}

              transition={{
                delay: index * .1
              }}

              className="
              group
              relative
              flex
              h-[240px]
              flex-col
              items-center
              justify-between
              overflow-hidden
              rounded-[28px]
              border
              border-slate-200/80
              dark:border-slate-700/60
              bg-white
              dark:bg-white
              p-6
              shadow-sm
              dark:shadow-md
              dark:shadow-black/30
              transition-all
              duration-500
              hover:-translate-y-2
              hover:border-[#EB2347]/40
              hover:shadow-2xl
              hover:shadow-[#EB2347]/10
              dark:hover:shadow-black/50
              "

            >

              {/* Ambient backdrop glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#243A60]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Centered Hero Logo */}
              <div
                className="
                relative
                flex
                w-full
                flex-1
                items-center
                justify-center
                px-2
                py-4
                "
              >

                <Image

                  src={item.logo}

                  alt={item.alt}

                  width={240}

                  height={110}

                  className={`
                  w-auto
                  object-contain
                  transition-all
                  duration-300
                  group-hover:scale-105
                  ${CLASES_POR_TAMANO[item.tamano]}
                  `}

                />

              </div>

              {/* Minimal Subtle Micro-Label */}
              <div className="mt-auto w-full border-t border-slate-100 pt-2.5 text-center">

                <p
                  className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[.2em]
                  text-slate-700
                  transition-colors
                  group-hover:text-slate-950
                  "
                >
                  {item.nombre}
                </p>

                <span
                  className="
                  mt-0.5
                  block
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[.15em]
                  text-[#EB2347]
                  "
                >
                  {item.categoria}
                </span>

              </div>

            </motion.div>

          ))}

        </div>





        {/* CTA */}

        <motion.div

          initial={{
            opacity: 0,
            y: 30
          }}

          whileInView={{
            opacity: 1,
            y: 0
          }}

          viewport={{
            once: true
          }}

          className="
          mt-12
          flex
          flex-col
          gap-6
          rounded-[36px]
          bg-[#243A60]
          dark:bg-[#16243E]
          border
          border-transparent
          dark:border-white/10
          p-8
          text-white
          lg:flex-row
          lg:items-center
          lg:justify-between
          lg:p-12
          shadow-xl
          "

        >

          <div
            className="
            flex
            items-center
            gap-5
            "
          >

            <div
              className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-white/10
              "
            >

              <Handshake size={32} />

            </div>


            <div>

              <h3
                className="
                font-display
                text-4xl
                uppercase
                "
              >
                ¿Querés ser sponsor?
              </h3>

              <p
                className="
                mt-2
                text-white/70
                "
              >
                Conectá tu marca con nuestra comunidad.

              </p>

            </div>


          </div>



          <Link

            href="#contacto"

            className="
            inline-flex
            items-center
            justify-center
            gap-3
            rounded-full
            bg-[#EB2347]
            px-8
            py-4
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#C41A3A]
            "

          >

            Contactar

            <ArrowRight size={18} />

          </Link>


        </motion.div>


      </div>


    </section>

  );

}