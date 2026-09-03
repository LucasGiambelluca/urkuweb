"use client";

import Image from "next/image";
import MaskedImage from "@/components/ui/MaskedImage";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
    {
        title: "Fabricantes",
        category: "Industria",
        image: "/images/fabricantes.jpg",
        href: "#",
        size: "large",
    },
    {
        title: "Eventos",
        category: "Agenda",
        image: "/images/eventos.jpg",
        href: "#",
        size: "small",
    },
    {
        title: "Streaming",
        category: "En Vivo",
        image: "/images/streaming.jpg",
        href: "#",
        size: "small",
    },
    {
        title: "Sponsors",
        category: "Empresas",
        image: "/images/sponsors.jpg",
        href: "#",
        size: "wide",
    },
];

export default function FeatureGrid() {
    return (
        <section id="caracteristicas" className="relative overflow-hidden bg-neutral-950 section-lg scroll-mt-20">
            {/* Pattern texture: Diagonal lines at right:0 outside grid */}
            <div className="absolute right-0 top-1/3 w-32 md:w-44 h-40 opacity-30 pointer-events-none select-none z-0">
                <Image
                    src="/images/masks/patron-lineas.png"
                    alt=""
                    fill
                    className="object-contain object-right filter invert"
                />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl content-pad">

                <div className="mb-16">

                    <div className="mb-6 flex items-center gap-4">
                        <span className="h-[2px] w-12 bg-[#EB2347]" />
                        <span className="text-xs font-semibold uppercase tracking-[.35em] text-[#EB2347]">
                            Descubrí Urkupiña
                        </span>
                    </div>

                    <h2 className="mt-4 font-display text-[clamp(58px,7vw,120px)] uppercase leading-[.88] tracking-[-.04em] text-white">
                        Mucho más que <br />
                        <span className="relative inline-block text-[#EB2347]">
                            un mercado
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

                <div className="grid grid-cols-12 gap-8">

                    {FEATURES.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 80 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * .12,
                                duration: .6,
                            }}
                            className={
                                item.size === "large"
                                    ? "col-span-12 lg:col-span-7"
                                    : item.size === "wide"
                                        ? "col-span-12 lg:col-span-12"
                                        : "col-span-12 md:col-span-6 lg:col-span-5"
                            }
                        >
                            <Card {...item} />
                        </motion.div>
                    ))}
                </div>

            </div>

        </section>
    );
}

function Card({
    title,
    category,
    image,
    href,
    size,
}: any) {
    return (
        <Link
            href={href}
            className={`group relative block overflow-hidden rounded-[34px]
      ${size === "large"
                    ? "h-[720px]"
                    : size === "wide"
                        ? "h-[420px]"
                        : "h-[350px]"
                }`}
        >
            <MaskedImage
                src={image}
                fill
                alt={title}
                wrapperClassName="absolute inset-0 w-full h-full"
                imageClassName="object-cover transition duration-700 group-hover:scale-105"
                maskSrc="/images/masks/maskelements.png"
            />

            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(15,19,24,.35) 55%,rgba(15,19,24,.92) 100%)",
                }}
            />

            <div className="absolute left-10 bottom-10">

                <span className="mb-4 inline-block rounded-full bg-white/10 backdrop-blur px-4 py-2 text-xs uppercase tracking-[.3em] text-white">

                    {category}

                </span>

                <h3 className="font-display text-[clamp(42px,4vw,72px)] uppercase leading-none text-white">

                    {title}

                </h3>

            </div>

            <div className="absolute right-10 bottom-10">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EB2347] transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">

                    <ArrowUpRight
                        size={22}
                        className="text-white"
                    />

                </div>

            </div>

        </Link>
    );
}