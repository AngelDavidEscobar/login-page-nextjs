// types/api.ts

export interface AuthRequestBody {
  data: {
    NombreUsuario: string;
    Aplicacion: string;
    Password: string;
  }[];
}

export interface AuthResponse {
  data: string; 
}

export interface PersonaRequestBody {
  data: {
    TipoDocumento: string;
    NumeroDocumento: string;
  }[];
}
export interface Mensaje {
  Tipo: 'Error' | 'Advertencia' | 'Información'; 
  Codigo: number;
  Texto: string;
  ListaMensaje: null | any[]; 
}

export interface Persona {
  TipoDocumento: string;         
  NumeroDocumento: string;       
  PrimerNombre: string;          
  SegundoNombre: string | null; 
  PrimerApellido: string;        
  SegundoApellido: string;       
  CodigoEps: string;             
  NombreEps: string;            
  FechaAfiliacionEps: string;    
  CertificadoEps: boolean;
  TipoCotizante: string;         
  ValorUPC: number;
  Estado: null | string;        
  Regimen: null | string;
  CodigoAfp: null | string;
  NombreAfp: null | string;
  FechaAfiliacionAfp: null | string;
  CertificadoAfp: boolean;
  EsPensionado: boolean;
  EnTramitePension: boolean;
  TipoPension: null | string;
  Aprendices: boolean;
  Subtipo6: boolean;
  Subtipo3y4: any[];             // Reemplaza "any" si conoces la estructura
}
export interface PersonaResponse {
  data: Persona[] | null;
  mensajes: Mensaje [] | null;
}
