"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import {
  Search,
  Users,
  UserPlus,
  FileSpreadsheet,
  Settings,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react"
import AdminModule from "../components/AdminModule"
import LogoutButton from "../components/LogoutButton"
import usePersona from "../hooks/usePersona"

import ExcelDownloader from "../components/ExcelDownloaader"
import ConsultaMasiva from "../components/ConsultaMasiva"


// Tipos de documento disponibles
const documentTypes = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PP", label: "Pasaporte" },
  { value: "RC", label: "Registro Civil" },
]



export default function MainPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("individual")

  // Estados para consulta individual
  const [individualForm, setIndividualForm] = useState({
    documentType: "",
    documentNumber: "",
  })

 
  const [individualError, setIndividualError] = useState("");
  const { persona, loading: personaLoading, error: personaError, buscarPersona } = usePersona();

 

  

  // Verificar si el usuario es administrador
  const isAdmin = session?.user?.role === "admin"

  // Función para consulta individual
  const handleIndividualSearch = async () => {
    if (!individualForm.documentType || !individualForm.documentNumber) {
      setIndividualError("Por favor complete todos los campos")
      return
    }

    setIndividualError("")
  
    await buscarPersona(individualForm.documentType, individualForm.documentNumber)
    
 
  
  }

 

  



  return (
    <div className="min-h-screen bg-gray-50">
     
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-700 to-orange-500 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Sistema de Consultas</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{session?.user?.email}</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
   
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
       
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("individual")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "individual"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Consulta Individual</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("masiva")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "masiva"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Consulta Masiva</span>
                </div>
              </button>

              {isAdmin && (
                <button
                  onClick={() => setActiveTab("admin")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "admin"
                      ? "border-orange-500 text-orange-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Administración</span>
                  </div>
                </button>
              )}
            </nav>
          </div>

          
          <div className="p-6">
            
            {activeTab === "individual" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Consulta Individual</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Ingrese el tipo y número de documento para consultar la información del usuario.
                  </p>
                </div>

                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                      <select
                        value={individualForm.documentType}
                        onChange={(e) => setIndividualForm({ ...individualForm, documentType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                      >
                        <option value="">Seleccione...</option>
                        {documentTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Número de Documento</label>
                      <input
                        type="text"
                        value={individualForm.documentNumber}
                        onChange={(e) => setIndividualForm({ ...individualForm, documentNumber: e.target.value })}
                        placeholder="Ingrese el número"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={handleIndividualSearch}
                        disabled={personaLoading}
                        className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {personaLoading ? (
                          <>
                            <Loader2 className="animate-spin w-4 h-4 mr-2" />
                            Consultando...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Consultar
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {individualError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-sm text-red-700">{individualError}</p>
                    </div>
                  )}
                  {personaError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-sm text-red-700">{personaError}</p>
                    </div>
                  )}
                </div>

              
                
                {persona && (
                 <div className="space-y-4">
                  <div className="flex justify-between items-center">
                        <h5 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                          Resumen de Información Personal
                        </h5>
                        {persona.data?.[0] && (
                                <ExcelDownloader personas={persona.data?.[0]}/>
                                )}
                  </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                            <p className="text-sm text-gray-900">{persona.data?.[0]?.PrimerNombre} {persona.data?.[0]?.SegundoNombre} {persona.data?.[0]?.PrimerApellido} {persona.data?.[0]?.SegundoApellido}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Documento</p>
                            <p className="text-sm text-gray-900">
                              {persona.data?.[0]?.TipoDocumento} {persona.data?.[0]?.NumeroDocumento}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">EPS</p>
                            <p className="text-sm text-gray-900">
                              {persona.data?.[0]?.NombreEps} 
                            </p>
                          </div>
                        </div>
                  </div> 
                )}
              </div>
            )}

            
            {activeTab === "masiva" && (
             <ConsultaMasiva />
            )}

            {/* Admin Tab */}
            {activeTab === "admin" && <AdminModule isAdmin={isAdmin} />}
          </div>
        </div>
      </div>
    </div>
  )
}