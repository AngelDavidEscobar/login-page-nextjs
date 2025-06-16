import { useState, useCallback, useRef } from 'react';

interface Documento {
  TipoDocumento: string;
  NumeroDocumento: string;
}

interface ProcessState {
  step: 'idle' | 'uploading' | 'sending' | 'consulting' | 'completed' | 'error';
  message: string;
}

export default function useConsultaMasiva() {
  const [file, setFile] = useState<File | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [idSolicitud, setIdSolicitud] = useState<string | null>(null);
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [excelReady, setExcelReady] = useState(false);
  const [processState, setProcessState] = useState<ProcessState>({
    step: 'idle',
    message: ''
  });
  const [error, setError] = useState<string>('');

  // Ref para evitar múltiples ejecuciones
  const isProcessingRef = useRef(false);

  // Reset de estados
  const resetStates = useCallback(() => {
    setDocumentos([]);
    setIdSolicitud(null);
    setResultado(null);
    setExcelReady(false);
    setError('');
    setProcessState({ step: 'idle', message: '' });
    isProcessingRef.current = false;
  }, []);

  // Manejo de cambio de archivo
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      resetStates();
    }
  }, [resetStates]);

  // Función auxiliar para manejar respuestas de API
  const handleApiResponse = async (response: Response, context: string) => {
    if (!response.ok) {
      let errorMessage = `Error ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Si no se puede parsear el JSON, usar el status
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      
      console.error(`Error en ${context}:`, errorMessage);
      throw new Error(errorMessage);
    }
    
    return response.json();
  };

  // Upload del archivo
  const handleUpload = useCallback(async (fileToUpload: File): Promise<Documento[]> => {
    if (!fileToUpload) {
      throw new Error('No hay archivo para subir');
    }

    setProcessState({ step: 'uploading', message: 'Subiendo archivo...' });

    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const response = await fetch('/api/consulta-masiva/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await handleApiResponse(response, 'upload');

      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        setDocumentos(result.data);
        setProcessState({ step: 'uploading', message: `${result.data.length} documentos cargados` });
        console.log('✅ Upload exitoso:', result.data.length, 'documentos');
        return result.data;
      } else {
        throw new Error('El archivo no contiene documentos válidos.');
      }
    } catch (error) {
      console.error('❌ Error en upload:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error subiendo archivo';
      setError(errorMessage);
      setProcessState({ step: 'error', message: 'Error al subir archivo' });
      throw error;
    }
  }, []);

  // Enviar consulta
  const handleEnviarConsulta = useCallback(async (documentosToSend: Documento[]): Promise<string> => {
    if (!documentosToSend || documentosToSend.length === 0) {
      throw new Error('No hay documentos para enviar');
    }

    setProcessState({ step: 'sending', message: 'Enviando consulta masiva...' });

    try {
      const response = await fetch('/api/consulta-masiva/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: documentosToSend }),
      });

      const result = await handleApiResponse(response, 'enviar consulta');

      if (result.idSolicitud) {
        setIdSolicitud(result.idSolicitud);
        setProcessState({ step: 'sending', message: 'Consulta enviada correctamente' });
        console.log('✅ Consulta enviada exitosamente, ID:', result.idSolicitud);
        return result.idSolicitud;
      } else {
        throw new Error('No se recibió ID de solicitud válido.');
      }
    } catch (error) {
      console.error('❌ Error enviando consulta:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error enviando consulta';
      setError(errorMessage);
      setProcessState({ step: 'error', message: 'Error al enviar consulta' });
      throw error;
    }
  }, []);

  // Consultar resultado
  const handleConsultarResultado = useCallback(async (solicitudId: string): Promise<any[]> => {
    if (!solicitudId) {
      throw new Error('No hay ID de solicitud disponible');
    }

    try {
      const response = await fetch('/api/consulta-masiva/resultado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idSolicitud: solicitudId }),
      });

      // Para esta API, un 500 puede ser normal si los resultados no están listos
      if (response.status === 500) {
        console.log('⏳ Resultados no disponibles aún (500), reintentando...');
        throw new Error('RETRY'); // Error especial para reintentos
      }

      const result = await handleApiResponse(response, 'consultar resultado');

      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        setResultado(result.data);
        setProcessState({ step: 'completed', message: `${result.data.length} resultados obtenidos` });
        console.log('✅ Resultados obtenidos exitosamente:', result.data.length);
        return result.data;
      } else {
        console.log('⏳ Resultados no disponibles aún, reintentando...');
        throw new Error('RETRY');
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'RETRY') {
        // No mostrar error en UI para reintentos normales
        setProcessState({ step: 'consulting', message: 'Esperando resultados...' });
        throw error;
      } else {
        console.error('❌ Error consultando resultado:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error consultando resultado';
        setError(errorMessage);
        setProcessState({ step: 'error', message: 'Error al consultar resultado' });
        throw error;
      }
    }
  }, []);

  // Proceso completo
  const handleFullProcess = useCallback(async () => {
    if (isProcessingRef.current || loading) {
      console.log('⚠️ Proceso ya en ejecución, ignorando...');
      return;
    }

    if (!file) {
      setError('Por favor selecciona un archivo CSV.');
      return;
    }

    console.log('🚀 Iniciando proceso completo...');
    isProcessingRef.current = true;
    setLoading(true);
    setError(''); // Limpiar errores previos
    setExcelReady(false);

    try {
      // Paso 1: Upload
      console.log('📤 Paso 1: Subiendo archivo...');
      const documentosObtenidos = await handleUpload(file);

      // Paso 2: Enviar consulta
      console.log('📨 Paso 2: Enviando consulta...');
      const idObtenido = await handleEnviarConsulta(documentosObtenidos);

      // Paso 3: Consultar resultado con reintentos
      console.log('🔍 Paso 3: Consultando resultados...');
      let resultadosObtenidos: any[] = [];
      let attempts = 0;
      const maxAttempts = 15; // Aumentar intentos
      const retryDelay = 2000; // Reducir delay

      while (attempts < maxAttempts) {
        attempts++;
        setProcessState({ 
          step: 'consulting', 
          message: `Consultando resultados... (${attempts}/${maxAttempts})` 
        });

        try {
          resultadosObtenidos = await handleConsultarResultado(idObtenido);
          break; // Salir del bucle si se obtuvieron resultados
        } catch (consultError) {
          if (consultError instanceof Error && consultError.message === 'RETRY') {
            console.log(`⏳ Intento ${attempts}/${maxAttempts} - Esperando resultados...`);
            
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
          } else {
            // Error real, no de reintento
            throw consultError;
          }
        }
      }

      if (resultadosObtenidos.length > 0) {
        setExcelReady(true);
        setProcessState({ step: 'completed', message: '✅ Proceso completado exitosamente' });
        console.log('🎉 Proceso completado exitosamente');
        // Limpiar cualquier error previo ya que el proceso fue exitoso
        setError('');
      } else {
        throw new Error('No se pudieron obtener los resultados después de varios intentos. Por favor, intente nuevamente.');
      }

    } catch (error) {
      console.error('💥 Error en el proceso masivo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error en el proceso';
      setError(errorMessage);
      setProcessState({ step: 'error', message: 'Error en el proceso' });
    } finally {
      setLoading(false);
      isProcessingRef.current = false;
      console.log('🏁 Proceso finalizado');
    }
  }, [file, handleUpload, handleEnviarConsulta, handleConsultarResultado, loading]);

  // Funciones individuales para compatibilidad
  const handleUploadIndividual = useCallback(async () => {
    if (!file) {
      setError('Por favor selecciona un archivo CSV.');
      return false;
    }
    try {
      await handleUpload(file);
      return true;
    } catch {
      return false;
    }
  }, [file, handleUpload]);

  const handleEnviarConsultaIndividual = useCallback(async () => {
    if (documentos.length === 0) {
      setError('No hay documentos cargados.');
      return false;
    }
    try {
      await handleEnviarConsulta(documentos);
      return true;
    } catch {
      return false;
    }
  }, [documentos, handleEnviarConsulta]);

  const handleConsultarResultadoIndividual = useCallback(async () => {
    if (!idSolicitud) {
      setError('No hay ID de solicitud disponible.');
      return false;
    }
    try {
      await handleConsultarResultado(idSolicitud);
      return true;
    } catch {
      return false;
    }
  }, [idSolicitud, handleConsultarResultado]);

  // Descargar Excel
  const handleDescargarExcel = useCallback(async () => {
    if (!resultado || !Array.isArray(resultado) || resultado.length === 0) {
      setError('No hay resultado para descargar.');
      return;
    }

    try {
      const response = await fetch('/api/consulta-masiva/descargar-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: resultado }),
      });

      if (!response.ok) {
        throw new Error(`Error al generar Excel: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `consulta_masiva_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('📥 Excel descargado exitosamente');
      
    } catch (error) {
      console.error('❌ Error descargando Excel:', error);
      setError(error instanceof Error ? error.message : 'Error descargando el archivo');
    }
  }, [resultado]);

  return {
    // Handlers principales
    handleFileChange,
    handleFullProcess,
    handleDescargarExcel,
    resetStates,
    
    // Handlers individuales
    handleUpload: handleUploadIndividual,
    handleEnviarConsulta: handleEnviarConsultaIndividual,
    handleConsultarResultado: handleConsultarResultadoIndividual,
    
    // Estados
    file,
    documentos,
    resultado,
    idSolicitud,
    loading,
    excelReady,
    processState,
    error,
    
    // Estados computados
    canProcess: !!file && !loading,
    hasResults: !!resultado && Array.isArray(resultado) && resultado.length > 0,
  };
}