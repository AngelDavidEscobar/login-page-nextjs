import { NextRequest } from "next/server";
import  { getValidToken } from "../../../../../services/tokenManager";

const URL = "https://marketplacepruebas.aportesenlinea.com/Transversales.Servicios.Fachada/api/Persona/ConsultarPersonaEnBaseDatosReferenciaMasivo";
export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();
    
    
    const requestBody = {
      data:
        data
      
    };
   
    const token = await getValidToken();
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Token: `${token}`,
      },
      body: JSON.stringify( requestBody ),
    });

    
    if (!response.ok) {
      throw new Error('Error en la consulta masiva');
    }
    
    const result = await response.json();
   
    const idSolicitud = result?.data;
    
    return new Response(JSON.stringify({ idSolicitud }), { status: 200 });

  } catch (error) {
    console.error('Error enviando consulta masiva:', error);
    return new Response(JSON.stringify({ error: 'Error en la consulta masiva' }), { status: 500 });
  }
}
