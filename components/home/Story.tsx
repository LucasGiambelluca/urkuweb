"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import type { NumerosDelPredio } from "@/lib/contenido/tipos";


export default function Story({ numeros }: { numeros: NumerosDelPredio }) {

  return (

    <section
      id="historia"
      className="
      relative
      overflow-hidden
      bg-[#F6F8FC]
      dark:bg-[#080C14]
      section-lg
      scroll-mt-20
      transition-colors
      duration-300
      "
    >
      {/* Pattern texture: Red dots halftone at left:0 outside grid */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 md:w-44 h-44 opacity-40 dark:opacity-20 pointer-events-none select-none z-0">
        <Image
          src="/images/masks/halftone.svg"
          alt=""
          fill
          className="object-contain object-left dark:invert"
        />
      </div>


      <div className="mx-auto max-w-7xl content-pad">


        {/* Main grid */}

        <div
          className="
          grid
          items-center
          gap-8
          lg:grid-cols-12
          "
        >



          {/* Text */}

          <motion.div

            initial={{
              opacity: 0,
              x: -40
            }}

            whileInView={{
              opacity: 1,
              x: 0
            }}

            viewport={{
              once: true
            }}

            className="
            lg:col-span-5
            "
          >



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

                Nuestra historia

              </span>


            </div>





            <h2 className="font-display text-[clamp(36px,4.5vw,72px)] sm:text-[clamp(42px,5vw,80px)] lg:text-[clamp(36px,3.8vw,56px)] xl:text-[clamp(44px,4.5vw,76px)] uppercase leading-[.88] tracking-[-.05em] text-foreground">
              Cuna de <br />
              <span className="relative inline-block text-[#EB2347]">
                fabricantes
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





            <p
              className="
              mt-8
              text-lg
              leading-8
              text-muted
              "
            >

              Urkupiña nació como un punto de encuentro
              entre fabricantes y comerciantes,
              transformándose con el tiempo en uno de
              los principales ecosistemas productivos
              textiles de Argentina.

            </p>




            <p
              className="
              mt-5
              text-base
              leading-7
              text-muted
              "
            >

              Una comunidad construida sobre trabajo,
              innovación y la fuerza de miles de familias
              que forman parte de esta historia.

            </p>





            <div className="mt-8">
              <Button variant="secondary" href="#impacto">
                <span>Conocer más</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </div>

          </motion.div>







          {/* Image composition */}

          <motion.div

            initial={{
              opacity: 0,
              x: 40
            }}

            whileInView={{
              opacity: 1,
              x: 0
            }}

            viewport={{
              once: true
            }}

            className="
            relative
            lg:col-span-7
            "
          >


            {/* Main image */}
            <div className="relative aspect-[4/5] overflow-hidden site-image">
              <Image
                src="/images/histor.png"
                alt="Historia Urkupiña"
                fill
                className="site-image object-cover transition duration-700 hover:scale-105"
              />
            </div>






            {/* Floating card */}

            <div
              className="
              absolute
              -bottom-8
              -left-8
              hidden
              rounded-[28px]
              bg-[#243A60]
              dark:bg-[#16243E]
              border
              border-transparent
              dark:border-white/10
              p-8
              text-white
              transition-all
              duration-300
              hover:shadow-xl
              md:block
              "
            >

              <span
                className="
                font-display
                text-7xl
                leading-none
                "
              >

                {numeros.aniosTrayectoria}

              </span>


              <p
                className="
                mt-2
                text-sm
                font-semibold
                uppercase
                tracking-[.3em]
                text-white/80
                "
              >

                Años de historia

              </p>


            </div>






            {/* Red accent */}

            <div
              className="
              absolute
              -right-6
              -top-6
              hidden
              h-32
              w-32
              rounded-full
              bg-[#EB2347]
              lg:block
              "
            />


          </motion.div>



        </div>



      </div>



    </section>

  );

}