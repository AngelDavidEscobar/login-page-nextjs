let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

// Tiempo de expiración en milisegundos (30 min)
const TOKEN_LIFETIME_MS = 30 * 60 * 1000;

import { obtenerToken } from "./authService";

export async function getValidToken(): Promise<string | null> {
  const now = Date.now();

 
  if (cachedToken && tokenExpiration && now < tokenExpiration) {
    return cachedToken;
  }

 
  const newToken = await obtenerToken();

  if (newToken) {
    cachedToken = newToken;
    tokenExpiration = now + TOKEN_LIFETIME_MS; 
    return cachedToken;
  } else {
    return null;
  }
}
