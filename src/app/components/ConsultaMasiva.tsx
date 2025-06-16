'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Download, Loader2, AlertCircle, CheckCircle2, X, Info, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import useConsultaMasiva from '../hooks/useConsultaMasiva';

export default function ConsultaMasiva() {
  const {
    handleFileChange,
    handleFullProcess,
    handleDescargarExcel,
    resetStates,
    file,
    loading,
    excelReady,
    processState,
    error,
    canProcess,
    hasResults,
    documentos,
    resultado
  } = useConsultaMasiva();

  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validar archivo CSV
  const validateFile = useCallback((file: File): string | null => {
    if (!file) return 'No se ha seleccionado ningún archivo';
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return 'El archivo debe ser de tipo CSV';
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      return 'El archivo no puede ser mayor a 10MB';
    }
    
    if (file.size === 0) {
      return 'El archivo está vacío';
    }
    
    return null;
  }, []);

  // Manejar selección de archivo
  const onFileSelect = useCallback((selectedFile: File) => {
    const validationError = validateFile(selectedFile);
    
    if (validationError) {
      setLocalError(validationError);
      return;
    }
    
    setLocalError('');
    handleFileChange({ target: { files: [selectedFile] } } as any);
  }, [validateFile, handleFileChange]);

  // Manejar cambio de input
  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  // Manejar soltar y arrastrar
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  }, [onFileSelect]);


  const removeFile = useCallback(() => {
    setLocalError('');
    resetStates();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [resetStates]);

  // Abrir selector de archivos
  const openFileSelector = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Procesar archivo
  const processFile = useCallback(async () => {
    if (!file) {
      setLocalError('Por favor seleccione un archivo CSV');
      return;
    }
    
    setLocalError('');
    await handleFullProcess();
  }, [file, handleFullProcess]);

  // Obtener icono según el estado del proceso
  const getProcessIcon = () => {
    switch (processState.step) {
      case 'uploading':
        return <Upload className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'sending':
        return <RefreshCw className="w-5 h-5 text-purple-600 animate-spin" />;
      case 'consulting':
        return <Clock className="w-5 h-5 text-orange-600 animate-pulse" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  // Obtener color del estado del proceso
  const getProcessColor = () => {
    switch (processState.step) {
      case 'uploading':
        return 'border-blue-200 bg-blue-50';
      case 'sending':
        return 'border-purple-200 bg-purple-50';
      case 'consulting':
        return 'border-orange-200 bg-orange-50';
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const displayError = error || localError;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Consulta Masiva</h3>
        <p className="text-sm text-gray-600 mb-6">
          Suba un archivo CSV con los números de documento para consultar múltiples usuarios de forma masiva.
        </p>
      </div>

      {/* Área de subida de archivo */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo CSV <span className="text-red-500">*</span>
            </label>
            
            {/* Drop Zone */}
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                dragActive
                  ? 'border-purple-400 bg-purple-50'
                  : file
                  ? 'border-green-400 bg-green-50'
                  : displayError
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-300 hover:border-purple-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={openFileSelector}
            >
              <div className="space-y-1 text-center">
                {file ? (
                  <>
                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                    <div className="flex text-sm text-green-600">
                      <span className="font-medium">Archivo seleccionado</span>
                    </div>
                    <p className="text-xs text-green-500">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </>
                ) : displayError ? (
                  <>
                    <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                    <div className="flex text-sm text-red-600">
                      <span className="font-medium">Error en el archivo</span>
                    </div>
                    <p className="text-xs text-red-500">{displayError}</p>
                  </>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <span className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                        Subir archivo CSV
                      </span>
                      <p className="pl-1">o arrastre y suelte</p>
                    </div>
                    <p className="text-xs text-gray-500">CSV hasta 10MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Input oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={onInputChange}
              className="sr-only"
            />

            {/* Archivo seleccionado */}
            {file && (
              <div className="mt-3 flex items-center justify-between p-3 bg-white border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB • CSV
                      {documentos.length > 0 && (
                        <span className="ml-2 text-green-600">
                          • {documentos.length} documentos cargados
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remover archivo"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Estado del proceso */}
          {processState.step !== 'idle' && (
            <div className={`border rounded-lg p-4 ${getProcessColor()}`}>
              <div className="flex items-center space-x-3">
                {getProcessIcon()}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      Estado del Proceso
                    </h4>
                    {loading && (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    {processState.message}
                  </p>
                  
                  {/* Progreso visual */}
                  {loading && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            processState.step === 'uploading' ? 'bg-blue-600 w-1/4' :
                            processState.step === 'sending' ? 'bg-purple-600 w-2/4' :
                            processState.step === 'consulting' ? 'bg-orange-600 w-3/4' :
                            'bg-green-600 w-full'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Resultados disponibles */}
          {hasResults && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">
                    Resultados Disponibles
                  </h4>
                  <p className="text-sm text-green-700">
                    Se encontraron {resultado?.length || 0} registros. 
                    Ya puede descargar el archivo Excel.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Información del formato CSV */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">Formato del archivo CSV</h4>
                <p className="text-sm text-blue-700 mb-2">
                  El archivo debe contener una columna con los números de documento, una por fila:
                </p>
                <div className="bg-white border border-blue-200 rounded p-2 font-mono text-xs text-gray-700">
                  <div>CC,12345678</div>
                  <div>TI,87654321</div>
                  <div>CD,11223344</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje de error general */}
          {displayError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700 font-medium">Error</p>
                <p className="text-sm text-red-600">{displayError}</p>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {/* Botón de reset */}
            {(file || processState.step !== 'idle') && (
              <button
                onClick={removeFile}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Limpiar
              </button>
            )}

            {/* Botón de procesar */}
            <button
              onClick={processFile}
              disabled={!canProcess}
              className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Procesar CSV</span>
                </>
              )}
            </button>

            {/* Botón de descarga */}
            {excelReady && (
              <button
                onClick={handleDescargarExcel}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Excel</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}