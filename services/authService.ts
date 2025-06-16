import { AuthRequestBody, AuthResponse } from "../types/api";

const AUTH_URL = "https://marketplacepruebas.aportesenlinea.com/Transversales.Servicios.Fachada/api/ControlAcceso/Autenticar";

export async function obtenerToken(): Promise<string | null> {
    
  try {
    const requestBody: AuthRequestBody = {
      data: [
        {
          NombreUsuario: "N800223206",
          Aplicacion: "E2271FA7-0FCA-4293-BF6D-53414286FDB0",
          Password: "Bienestar2025%",
        },
      ],
    };

    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) throw new Error("Error al obtener el token");

    const data: AuthResponse = await response.json();

    return data?.data || null;

  } catch (error) {
    console.error("Error autenticando:", error);
    return null;
  }
}
