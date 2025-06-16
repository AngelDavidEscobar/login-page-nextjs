import { getValidToken } from "./tokenManager";
import { PersonaRequestBody, PersonaResponse } from "../types/api";


const PERSONA_URL = "https://marketplacepruebas.aportesenlinea.com/Transversales.Servicios.Fachada/api/Persona/ConsultarPersonaEnBaseDatosReferencia";

export async function consultarPersona(tipoDocumento: string, numeroDocumento: string): Promise<PersonaResponse | null> {
    
  try {
    const token = await getValidToken();
    if (!token) throw new Error("No se pudo obtener el token");

    const requestBody: PersonaRequestBody = {
      data: [
        {
          TipoDocumento: tipoDocumento,
          NumeroDocumento: numeroDocumento,
        },
      ],
    };
    
    const response = await fetch(PERSONA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: `${token}`,
      },
      body: JSON.stringify(requestBody),
    });
    
   // if (!response.ok) throw new Error("Error consultando la persona");

    const data: PersonaResponse = await response.json();
    return data;

  } catch (error) {
  
    
    console.error("Error en consultarPersona:", error);
    return null;
  }
}
