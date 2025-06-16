import { NextRequest } from "next/server";
import  { getValidToken } from "../../../../../services/tokenManager";


export async function POST(req: NextRequest) {
  try {
    const { idSolicitud } = await req.json();
    
    const token = await getValidToken();

    const response = await fetch("https://marketplacepruebas.aportesenlinea.com/Transversales.Servicios.Fachada/api/Persona/ConsultarRespuestaSolicitudPersonaMasivo", {
      method: 'POST',
      headers: {
        'Token': `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: [{ IdSolicitud: idSolicitud }] }),
    });

    if (!response.ok) {
      throw new Error('Error consultando resultado masivo');
    }

    const result = await response.json();

    return new Response(JSON.stringify(result), { status: 200 });

  } catch (error) {
    console.error('Error consultando resultado masivo:', error);
    return new Response(JSON.stringify({ error: 'Error consultando resultado' }), { status: 500 });
  }
}
