import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";

import ExpoExperience from "@/components/expo/ExpoExperience";
import Navbar from "@/components/layout/Navbar";
import SiteFooter from "@/components/layout/SiteFooter";
import { CONTACTO_RESPALDO } from "@/lib/contenido/tipos";
import { textoPlano } from "@/lib/contenido/novedades";
import type { CampoDeFormulario } from "@/lib/formularios/validacion";

export const metadata: Metadata = {
  title: "EXPO URKU 2026 | Urkupiña",
  description: "Ronda de negocios 2026 dentro del ecosistema comercial de Urkupiña.",
};

async function obtenerFormularioExpo() {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "forms",
      where: { title: { equals: "Inscripción de expositores EXPOURKU" } },
      limit: 1,
      depth: 0,
    });
    const form = docs[0];
    if (!form) return null;

    const campos = (form.fields ?? []) as unknown as (CampoDeFormulario & { width?: number | null })[];
    return {
      id: form.id,
      campos,
      anchos: Object.fromEntries(campos.map((campo) => [campo.name, campo.width ?? 100])),
      textoDelBoton: form.submitButtonLabel || "Quiero participar",
      mensajeDeGracias: textoPlano(form.confirmationMessage as never) || "¡Gracias! Recibimos tus datos.",
    };
  } catch (error) {
    console.error("[expo-urku] no se pudo leer el formulario:", error);
    return null;
  }
}

export default async function ExpoUrku2026() {
  const formulario = await obtenerFormularioExpo();

  return (
    <>
      <Navbar />
      <ExpoExperience formulario={formulario} />
      <SiteFooter contacto={CONTACTO_RESPALDO} />
    </>
  );
}
