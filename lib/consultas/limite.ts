type Opciones = {
  maximo: number;
  ventanaMs: number;
  reloj?: () => number;
};

/**
 * Limite de envios por IP, en memoria.
 *
 * Alcanza porque la aplicacion corre en un unico proceso bajo pm2 en modo
 * fork. Si algun dia se pasa a varias instancias, esto deja de ser exacto y
 * hay que moverlo a la base o a un almacen compartido. El contador se pierde
 * al reiniciar, que es aceptable: el peor caso es que un spammer recupere sus
 * intentos despues de un deploy.
 */
export class LimitadorEnvios {
  private readonly maximo: number;
  private readonly ventanaMs: number;
  private readonly reloj: () => number;
  private registros = new Map<string, number[]>();

  constructor({ maximo, ventanaMs, reloj = Date.now }: Opciones) {
    this.maximo = maximo;
    this.ventanaMs = ventanaMs;
    this.reloj = reloj;
  }

  permitir(ip: string): boolean {
    const ahora = this.reloj();
    this.purgar(ahora);

    const intentos = (this.registros.get(ip) ?? []).filter(
      (momento) => ahora - momento < this.ventanaMs,
    );

    if (intentos.length >= this.maximo) {
      this.registros.set(ip, intentos);
      return false;
    }

    intentos.push(ahora);
    this.registros.set(ip, intentos);
    return true;
  }

  cantidadDeIpsEnMemoria(): number {
    return this.registros.size;
  }

  /** Evita que el mapa crezca sin limite con IPs que ya no importan. */
  private purgar(ahora: number): void {
    for (const [ip, intentos] of this.registros) {
      const vigentes = intentos.filter((momento) => ahora - momento < this.ventanaMs);
      if (vigentes.length === 0) {
        this.registros.delete(ip);
      } else {
        this.registros.set(ip, vigentes);
      }
    }
  }
}

/** Instancia compartida: 5 envios por hora y por IP. */
export const limitadorDeConsultas = new LimitadorEnvios({
  maximo: 5,
  ventanaMs: 60 * 60 * 1000,
});
