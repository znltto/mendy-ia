'use client';

import { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon, ChatBubbleLeftIcon, DocumentTextIcon, ClipboardDocumentListIcon, UserGroupIcon, EnvelopeIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Metric {
  value: number;
  change: number;
  isPositive: boolean;
  percentage?: never;
}

interface PercentageMetric {
  percentage: number;
  value: number;
  change: number;
  isPositive: boolean;
}

interface IndicadoresMendyIA {
  preVenda: {
    respostasIA: PercentageMetric;
    respostasAtendentes: PercentageMetric;
    respostasCorretasIA: PercentageMetric;
    perguntasNaoRespondidas: PercentageMetric;
    faturamentoGeradoIA: Metric;
  };
  posVenda: {
    respostasIA: PercentageMetric;
    respostasAtendentes: PercentageMetric;
    mensagensConsumidores: PercentageMetric;
    mediaMensagensPorPedido: Metric;
    mensagensIARelacaoTotal: Metric;
  };
}

interface Metrics {
  preVenda: {
    perguntasRecebidas: Metric;
    perguntasNaoRespondidas: Metric;
  };
  posVenda: {
    numeroReclamacoes: Metric;
    numeroMediacoes: Metric;
    reclamacoesNaoResolvidas: Metric;
    mediacoesAbertas: Metric;
  };
  indicadoresMendyIA: IndicadoresMendyIA;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 15,
    },
  },
};

const ChangeIndicator = ({ change, isPositive }: { change: number; isPositive: boolean }) => (
  <motion.div
    className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}
    variants={itemVariants}
  >
    {isPositive ? (
      <ArrowUpIcon className="h-4 w-4 mr-1" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 mr-1" />
    )}
    <span className="text-sm font-medium">{Math.abs(change).toFixed(2)}%</span>
  </motion.div>
);

function isPercentageMetric(metric: Metric | PercentageMetric): metric is PercentageMetric {
  return 'percentage' in metric;
}

