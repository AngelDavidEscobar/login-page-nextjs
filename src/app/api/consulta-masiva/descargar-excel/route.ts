// src/app/api/consulta-masiva/descargar-excel/route.ts

import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { Persona } from '../../../../../types/api';

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Consulta Masiva');

    worksheet.columns = [
      { header: 'Tipo Documento', key: 'TipoDocumento', width: 20 },
      { header: 'Numero Documento', key: 'NumeroDocumento', width: 20 },
      { header: 'Primer Nombre', key: 'PrimerNombre', width: 20 },
      { header: 'Segundo Nombre', key: 'SegundoNombre', width: 20 },
      { header: 'Primer Apellido', key: 'PrimerApellido', width: 20 },
      { header: 'Segundo Apellido', key: 'SegundoApellido', width: 20 },
      { header: 'Codigo EPS', key: 'CodigoEps', width: 15 },
      { header: 'Nombre EPS', key: 'NombreEps', width: 20 },
      { header: 'Fecha Afiliación EPS', key: 'FechaAfiliacionEps', width: 20 },
      { header: 'Certificado EPS', key: 'CertificadoEps', width: 20 },
      { header: 'Tipo de Cotizante', key: 'TipoCotizante', width: 20 },
      { header: 'Valor UPC', key: 'ValorUPC', width: 20 },
      { header: 'Estado', key: 'Estado', width: 20 },
      { header: 'Regimen', key: 'Regimen', width: 20 },
      { header: 'Codigo Afp', key: 'CodigoAfp', width: 20 },
      { header: 'Nombre Afp', key: 'NombreAfp', width: 20 },
      { header: 'Fecha Afiliación Afp', key: 'FechaAfiliacionAfp', width: 20 },
      { header: 'Certificado Afp', key: 'CertificadoAfp', width: 20 },
      { header: 'Es Pensionado', key: 'EsPensionado', width: 20 },
      { header: 'En Tramite Pension', key: 'EnTramitePension', width: 20 },
      { header: 'Tipo Pension', key: 'TipoPension', width: 20 },
      { header: 'Aprendices', key: 'Aprendices', width: 20 },
      { header: 'Subtipo 6', key: 'Subtipo6', width: 20 },
      { header: 'Subtipo 3y4', key: 'Subtipo3y4', width: 20 },
    ];

    data.forEach((persona: Persona) => {
      worksheet.addRow({
        TipoDocumento: persona.TipoDocumento,
        NumeroDocumento: persona.NumeroDocumento,
        PrimerNombre: persona.PrimerNombre,
        SegundoNombre: persona.SegundoNombre,
        PrimerApellido: persona.PrimerApellido,
        SegundoApellido: persona.SegundoApellido,
        CodigoEps: persona.CodigoEps,
        NombreEps: persona.NombreEps,
        FechaAfiliacionEps: persona.FechaAfiliacionEps,
        CertificadoEps: persona.CertificadoEps ? 'Sí' : 'No',
        TipoCotizante: persona.TipoCotizante,
        ValorUPC: persona.ValorUPC,
        Estado: persona.Estado,
        Regimen: persona.Regimen,
        CodigoAfp: persona.CodigoAfp,
        NombreAfp: persona.NombreAfp,
        FechaAfiliacionAfp: persona.FechaAfiliacionAfp,
        CertificadoAfp: persona.CertificadoAfp ? 'Sí' : 'No',
        EsPensionado: persona.EsPensionado ? 'Sí' : 'No',
        EnTramitePension: persona.EnTramitePension ? 'Sí' : 'No',
        TipoPension: persona.TipoPension,
        Aprendices: persona.Aprendices ? 'Sí' : 'No',
        Subtipo6: persona.Subtipo6,
        Subtipo3y4: persona.Subtipo3y4,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="consulta_masiva.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error generando Excel:', error);
    return NextResponse.json({ error: 'Error generando Excel' }, { status: 500 });
  }
}
