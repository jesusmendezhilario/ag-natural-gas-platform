'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password,
    })
    if (error) {
      setError('Correo o contraseña incorrectos')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: '#137ea8' }}>
            <span className="text-white text-2xl font-bold">AG</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Portal de Proyectos</h1>
          <p className="text-gray-500 mt-1 text-sm">AG Natural Gas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Inicia sesión</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                placeholder="tu@empresa.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition disabled:opacity-60"
              style={{ backgroundColor: '#137ea8' }}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="font-semibold" style={{ color: '#137ea8' }}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}