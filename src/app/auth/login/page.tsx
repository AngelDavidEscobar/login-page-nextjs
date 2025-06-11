"use client"
import { signIn } from "next-auth/react"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Loader2, Heart, Shield, Stethoscope } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    setIsLoading(false)

    if (result?.error) {
      setError("Credenciales incorrectas. Por favor, verifique sus datos.")
    } else {
      router.replace("/main")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex">
     
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-800 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Nombre to Bonito</h1>
            <p className="text-xl text-purple-100 text-center max-w-md">
              Sistema integral de gestión de ....
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Seguridad Garantizada</h3>
                <p className="text-sm text-purple-100">insertar texto</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Cuidado Integral</h3>
                <p className="text-sm text-purple-100">Insertar texto</p>
              </div>
            </div>
          </div>
        </div>

      
        <div className="absolute bottom-0 right-0 opacity-10">
          <svg width="400" height="400" viewBox="0 0 400 400" className="text-white">
            <defs>
              <pattern id="medical-cross" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M18 14h4v12h-4zM14 18h12v4H14z" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#medical-cross)" />
          </svg>
        </div>
      </div>

      
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-800 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900"></h2>
            </div>

           
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h3>
              <p className="text-gray-600">Ingresa tus credenciales</p>
            </div>

            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            
            <form onSubmit={handleSubmit} className="space-y-6">
            
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="doctor@clinica.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200 placeholder-gray-400 text-gray-900"
                  />
                </div>
              </div>

            
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña Segura
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-600" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200 placeholder-gray-400 text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-purple-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-purple-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

            
              <div className="flex items-center justify-between">
                <div className="flex items-center">
               
                 
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                    ¿Olvidó su contraseña?
                  </a>
                </div>
              </div>

           
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-purple-700 to-orange-500 hover:from-purple-800 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Verificando credenciales...
                  </>
                ) : (
                  "Acceder al Sistema"
                )}
              </button>
            </form>

        
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <p className="text-xs text-gray-600">
                  <strong>Aviso de Seguridad:</strong> Cuando haga falta ejemplo: mantenimiento
                </p>
              </div>
            </div>
          </div>

          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Descripcion pendiente tal vez la quite
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
