"use client";

import MaskedImage from "@/components/ui/MaskedImage";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Props {
    image: string;
    title: string;
    subtitle: string;
    href: string;
    maskSrc?: string;
}

export default function ImageCard({
    image,
    title,
    subtitle,
    href,
    maskSrc = "/images/masks/maskelements.png",
}: Props) {
    return (
        <Link
            href={href}
            className="group relative overflow-hidden rounded-[30px]"
        >
            <MaskedImage
                src={image}
                alt={title}
                fill
                wrapperClassName="aspect-[4/5]"
                imageClassName="object-cover transition duration-700 group-hover:scale-105"
                maskSrc={maskSrc}
            />

            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(to top,#101214 5%,rgba(16,18,20,.82) 22%,rgba(16,18,20,.25) 52%,transparent)"
                }}
            />

            <div className="absolute bottom-0 p-8">

                <span className="mb-3 block text-xs uppercase tracking-[.35em] text-white/70">

                    {subtitle}

                </span>

                <h3 className="font-display text-5xl uppercase leading-none text-white">

                    {title}

                </h3>

                <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#EB2347] transition group-hover:translate-x-1 group-hover:-translate-y-1">

                    <ArrowUpRight
                        size={20}
                        className="text-white"
                    />

                </div>

            </div>

        </Link>
    );
}