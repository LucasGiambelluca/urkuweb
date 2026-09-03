"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

export default function ContactSection() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "General",
    mensaje: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre y apellido son obligatorios.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresá un correo electrónico válido.";
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje no puede estar vacío.";
    } else if (formData.mensaje.trim().length < 10) {
      newErrors.mensaje = "El mensaje debe contener al menos 10 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setStatus("error");
      return;
    }

    setStatus("submitting");

    // Simulate API request submission
    setTimeout(() => {
      setStatus("success");
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "General",
        mensaje: "",
      });
      setErrors({});
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  return (
    <section
      id="contacto"
      className="relative overflow-hidden  section-lg scroll-mt-20 "
      aria-label="Formulario de contacto oficial de Urkupiña"
    >
      {/* Background ambient glow */}
      <div
        className="absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full bg-[#243A60]/10 dark:bg-[#243A60]/20 blur-[170px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute right-0 bottom-10 h-[500px] w-[500px] rounded-full bg-[#EB2347]/10 blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl content-pad relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-[2px] w-12 bg-[#EB2347]" />
            <span className="text-xs font-semibold uppercase tracking-[.35em] text-[#EB2347]">
              Contacto Directo
            </span>
          </div>

          <h2 className="font-display text-[clamp(44px,6vw,90px)] uppercase leading-[.9] tracking-[-.04em] text-foreground">
            <span className="relative inline-block text-[#EB2347]">
              Escribinos
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

          <p className="mt-4 max-w-2xl text-lg md:text-xl font-normal text-muted leading-relaxed">
            Ponete en contacto con el equipo oficial de Urkupiña. Estamos para ayudarte.
          </p>
        </motion.div>

        {/* 2-Column Main Layout: Form Left (60% / 7 cols), Info Right (40% / 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* FORM COLUMN (Left 60% / 7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="rounded-[32px] border border-border-subtle bg-white dark:bg-[#0E1626] p-6 md:p-10 transition-all duration-300 hover:shadow-xl">
              <form onSubmit={handleSubmit} noValidate className="space-y-5">

                {/* Nombre field */}
                <div>
                  <label htmlFor="contact-nombre" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                    Nombre y Apellido <span className="text-[#EB2347]">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.nombre}
                    aria-describedby={errors.nombre ? "nombre-error" : undefined}
                    placeholder="Ej. María Fernández"
                    className={`w-full rounded-2xl border bg-white/50 dark:bg-white/[0.04] px-4 py-3.5 text-sm text-foreground placeholder:text-muted transition-all focus:outline-none focus:ring-2 ${errors.nombre
                      ? "border-red-500 focus:ring-red-500/30"
                      : "border-border-subtle focus:border-[#EB2347] focus:ring-[#EB2347]/20"
                      }`}
                  />
                  {errors.nombre && (
                    <p id="nombre-error" className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
                      <AlertCircle size={13} aria-hidden="true" />
                      {errors.nombre}
                    </p>
                  )}
                </div>

                {/* Grid for Email & Teléfono */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email field */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                      Correo Electrónico <span className="text-[#EB2347]">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      placeholder="maria@ejemplo.com"
                      className={`w-full rounded-2xl border bg-white/50 dark:bg-white/[0.04] px-4 py-3.5 text-sm text-foreground placeholder:text-muted transition-all focus:outline-none focus:ring-2 ${errors.email
                        ? "border-red-500 focus:ring-red-500/30"
                        : "border-border-subtle focus:border-[#EB2347] focus:ring-[#EB2347]/20"
                        }`}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
                        <AlertCircle size={13} aria-hidden="true" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Teléfono field */}
                  <div>
                    <label htmlFor="contact-telefono" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                      Teléfono / WhatsApp <span className="text-muted font-medium text-xs">(Opcional)</span>
                    </label>
                    <input
                      type="tel"
                      id="contact-telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="11 2345-6789"
                      className="w-full rounded-2xl border border-border-subtle bg-white/50 dark:bg-white/[0.04] px-4 py-3.5 text-sm text-foreground placeholder:text-muted transition-all focus:border-[#EB2347] focus:outline-none focus:ring-2 focus:ring-[#EB2347]/20"
                    />
                  </div>
                </div>

                {/* Asunto field */}
                <div>
                  <label htmlFor="contact-asunto" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                    Asunto de la Consulta <span className="text-[#EB2347]">*</span>
                  </label>
                  <select
                    id="contact-asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-border-subtle bg-white/50 dark:bg-white/[0.04] px-4 py-3.5 text-sm text-foreground transition-all focus:border-[#EB2347] focus:outline-none focus:ring-2 focus:ring-[#EB2347]/20"
                  >
                    <option value="General" className="bg-white dark:bg-[#0E1626] text-foreground">Consulta General</option>
                    <option value="Alquiler" className="bg-white dark:bg-[#0E1626] text-foreground">Alquiler de Puesto</option>
                    <option value="Publicidad" className="bg-white dark:bg-[#0E1626] text-foreground">Publicidad & Anunciantes</option>
                    <option value="Visita" className="bg-white dark:bg-[#0E1626] text-foreground">Información de Visita & Horarios</option>
                    <option value="Otro" className="bg-white dark:bg-[#0E1626] text-foreground">Otro Asunto</option>
                  </select>
                </div>

                {/* Mensaje field */}
                <div>
                  <label htmlFor="contact-mensaje" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                    Mensaje <span className="text-[#EB2347]">*</span>
                  </label>
                  <textarea
                    id="contact-mensaje"
                    name="mensaje"
                    rows={4}
                    value={formData.mensaje}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.mensaje}
                    aria-describedby={errors.mensaje ? "mensaje-error" : undefined}
                    placeholder="Escribí aquí tu mensaje o consulta..."
                    className={`w-full rounded-2xl border bg-white/50 dark:bg-white/[0.04] px-4 py-3.5 text-sm text-foreground placeholder:text-muted transition-all focus:outline-none focus:ring-2 resize-none ${errors.mensaje
                      ? "border-red-500 focus:ring-red-500/30"
                      : "border-border-subtle focus:border-[#EB2347] focus:ring-[#EB2347]/20"
                      }`}
                  />
                  {errors.mensaje && (
                    <p id="mensaje-error" className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
                      <AlertCircle size={13} aria-hidden="true" />
                      {errors.mensaje}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#EB2347] px-9 py-4 text-base font-semibold text-white shadow-xl shadow-[#EB2347]/25 transition-all hover:scale-105 hover:bg-[#C41A3A] focus:outline-none focus:ring-2 focus:ring-[#EB2347] focus:ring-offset-2 disabled:opacity-60 cursor-pointer"
                  >
                    <Send size={18} aria-hidden="true" />
                    {status === "submitting" ? "Enviando mensaje..." : "Enviar mensaje"}
                  </button>
                </div>

                {/* Live Feedback Region for Accessibility */}
                <div aria-live="polite" className="mt-3">
                  {status === "success" && (
                    <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={20} className="shrink-0" />
                      <span>Mensaje enviado. Te responderemos a la brevedad.</span>
                    </div>
                  )}

                  {status === "error" && Object.keys(errors).length > 0 && (
                    <div className="flex items-center gap-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm font-semibold text-red-600 dark:text-red-400">
                      <AlertCircle size={20} className="shrink-0" />
                      <span>Por favor, corregí los campos indicados antes de enviar.</span>
                    </div>
                  )}
                </div>

              </form>
            </div>
          </motion.div>

          {/* CONTACT INFO COLUMN (Right 40% / 5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Info Card */}
            <div className="rounded-[32px] border border-border-subtle bg-white dark:bg-[#0E1626] p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
              <h3 className="font-display text-2xl uppercase tracking-tight text-foreground mb-6">
                Información de Contacto
              </h3>

              <div className="space-y-6">
                {/* Dirección */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EB2347]/10 text-[#EB2347] shrink-0 mt-0.5">
                    <MapPin size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">Dirección Predio</span>
                    <p className="text-sm font-semibold text-foreground mt-0.5 leading-snug">
                      René Gonzalo Rojas Paz, Ingeniero Budge, Provincia de Buenos Aires, Argentina
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#243A60]/10 dark:bg-white/10 text-[#243A60] dark:text-white shrink-0 mt-0.5">
                    <Mail size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">Correo Electrónico</span>
                    <a
                      href="mailto:contacto.urku@gmail.com"
                      className="text-sm font-semibold text-foreground hover:text-[#EB2347] transition-colors mt-0.5 block"
                    >
                      contacto.urku@gmail.com
                    </a>
                  </div>
                </div>

                {/* Teléfono */}
                {/* WhatsApp & Teléfono */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/20">
                    <MessageCircle size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">
                      Atención Directa & WhatsApp
                    </span>
                    <a
                      href="https://wa.me/541124240338?text=Hola%20Feria%20Urkupi%C3%B1a%2C%20quisiera%20realizar%20una%20consulta."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mt-0.5 inline-flex items-center gap-2 group"
                    >
                      <span>+54 11 2424-0338</span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        WhatsApp Web ↗
                      </span>
                    </a>
                    <span className="text-xs text-muted block mt-1">
                      Atención comercial y consultas generales por WhatsApp.
                    </span>
                  </div>
                </div>

                {/* Horarios */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    <Clock size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">Horario comercial</span>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      Lunes, miércoles y sábado de 7:00 a 14:00 hs.
                    </p>

                  </div>
                </div>
              </div>

              {/* Social Networks Bar */}
              <div className="mt-8 pt-6 border-t border-border-subtle">
                <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-3">
                  Redes Sociales Oficiales
                </span>

                <div className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/urkupina.s.a/?hl=es"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram oficial de Urkupiña"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#EB2347] bg-[#EB2347] text-white shadow-md shadow-[#EB2347]/20 transition-all hover:bg-transparent hover:text-[#EB2347] hover:shadow-none focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2"
                  >
                    <InstagramIcon aria-hidden="true" />
                  </a>

                  <a
                    href="https://www.facebook.com/urkupinaSA/?locale=es_LA"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook oficial de Urkupiña"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#EB2347] bg-[#EB2347] text-white shadow-md shadow-[#EB2347]/20 transition-all hover:bg-transparent hover:text-[#EB2347] hover:shadow-none focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2"
                  >
                    <FacebookIcon aria-hidden="true" />
                  </a>

                  <a
                    href="https://youtube.com/@ULIVE_STREAM"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Canal ULIVE Stream de Urkupiña"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#EB2347] bg-[#EB2347] text-white shadow-md shadow-[#EB2347]/20 transition-all hover:bg-transparent hover:text-[#EB2347] hover:shadow-none focus-visible:ring-2 focus-visible:ring-[#EB2347] focus-visible:ring-offset-2"
                  >
                    <YoutubeIcon aria-hidden="true" />
                  </a>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