export default function DashboardPage() {
  const [selectedStore, setSelectedStore] = useState('Todas');
  const [selectedPeriod, setSelectedPeriod] = useState('30 dias');
  const [showHelp, setShowHelp] = useState(false);

  const metrics: Metrics = {
    preVenda: {
      perguntasRecebidas: { value: 153, change: 2.68, isPositive: true },
      perguntasNaoRespondidas: { value: 12, change: -5.0, isPositive: false },
    },
    posVenda: {
      numeroReclamacoes: { value: 315, change: -15.32, isPositive: false },
      numeroMediacoes: { value: 37, change: -471.4, isPositive: false },
      reclamacoesNaoResolvidas: { value: 10, change: 0, isPositive: false },
      mediacoesAbertas: { value: 7, change: 0, isPositive: false },
    },
    indicadoresMendyIA: {
      preVenda: {
        respostasIA: { percentage: 44.4, value: 68, change: -16.05, isPositive: false },
        respostasAtendentes: { percentage: 56.0, value: 85, change: 25.0, isPositive: true },
        respostasCorretasIA: { percentage: 100.0, value: 0, change: 1.25, isPositive: true },
        perguntasNaoRespondidas: { percentage: 0.0, value: 0, change: 0.0, isPositive: true },
        faturamentoGeradoIA: { value: 3329.68, change: 85.99, isPositive: true },
      },
      posVenda: {
        respostasIA: { percentage: 11.0, value: 103, change: -162.6, isPositive: false },
        respostasAtendentes: { percentage: 36.0, value: 333, change: 18.09, isPositive: true },
        mensagensConsumidores: { percentage: 53.0, value: 498, change: 11.0, isPositive: true },
        mediaMensagensPorPedido: { value: 0, change: -100.0, isPositive: false },
        mensagensIARelacaoTotal: { value: 1100, change: -214.3, isPositive: false },
      },
    },
  };

  const mainMetrics = [
    {
      title: "Mensagens para responder",
      value: 42,
      change: -3.2,
      isPositive: false,
      icon: <EnvelopeIcon className="h-5 w-5 text-orange-600" />,
      bgColor: "bg-orange-50",
      description: "Total de mensagens não respondidas"
    },
    {
      title: "Perguntas para responder",
      value: metrics.preVenda.perguntasNaoRespondidas.value,
      change: metrics.preVenda.perguntasNaoRespondidas.change,
      isPositive: metrics.preVenda.perguntasNaoRespondidas.isPositive,
      icon: <ChatBubbleLeftIcon className="h-5 w-5 text-blue-600" />,
      bgColor: "bg-blue-50",
      description: "Perguntas não respondidas"
    },
    {
      title: "Reclamações pendentes",
      value: metrics.posVenda.reclamacoesNaoResolvidas.value,
      change: 0,
      isPositive: false,
      icon: <DocumentTextIcon className="h-5 w-5 text-red-600" />,
      bgColor: "bg-red-50",
      description: "Reclamações não resolvidas"
    },
    {
      title: "Mediações em aberto",
      value: metrics.posVenda.mediacoesAbertas.value,
      change: 0,
      isPositive: false,
      icon: <ClipboardDocumentListIcon className="h-5 w-5 text-purple-600" />,
      bgColor: "bg-purple-50",
      description: "Mediações não finalizadas"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
{/* Substitua o componente do assistente virtual por este código */}

<motion.div
  className="fixed left-6 bottom-6 z-50" // Alterado para bottom-6
  initial={{ y: 50, opacity: 0 }} // Animação vem de baixo agora
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.8, type: 'spring' }}
>
  <div className="relative">
    {/* Balão de conversa - ajustado para aparecer acima */}
    <motion.div
      className={`absolute -top-24 left-16 bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-200 w-64 ${showHelp ? 'block' : 'hidden'}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={showHelp ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <p className="text-sm text-gray-700 font-medium">Olá! Posso te ajudar com algo?</p>
      <div className="absolute bottom-0 -left-2 w-4 h-4 bg-white transform rotate-45 border-l border-b border-gray-200"></div>
      
      <div className="mt-2 flex space-x-2">
        <button className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition">
          Dúvidas
        </button>
        <button className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition">
          Tutorial
        </button>
      </div>
    </motion.div>

    {/* Avatar com imagem - maior e com fundo escuro */}
    <motion.div
      className="w-20 h-20 rounded-full overflow-hidden shadow-xl cursor-pointer border-2 border-white relative"
      onClick={() => setShowHelp(!showHelp)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Fundo escuro semi-transparente */}
      <div className="absolute inset-0 bg-blue-800 opacity-30"></div>
      
      <Image 
        src="/bonequinho.png" 
        width={80}
        height={80}
        alt="Assistente Virtual"
        className="object-cover w-full h-full relative z-10"
      />
    </motion.div>
    {/* Adicione dentro do container do avatar */}
<div className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
  <div className="absolute inset-0 bg-white opacity-10" style={{
    clipPath: 'circle(40% at 30% 30%)'
  }}></div>
</div>
  </div>
</motion.div>
      <motion.header
        className="bg-white shadow-sm border-b border-gray-200"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 relative">
              <Image 
                src="/mendeswear-logo.png" 
                alt="Mendes Wear Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-1.5">
              <span className="text-gray-600 text-sm">Arthur Fernandes</span>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center shadow-inner">
                <span className="text-orange-600 text-sm font-medium">AF</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
            <p className="text-sm text-gray-500">Dados atualizados em tempo real</p>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
            <motion.div variants={itemVariants} className="flex space-x-1 bg-white p-1 rounded-lg border border-gray-200 shadow-inner">
              {['Todas', 'Mercado Livre', 'Shopee'].map((store) => (
                <button
                  key={store}
                  onClick={() => setSelectedStore(store)}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    selectedStore === store
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {store}
                </button>
              ))}
            </motion.div>
            
            <motion.select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-inner"
              variants={itemVariants}
            >
              {['30 dias', '60 dias', '90 dias'].map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </motion.select>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mainMetrics.map((metric, index) => (
            <motion.div
              key={index}
              className="bg-white p-5 rounded-lg shadow border border-gray-200 hover:shadow-md transition-all"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center space-x-2 mb-3">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  {metric.icon}
                </div>
                <h3 className="text-base font-medium text-gray-700">{metric.title}</h3>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  <ChangeIndicator
                    change={metric.change}
                    isPositive={metric.isPositive}
                  />
                </div>
                <span className="text-xs text-gray-500 mb-1 px-2 py-1 bg-gray-100 rounded">
                  {metric.description}
                </span>
              </div>
              <button className="mt-3 w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md text-sm font-medium transition-colors">
                Ver detalhes
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow border border-gray-200 mb-8 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Indicadores Mendy IA</h3>
                <p className="text-sm text-gray-500">Desempenho da inteligência artificial</p>
              </div>
              <div className="flex space-x-2">
                <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">Pré-venda</span>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Pós-venda</span>
              </div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            <motion.div variants={itemVariants} className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <h4 className="text-base font-medium text-gray-800">Pré-venda</h4>
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">IA</span>
              </div>
              
              <div className="space-y-5">
                {[
                  { 
                    label: 'Taxa de respostas', 
                    metric: metrics.indicadoresMendyIA.preVenda.respostasIA,
                    description: 'Percentual de perguntas respondidas pela IA'
                  },
                  { 
                    label: 'Respostas atendentes', 
                    metric: metrics.indicadoresMendyIA.preVenda.respostasAtendentes,
                    description: 'Percentual de perguntas respondidas por humanos'
                  },
                  { 
                    label: 'Precisão da IA', 
                    metric: metrics.indicadoresMendyIA.preVenda.respostasCorretasIA,
                    description: 'Percentual de respostas corretas da IA'
                  },
                  { 
                    label: 'Perguntas não respondidas', 
                    metric: metrics.indicadoresMendyIA.preVenda.perguntasNaoRespondidas,
                    description: 'Percentual de perguntas sem resposta'
                  },
                  { 
                    label: 'Faturamento gerado', 
                    metric: metrics.indicadoresMendyIA.preVenda.faturamentoGeradoIA,
                    description: 'Valor em R$ gerado diretamente pela IA',
                    isCurrency: true
                  },
                ].map((item, index) => {
                  const isPercentage = isPercentageMetric(item.metric);
                  
                  return (
                    <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">{item.label}</p>
                          <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-semibold text-gray-800">
                            {item.isCurrency ? (
                              `R$ ${item.metric.value.toFixed(2).replace('.', ',')}`
                            ) : (
                              `${isPercentage ? item.metric.percentage.toFixed(1) : item.metric.value}%`
                            )}
                          </p>
                          <ChangeIndicator
                            change={item.metric.change}
                            isPositive={item.metric.isPositive}
                          />
                        </div>
                      </div>
                      {isPercentage && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-orange-500 h-1.5 rounded-full" 
                              style={{ width: `${Math.min(100, item.metric.percentage)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-right">Total: {item.metric.value}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <h4 className="text-base font-medium text-gray-800">Pós-venda</h4>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">IA</span>
              </div>
              
              <div className="space-y-5">
                {[
                  { 
                    label: 'Taxa de respostas', 
                    metric: metrics.indicadoresMendyIA.posVenda.respostasIA,
                    description: 'Percentual de mensagens respondidas pela IA'
                  },
                  { 
                    label: 'Respostas atendentes', 
                    metric: metrics.indicadoresMendyIA.posVenda.respostasAtendentes,
                    description: 'Percentual de mensagens respondidas por humanos'
                  },
                  { 
                    label: 'Mensagens consumidores', 
                    metric: metrics.indicadoresMendyIA.posVenda.mensagensConsumidores,
                    description: 'Percentual de mensagens enviadas por clientes'
                  },
                  { 
                    label: 'Média mensagens/pedido', 
                    metric: metrics.indicadoresMendyIA.posVenda.mediaMensagensPorPedido,
                    description: 'Número médio de mensagens por pedido'
                  },
                  { 
                    label: 'Mensagens IA/Total', 
                    metric: metrics.indicadoresMendyIA.posVenda.mensagensIARelacaoTotal,
                    description: 'Relação entre mensagens da IA e total'
                  },
                ].map((item, index) => {
                  const isPercentage = isPercentageMetric(item.metric);
                  
                  return (
                    <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">{item.label}</p>
                          <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-semibold text-gray-800">
                            {isPercentage ? `${item.metric.percentage.toFixed(1)}%` : `${item.metric.value}`}
                          </p>
                          <ChangeIndicator
                            change={item.metric.change}
                            isPositive={item.metric.isPositive}
                          />
                        </div>
                      </div>
                      {isPercentage && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full" 
                              style={{ width: `${Math.min(100, item.metric.percentage)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-right">Total: {item.metric.value}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}