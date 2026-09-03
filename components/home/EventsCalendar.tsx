"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";


const EVENTS = [
  {
    date: "12",
    month: "MAR",
    title: "Expo Fabricantes",
    category: "Evento especial",
    location: "Urkupiña · La Salada",
    image: "/images/events/pasillos.jpg",
  },
  {
    date: "25",
    month: "JUN",
    title: "Encuentro Comercial",
    category: "Networking",
    location: "Centro Urkupiña",
    image: "/images/hero-real.jpg",
  },
  {
    date: "08",
    month: "NOV",
    title: "Gran Feria Anual",
    category: "Comunidad",
    location: "Buenos Aires",
    image: "/images/events/decenital.jpg",
  },
];


export default function Events() {

  return (

    <section
      id="eventos"
      className="
      relative
      overflow-hidden
      bg-[#243A60]
      section-lg
      scroll-mt-20
      "
    >


      {/* glow */}

      <div
        className="
        absolute
        left-0
        top-1/3
        h-[500px]
        w-[500px]
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
                Eventos
              </span>


            </div>



            <h2
              className="
              font-display
              text-[clamp(58px,8vw,120px)]
              uppercase
              leading-[.88]
              tracking-[-.05em]
              text-white
              "
            >

              Momentos

              <br />

              que conectan

            </h2>


          </div>



          <p
            className="
            max-w-md
            text-lg
            leading-8
            text-white/60
            "
          >

            Actividades, encuentros y experiencias
            donde fabricantes y comunidad comparten
            nuevas oportunidades.

          </p>


        </motion.div>





        {/* Events */}

        <div
          className="
          mt-16
          grid
          gap-8
          lg:grid-cols-3
          "
        >

          {EVENTS.map((event, index) => (


            <motion.article

              key={event.title}

              initial={{
                opacity: 0,
                y: 50
              }}

              whileInView={{
                opacity: 1,
                y: 0
              }}

              viewport={{
                once: true
              }}

              transition={{
                delay: index * .12
              }}

              className="
              group
              relative
              overflow-hidden
              rounded-[34px]
              "
            >


              <div
                className="
                relative
                aspect-[4/5]
                "
              >

                <Image

                  src={event.image}

                  alt={event.title}

                  fill

                  className="
                  object-cover
                  transition
                  duration-700
                  group-hover:scale-105
                  "

                />


              </div>



              {/* overlay */}

              <div
                className="
                absolute
                inset-0
                bg-gradient-to-t
                from-[#080B10]
                via-[#080B10]/40
                to-transparent
                "
              />




              {/* Date */}

              <div
                className="
                absolute
                left-7
                top-7
                flex
                h-20
                w-20
                flex-col
                items-center
                justify-center
                rounded-2xl
                bg-white
                text-[#243A60]
                "
              >

                <span
                  className="
                  font-display
                  text-4xl
                  leading-none
                  "
                >
                  {event.date}
                </span>


                <span
                  className="
                  text-xs
                  font-bold
                  tracking-[.2em]
                  "
                >
                  {event.month}
                </span>


              </div>




              {/* Content */}

              <div
                className="
                absolute
                bottom-0
                left-0
                w-full
                p-8
                "
              >


                <span
                  className="
                  text-xs
                  uppercase
                  tracking-[.3em]
                  text-[#EB2347]
                  "
                >
                  {event.category}
                </span>



                <h3
                  className="
                  mt-3
                  font-display
                  text-5xl
                  uppercase
                  leading-none
                  text-white
                  "
                >

                  {event.title}

                </h3>




                <div
                  className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-white/70
                  "
                >

                  <MapPin size={16} />

                  {event.location}

                </div>



                <Link

                  href="#"

                  className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-white
                  "

                >

                  Ver evento

                  <ArrowRight
                    size={16}
                    className="
                    transition
                    group-hover:translate-x-1
                    "
                  />

                </Link>



              </div>


            </motion.article>


          ))}


        </div>




        {/* Bottom CTA */}

        <div
          className="
          mt-14
          flex
          justify-center
          "
        >

          <Link

            href="#"

            className="
            inline-flex
            items-center
            gap-3
            rounded-full
            border
            border-white/20
            px-8
            py-4
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-white
            hover:text-[#243A60]
            "

          >

            Ver todos los eventos

            <CalendarDays size={18} />

          </Link>


        </div>


      </div>


    </section>

  );

}