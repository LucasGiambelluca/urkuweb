"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";


const institutional = [
  "Historia",
  "Sponsors",
  "Novedades",
  "Contacto",
];


const ecosystem = [
  "Fabricantes",
  "Mayoristas",
  "Logística & Envíos",
  "Horarios y Accesos",
];


export default function MegaFooter() {


  return (

    <footer
      id="footer"
      className="
      relative
      overflow-hidden
      bg-[#172d4c]
      text-white
      footer-spacing
      scroll-mt-20
      "
    >


      {/* Ambient light */}

      <div
        className="
        absolute
        -right-40
        top-0
        h-[500px]
        w-[500px]
        rounded-full
        bg-[#EB2347]/10
        blur-[180px]
        "
      />



      <div
        className="
        relative
        mx-auto
        max-w-7xl
        content-pad
        "
      >



        {/* Main */}

        <div
          className="
          grid
          gap-14
          lg:grid-cols-12
          "
        >




          {/* Brand */}

          <div
            className="
            lg:col-span-5
            "
          >


            <Link
              href="/"
              className="inline-block"
            >

              <Image

                src="/assets/logofooter.png"

                alt="Urkupiña S.A."

                width={150}

                height={150}

                className="
                h-32
                w-auto
                object-contain
                "
                unoptimized

              />

            </Link>




            <p
              className="
              mt-8
              max-w-md
              text-lg
              leading-8
              text-white/60
              "
            >

              El polo mayorista de fabricantes de
              indumentaria textil más influyente del país.
              Más de 30 años conectando talleres locales
              con comerciantes nacionales.

            </p>





            {/* Social */}

            <div
              className="
              mt-8
              flex
              gap-3
              "
            >

              <Social icon={<FaInstagram size={18} />} />

              <Social icon={<FaFacebookF size={18} />} />

              <Social icon={<FaYoutube size={18} />} />

            </div>


          </div>






          {/* Links */}

          <div
            className="
            grid
            gap-10
            sm:grid-cols-2
            lg:col-span-4
            "
          >



            <FooterColumn
              title="Institucional"
              links={institutional}
            />



            <FooterColumn
              title="Ecosistema Feria"
              links={ecosystem}
            />



          </div>






          {/* Contact + CTA */}

          <div
            className="
            space-y-8
            lg:col-span-3
            "
          >



            <div>

              <h4
                className="
                mb-6
                text-xs
                font-semibold
                uppercase
                tracking-[.35em]
                text-[#EB2347]
                "
              >
                Oficinas
              </h4>


              <ul
                className="
                space-y-5
                text-sm
                text-white/60
                "
              >


                <li
                  className="
                  flex
                  gap-3
                  "
                >

                  <MapPin
                    size={18}
                    className="mt-1 text-[#EB2347]"
                  />

                  <span>
                    Ruta Provincial 4 y Virgilio,
                    Lomas de Zamora,
                    Buenos Aires
                  </span>

                </li>



                <li
                  className="
                  flex
                  items-center
                  gap-3
                  "
                >

                  <Phone
                    size={18}
                    className="text-[#EB2347]"
                  />

                  +54 (11) 4285-8800

                </li>



                <li
                  className="
                  flex
                  items-center
                  gap-3
                  "
                >

                  <Mail
                    size={18}
                    className="text-[#EB2347]"
                  />

                  contacto@urkupina.com.ar

                </li>


              </ul>


            </div>





            {/* Advertising CTA */}

            <div
              className="
              rounded-[28px]
              border
              border-white/10
              bg-white/5
              p-6
              "
            >

              <h3
                className="
                font-display
                text-3xl
                uppercase
                leading-none
                "
              >

                Tu marca
                <br />
                en Urkupiña

              </h3>


              <p
                className="
                mt-3
                text-sm
                leading-6
                text-white/60
                "
              >

                Llegá a miles de fabricantes
                y comerciantes.

              </p>



              <Link

                href="#"

                className="
                mt-5
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#EB2347]
                px-5
                py-3
                text-sm
                font-semibold
                transition
                hover:bg-[#C41A3A]
                "

              >

                Publicitar

                <ArrowRight size={16} />

              </Link>


            </div>



          </div>




        </div>






        {/* Bottom */}

        <div
          className="
          flex
          flex-col
          gap-5
          border-t
          border-white/10
          py-8
          text-xs
          text-white/40
          md:flex-row
          md:items-center
          md:justify-between
          "
        >

          <p>
            © {new Date().getFullYear()} Urkupiña S.A.
            Todos los derechos reservados.
          </p>



          <div
            className="
            flex
            gap-6
            "
          >

            <Link
              href="#"
              className="hover:text-white transition"
            >
              Términos de Servicio
            </Link>


            <Link
              href="#"
              className="hover:text-white transition"
            >
              Políticas de Privacidad
            </Link>


          </div>


        </div>



      </div>


    </footer>

  );

}





function FooterColumn({
  title,
  links
}: {
  title: string;
  links: string[];
}) {


  return (

    <div>

      <h4
        className="
mb-6
text-xs
font-semibold
uppercase
tracking-[.35em]
text-[#EB2347]
"
      >
        {title}
      </h4>


      <ul
        className="
space-y-4
"
      >

        {links.map((link) => (

          <li key={link}>

            <Link

              href="#"

              className="
text-white/60
transition
hover:text-white
"

            >

              {link}

              {link === "Novedades" && (
                <ExternalLink
                  size={12}
                  className="
inline
ml-2
opacity-50
"
                />
              )}

            </Link>


          </li>


        ))}

      </ul>


    </div>

  )

}




function Social({
  icon
}: {
  icon: React.ReactNode
}) {

  return (

    <Link

      href="#"

      className="
flex
h-11
w-11
items-center
justify-center
rounded-full
border
border-white/10
text-white/60
transition
hover:border-[#EB2347]
hover:bg-[#EB2347]
hover:text-white
"

    >

      {icon}

    </Link>

  )

}