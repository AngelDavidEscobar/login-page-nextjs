import { useState } from "react";
import { consultarPersona } from "../../../services/personaService";
import { PersonaResponse } from "../../../types/api";

export default function usePersona() {
  const [persona, setPersona] = useState<PersonaResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buscarPersona = async (tipoDocumento: string, numeroDocumento: string) => {
    setLoading(true);
    setError(null);
    setPersona(null);

    
      const data = await consultarPersona(tipoDocumento, numeroDocumento);
    
      setPersona(data);
      //console.log(data)
    const errorMensaje = data?.mensajes?.[0]?.Texto;
    if(errorMensaje) setError(errorMensaje);
  
      setLoading(false);
    
  };

  return { persona, loading, error, buscarPersona };
}
