"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import {
  Search,
  Download,
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
import { Persona } from "../../../types/api"
import ExcelDownloader from "../components/ExcelDownloaader"


// Tipos de documento disponibles
const documentTypes = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PP", label: "Pasaporte" },
  { value: "RC", label: "Registro Civil" },
]

interface UserData {
  id: string
  documentType: string
  documentNumber: string
  name: string
  email: string
  phone: string
  address: string
  birthDate: string
  status: string
}

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

  // Estados para consulta masiva
  const [masiveForm, setMasiveForm] = useState({
    documentType: "",
    documentNumbers: "",
  })
  const [masiveResults, setMasiveResults] = useState<UserData[]>([])
  const [masiveLoading, setMasiveLoading] = useState(false)
  const [masiveError, setMasiveError] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

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

  // Función para consulta masiva
  const handleMasiveSearch = async () => {
    if (!masiveForm.documentType || !masiveForm.documentNumbers.trim()) {
      setMasiveError("Por favor complete todos los campos")
      return
    }

    setMasiveLoading(true)
    setMasiveError("")
    setMasiveResults([])
    setSelectedUsers([])

    try {
      const documentNumbers = masiveForm.documentNumbers
        .split("\n")
        .map((num) => num.trim())
        .filter((num) => num.length > 0)

      // Aquí harías la llamada real a tu API
      const response = await fetch("/api/users/masive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentType: masiveForm.documentType,
          documentNumbers,
        }),
      })

      if (!response.ok) {
        throw new Error("Error en la consulta masiva")
      }

      const usersData = await response.json()
      setMasiveResults(usersData)
    } catch (error) {
      // Mock data para demostración
      setTimeout(() => {
        const mockUsers: UserData[] = [
          {
            id: "1",
            documentType: masiveForm.documentType,
            documentNumber: "12345678",
            name: "Ana María García",
            email: "ana.garcia@email.com",
            phone: "+57 301 234 5678",
            address: "Carrera 15 #32-45, Medellín",
            birthDate: "1990-07-22",
            status: "Activo",
          },
          {
            id: "2",
            documentType: masiveForm.documentType,
            documentNumber: "87654321",
            name: "Carlos Eduardo López",
            email: "carlos.lopez@email.com",
            phone: "+57 302 345 6789",
            address: "Avenida 68 #45-23, Bogotá",
            birthDate: "1988-11-10",
            status: "Activo",
          },
        ]
        setMasiveResults(mockUsers)
        setMasiveLoading(false)
      }, 2000)
      return
    }

    setMasiveLoading(false)
  }

  // Función para descargar Excel
  const handleDownloadExcel = async ({personas}: {personas: Persona[]}) => {
    
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleSelectAll = () => {
    setSelectedUsers(selectedUsers.length === masiveResults.length ? [] : masiveResults.map((user) => user.id))
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
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Consulta Masiva</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Ingrese el tipo de documento y los números separados por líneas para consultar múltiples usuarios.
                  </p>
                </div>

                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                      <select
                        value={masiveForm.documentType}
                        onChange={(e) => setMasiveForm({ ...masiveForm, documentType: e.target.value })}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Números de Documento (uno por línea)
                      </label>
                      <textarea
                        value={masiveForm.documentNumbers}
                        onChange={(e) => setMasiveForm({ ...masiveForm, documentNumbers: e.target.value })}
                        placeholder={`12345678\n87654321\n11223344`}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleMasiveSearch}
                      disabled={masiveLoading}
                      className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {masiveLoading ? (
                        <>
                          <Loader2 className="animate-spin w-4 h-4" />
                          <span>Consultando...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          <span>Consultar</span>
                        </>
                      )}
                    </button>
                  </div>

                  {masiveError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-sm text-red-700">{masiveError}</p>
                    </div>
                  )}
                </div>

                {/* Resultados Masivos */}
                {masiveResults.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-md font-medium text-gray-900">
                        Resultados ({masiveResults.length} usuarios encontrados)
                      </h4>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSelectAll}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {selectedUsers.length === masiveResults.length ? "Deseleccionar Todo" : "Seleccionar Todo"}
                        </button>
                        <button
                          onClick={() =>
                            handleDownloadExcel(
                              masiveResults.filter((user) => selectedUsers.includes(user.id)),
                              `consulta_masiva_${new Date().toISOString().split("T")[0]}`,
                            )
                          }
                          disabled={selectedUsers.length === 0}
                          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Descargar Seleccionados ({selectedUsers.length})</span>
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left">
                              <input
                                type="checkbox"
                                checked={selectedUsers.length === masiveResults.length && masiveResults.length > 0}
                                onChange={handleSelectAll}
                                className="h-4 w-4 text-gray-900 focus:ring-purple-500 border-gray-300 rounded text-gray-900z"
                              />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Documento
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Teléfono
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {masiveResults.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={() => handleSelectUser(user.id)}
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.documentType} {user.documentNumber}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  {user.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

           
            {activeTab === "admin" && <AdminModule isAdmin={isAdmin} />}
          </div>
        </div>
      </div>
    </div>
  )
}
