import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// El nombre de la función exportada DEBE ser proxy de forma obligatoria
export async function proxy(req: any) {
  const res = NextResponse.next();
  
  // Tu configuración de Supabase SSR aquí...
  
  return res;
}
