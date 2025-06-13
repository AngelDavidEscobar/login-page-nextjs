"use client"
import { useState } from "react"
import { UserPlus,  Save, X, Eye, EyeOff, TriangleAlert } from "lucide-react"

interface AdminModuleProps {
  isAdmin: boolean
}

export default function AdminModule({ isAdmin }: AdminModuleProps) {
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const roles = [
    { value: "usuario", label: "Usuario" },
    { value: "administrador", label: "Administrador" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

   
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debe confirmar la contraseña"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (!formData.role) {
      newErrors.role = "Debe seleccionar un rol"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateUser = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error("Ya existe un usuario con ese correo electrónico")
      }

    
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      })
      setShowCreateUser(false)
      alert("Usuario creado exitosamente")
    } catch (error) {
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.log(errorMessage)
      setErrors({ global: errorMessage })
  
        setIsLoading(false)
      
      return
    }

    setIsLoading(false)
  }

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    })
    setErrors({})
    setShowCreateUser(false)
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Acceso Denegado</h3>
        <p className="text-gray-600">No tiene permisos para acceder a este módulo.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
     
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Administración de Usuarios</h3>
          <p className="text-sm text-gray-600 mt-1">Gestione los usuarios del sistema</p>
        </div>
        <button
          onClick={() => setShowCreateUser(!showCreateUser)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showCreateUser ? "Cancelar" : "Crear Usuario"}</span>
        </button>
      </div>

    
      {showCreateUser && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-orange-600" />
            </div>
            <h4 className="text-md font-semibold text-gray-900">Nuevo Usuario del Sistema</h4>
          </div>
          {errors.global && <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 m-3">
        <div className="flex items-start space-x-3">
          <TriangleAlert className="w-8 h-8 text-orange-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-orange-800 mb-1">Error al crear el usuario</h4>
            <p className="text-sm text-orange-700">
              {errors.global}
            </p>
          </div>
        </div>
      </div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="Juan Pérez García"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                  placeholder="juan.perez@ejemplo.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                >
                  <option value="" className="text-gray-500">
                    Seleccione un rol...
                  </option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
              </div>
            </div>

            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreateUser}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Crear Usuario</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

     
      
    </div>
  )
}
