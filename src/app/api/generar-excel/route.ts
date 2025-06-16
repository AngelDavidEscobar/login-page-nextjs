// app/api/generar-excel/route.ts
import { NextRequest } from "next/server";
import { Workbook } from "exceljs";

export async function POST(req: NextRequest) {
  try {
    const persona = await req.json();
    

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Persona");

    worksheet.columns = [
      { header: "Tipo Documento", key: "TipoDocumento", width: 20 },
      { header: "Número Documento", key: "NumeroDocumento", width: 20 },
      { header: "Primer Nombre", key: "PrimerNombre", width: 20 },
      { header: "Segundo Nombre", key: "SegundoNombre", width: 20 },
      { header: "Primer Apellido", key: "PrimerApellido", width: 20 },
      { header: "Segundo Apellido", key: "SegundoApellido", width: 20 },
      { header: "Código EPS", key: "CodigoEps", width: 15 },
      { header: "Nombre EPS", key: "NombreEps", width: 20 },
      { header: "Fecha Afiliación EPS", key: "FechaAfiliacionEps", width: 20 },
      { header: "Certificado EPS", key: "CertificadoEps", width: 20 },
      { header: "Tipo de Cotizante", key: "TipoCotizante", width: 20 },
      { header: "Valor UPC", key: "ValorUPC", width: 20 },
      { header: "Estado", key: "Estado", width: 20 },
      { header: "Regimen", key: "Regimen", width: 20 },
      { header: "Código Afp", key: "CodigoAfp", width: 20 },
      { header: "Nombre Afp", key: "NombreAfp", width: 20 },
      { header: "Fecha Afiliación Afp", key: "FechaAfiliacionAfp", width: 20 },
      { header: "Certificado Afp", key: "CertificadoAfp", width: 20 },
      { header: "Es Pensionado", key: "EsPensionado", width: 20 },
      { header: "En Tramite Pension", key: "EnTramitePension", width: 20 },
      { header: "Tipo Pension", key: "TipoPension", width: 20 },
      { header: "Aprendices", key: "Aprendices", width: 20 },
      { header: "Subtipo 6", key: "Subtipo6", width: 20 },
      { header: "Subtipo 3y4", key: "Subtipo3y4", width: 20 },
    ];


    worksheet.addRow({
      TipoDocumento: persona.data?.TipoDocumento,
      NumeroDocumento: persona.data?.NumeroDocumento,
      PrimerNombre: persona.data?.PrimerNombre,
      SegundoNombre: persona.data?.SegundoNombre,
      PrimerApellido: persona.data?.PrimerApellido,
      SegundoApellido: persona.data?.SegundoApellido,
      CodigoEps: persona.data?.CodigoEps,
      NombreEps: persona.data?.NombreEps,
      FechaAfiliacionEps: persona.data?.FechaAfiliacionEps,
      CertificadoEps: persona.data?.CertificadoEps ? "Sí" : "No",
      TipoCotizante: persona.data?.TipoCotizante,
      ValorUPC: persona.data?.ValorUPC,
      Estado: persona.data?.Estado,
      Regimen: persona.data?.Regimen,
      CodigoAfp: persona.data?.CodigoAfp,
      NombreAfp: persona.data?.NombreAfp,
      FechaAfiliacionAfp: persona.data?.FechaAfiliacionAfp,
      CertificadoAfp: persona.data?.CertificadoAfp ? "Sí" : "No",
      EsPensionado: persona.data?.EsPensionado ? "Sí" : "No",
      EnTramitePension: persona.data?.EnTramitePension ? "Sí" : "No",
      TipoPension: persona.data?.TipoPension,
      Aprendices: persona.data?.Aprendices ? "Sí" : "No",
      Subtipo6: persona.data?.Subtipo6,
      Subtipo3y4: persona.data?.Subtipo3y4,
   
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="persona.xlsx"',
      },
    });

  } catch (error) {
    console.error("Error generando Excel:", error);
    return new Response(JSON.stringify({ error: "Error generando el archivo" }), { status: 500 });
  }
}
