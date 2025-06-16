import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import csvParser from 'csv-parser';
import { tmpdir } from 'os';
import { writeFile } from 'fs/promises';
import { createReadStream } from 'fs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Archivo no encontrado.' }, { status: 400 });
    }

    // Guardar el archivo temporalmente
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = path.join(tmpdir(), file.name);
    await writeFile(tempPath, buffer);

    const documentos: { TipoDocumento: string; NumeroDocumento: string }[] = [];

    await new Promise<void>((resolve, reject) => {
      createReadStream(tempPath)
        .pipe(csvParser({ headers: false })) // <-- IMPORTANTE: Sin encabezados
        .on('data', (row) => {
       
          // row[0] = TipoDocumento
          // row[1] = NumeroDocumento
          documentos.push({
            TipoDocumento: row[0]?.trim(),
            NumeroDocumento: row[1]?.trim(),
          });
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
   
    return NextResponse.json({ data: documentos });
  } catch (error) {
    console.error('Error leyendo el archivo CSV:', error);
    return NextResponse.json({ error: 'Error procesando el archivo CSV.' }, { status: 500 });
  }
}
