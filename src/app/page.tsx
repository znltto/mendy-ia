'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // Sucesso: redirecionar para o dashboard
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-100 to-orange-100 overflow-hidden flex">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-1 h-full flex flex-col md:flex-row"
      >
        {/* Seção Laranja - Ilustração */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#ff6d00] to-[#ff9500] p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -right-20 -bottom-20 w-64 h-64 border-4 border-orange-300/30 rounded-full"
          />
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -left-20 -top-20 w-80 h-80 border-4 border-orange-200/25 rounded-full"
          />

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="relative w-48 h-48 mb-6 z-10 md:w-64 md:h-64"
          >
            <Image
              src="/bonequinho.png"
              alt="Ilustração MendesWear"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </motion.div>
          
          <motion.p
            className="text-white/90 text-center mb-6 z-10 text-sm md:text-base"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            A Assistente virtual do grupo Mendes Wear!
          </motion.p>
        </div>

        {/* Seção Clara - Formulário */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex items-center justify-center bg-white">
          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-6 w-full max-w-sm md:max-w-md"
            variants={containerVariants}
          >
            <motion.h3 
              className="text-2xl md:text-3xl font-bold text-gray-800 mb-2"
              variants={itemVariants}
            >
              Bem vindo :)
            </motion.h3>
            
            <motion.p 
              className="text-gray-600 mb-6 text-sm md:text-base"
              variants={itemVariants}
            >
              Acesse sua conta para continuar
            </motion.p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-300 rounded-lg p-4 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail ou nome de usuário *
              </label>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <input
                  type="text"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="E-mail ou nome de usuário"
                  required
                />
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha *
                </label>
                <Link href="/recuperar-senha" className="text-sm text-orange-600 hover:text-orange-500">
                  Esqueci minha senha
                </Link>
              </div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="Senha"
                  required
                />
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-white bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${isLoading ? 'opacity-80' : ''}`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Entrando...
                  </div>
                ) : 'Entrar'}
              </motion.button>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}