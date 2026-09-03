"use client";

import { motion } from "framer-motion";
import {
  Factory,
  Users,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
} from "lucide-react";


const MILESTONES = [
  {
    icon: Factory,
    number: "2200+",
    title: "Puestos",
    description:
      "Espacios comerciales donde fabricantes y emprendedores desarrollan sus negocios.",
  },
  {
    icon: Users,
    number: "5000+",
    title: "Personas",
    description:
      "Una comunidad productiva formada por trabajadores, familias y comerciantes.",
  },
  {
    icon: BriefcaseBusiness,
    number: "25+",
    title: "Años",
    description:
      "Experiencia construyendo oportunidades dentro de la industria nacional.",
  },
  {
    icon: CalendarDays,
    number: "365",
    title: "Días",
    description:
      "Actividad permanente conectando producción y comercio.",
  },
];


export default function Milestones() {

  return (

    <section
      id="hitos"
      className="
      relative
      overflow-hidden
      bg-[#F7F7F5]
      section-lg
      scroll-mt-20
      "
    >


      {/* Decorative */}

      <div
        className="
        absolute
        left-0
        top-1/2
        h-[500px]
        w-[500px]
        -translate-y-1/2
        rounded-full
        bg-[#EB2347]/10
        blur-[160px]
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

          className="max-w-4xl"

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
              En números
            </span>

          </div>


          <h2
            className="
            font-display
            text-[clamp(56px,7vw,110px)]
            uppercase
            leading-[.9]
            tracking-[-.05em]
            text-foreground
            "
          >

            Una fuerza

            <br />

            productiva

          </h2>


        </motion.div>




        {/* Cards */}

        <div
          className="
          mt-16
          grid
          gap-8
          sm:grid-cols-2
          lg:grid-cols-4
          "
        >


          {MILESTONES.map((item, index) => {

            const Icon = item.icon;


            return (

              <motion.article

                key={item.title}

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
                overflow-hidden
                rounded-[30px]
                border
                border-border-subtle
                bg-white
                dark:bg-[#0E1626]
                p-8
                transition
                duration-500
                hover:-translate-y-2
                hover:shadow-2xl
                "

              >


                {/* Icon */}

                <div
                  className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#243A60]/10
                  text-[#243A60]
                  transition
                  duration-300
                  group-hover:bg-[#EB2347]
                  group-hover:text-white
                  "
                >

                  <Icon size={30} />

                </div>



                {/* Number */}

                <div
                  className="
                  mt-10
                  font-display
                  text-[76px]
                  leading-none
                  tracking-tight
                  text-[#243A60]
                  "
                >

                  {item.number}

                </div>



                <h3
                  className="
                  mt-3
                  font-display
                  text-4xl
                  uppercase
                  leading-none
                  text-foreground
                  "
                >

                  {item.title}

                </h3>



                <p
                  className="
                  mt-5
                  text-sm
                  leading-6
                  text-muted
                  "
                >

                  {item.description}

                </p>



                {/* Bottom accent */}

                <div
                  className="
                  absolute
                  bottom-0
                  left-0
                  h-1
                  w-0
                  bg-[#EB2347]
                  transition-all
                  duration-500
                  group-hover:w-full
                  "
                />


              </motion.article>

            )

          })}


        </div>



        {/* Location strip */}

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
          mt-16
          flex
          flex-col
          items-center
          justify-between
          gap-5
          rounded-[28px]
          bg-[#243A60]
          px-8
          py-8
          text-white
          md:flex-row
          "

        >

          <div className="flex items-center gap-4">

            <div
              className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-white/10
              "
            >

              <MapPin size={22} />

            </div>


            <div>

              <p className="text-sm text-white/60">
                Ubicación
              </p>

              <p className="font-semibold">
                La Salada · Buenos Aires
              </p>

            </div>

          </div>



          <p
            className="
            max-w-xl
            text-sm
            leading-6
            text-white/70
            "
          >
            Un punto estratégico donde convergen producción,
            innovación y comercio.
          </p>


        </motion.div>


      </div>


    </section>

  );

}