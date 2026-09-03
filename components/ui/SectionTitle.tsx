"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
    eyebrow?: string;
    title: string;
    highlight?: string;
    description?: string;
    align?: "left" | "center";
}

export default function SectionTitle({
    eyebrow,
    title,
    highlight,
    description,
    align = "left",
}: SectionTitleProps) {
    return (
        <div
            className={`max-w-4xl ${align === "center" ? "mx-auto text-center" : ""
                }`}
        >
            {eyebrow && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-5 inline-flex items-center gap-3"
                >
                    <span className="h-[2px] w-10 bg-[#EB2347]" />

                    <span className="text-xs uppercase tracking-[.35em] text-[#EB2347] font-semibold">
                        {eyebrow}
                    </span>
                </motion.div>
            )}

            <motion.h2
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: .1 }}
                className="font-display uppercase leading-[.9] tracking-[-.04em]
        text-[clamp(52px,7vw,110px)]"
            >
                {title}

                {highlight && (
                    <>
                        <br />

                        <span className="text-[#EB2347]">
                            {highlight}
                        </span>
                    </>
                )}
            </motion.h2>

            {description && (
                <motion.p
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: .2 }}
                    className="mt-8 max-w-2xl text-lg leading-8 text-muted"
                >
                    {description}
                </motion.p>
            )}
        </div>
    );
}