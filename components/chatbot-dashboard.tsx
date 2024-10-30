'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { 
  MessageSquare, 
  Users, 
  Megaphone,
  MapPin,
  Building2,
  Share2,
  ChevronDown,
  ChevronUp,
  LineChart,
  Sun,
  Moon
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { 
  PieChart, 
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import 'tailwindcss/tailwind.css'

interface MetricCardProps {
  title: string
  value: string
  icon: React.ElementType
  color: string
  description: string
}

const AnimatedMetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color, description }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Card 
      className={`p-6 transform transition-all duration-500 hover:scale-105 cursor-pointer 
        ${isHovered ? 'shadow-xl' : 'shadow'} bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{title}</p>
          <p className={`text-3xl font-bold transition-all duration-500 ${isHovered ? 'scale-110' : ''} text-gray-800 dark:text-white`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
          <Icon size={24} className={`${color} transition-transform duration-500 ${isHovered ? 'rotate-12' : ''}`} />
        </div>
      </div>
      <div className={`mt-4 text-sm text-gray-600 dark:text-gray-400 transition-all duration-500 ${
        isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
      }`}>
        {description}
      </div>
    </Card>
  )
}

interface TopicAnalysisProps {
  id: string
  topic: string
  percentage: number
  examples: string[]
  color: string
  isExpanded: boolean
  onToggle: () => void
}

const TopicAnalysis: React.FC<TopicAnalysisProps> = ({ id, topic, percentage, examples, color, isExpanded, onToggle }) => {
  return (
    <Card 
      id={id}
      className={`mb-4 overflow-hidden transition-all duration-500 hover:shadow-lg
        ${isExpanded ? 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-800' : 'bg-white dark:bg-gray-900'}`}
    >
      <div 
        className="p-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: color }} />
            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">{topic}</h3>
              <p className="text-gray-600 dark:text-gray-400">{percentage}% de las consultas</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{percentage}%</span>
            {isExpanded ? <ChevronUp className="text-gray-600 dark:text-gray-400" /> : <ChevronDown className="text-gray-600 dark:text-gray-400" />}
          </div>
        </div>
        
        <div className={`mt-4 transition-all duration-500 ${
          isExpanded ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'
        }`}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-3 text-purple-600 dark:text-purple-400">Ejemplos de consultas frecuentes:</h4>
            <ul className="space-y-2">
              {examples.map((example, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 dark:bg-purple-500" />
                  {example}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  )
}

interface RecommendationCardProps {
  title: string
  description: string
  icon: React.ElementType
  metrics?: Array<{ label: string; value: string }>
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ title, description, icon: Icon, metrics }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <Card 
      className={`p-6 mb-4 cursor-pointer transition-all duration-500 hover:shadow-lg
        ${isExpanded ? 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-800' : 'bg-white dark:bg-gray-900'}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full bg-purple-100 dark:bg-purple-800 transition-all duration-500 
          ${isExpanded ? 'bg-purple-200 dark:bg-purple-700' : ''}`}>
          <Icon size={24} className="text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
          
          {metrics && (
            <div className={`grid grid-cols-2 gap-4 mt-4 transition-all duration-500 
              ${isExpanded ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'}`}>
              {metrics.map((metric, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{metric.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export function ChatbotDashboard() {
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState<boolean>(false)

  useEffect(() => {
    if (expandedTopicId) {
      const element = document.getElementById(expandedTopicId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [expandedTopicId])

  const topicsData = useMemo(() => [
    { 
      topic: "Información sobre dengue",
      percentage: 55.0,
      color: '#6A0DAD',
      examples: [
        "¿Qué es el dengue?",
        "¿Cómo se transmite el dengue?",
        "¿Cuánto dura el dengue?"
      ]
    },
    {
      topic: "Consultas generales",
      percentage: 21.7,
      color: '#0057B7',
      examples: [
        "¿Cómo funciona este servicio?",
        "¿Qué información tienen disponible?",
        "¿En qué horario atienden?"
      ]
    },
    {
      topic: "Consulta de centros de salud",
      percentage: 8.3,
      color: '#008000',
      examples: [
        "¿Dónde hay centros cercanos?",
        "¿Qué centros atienden casos de dengue?",
        "¿Horarios de atención de los centros?"
      ]
    },
    {
      topic: "Síntomas",
      percentage: 8.3,
      color: '#FFD700',
      examples: [
        "¿Cuáles son los síntomas?",
        "¿Cómo sé si tengo dengue?",
        "¿Cuándo debo ir al médico?"
      ]
    },
    {
      topic: "Vacuna",
      percentage: 5.0,
      color: '#D2042D',
      examples: [
        "¿Existe vacuna contra el dengue?",
        "¿Dónde puedo vacunarme?",
        "¿Cuánto cuesta la vacuna?"
      ]
    },
    {
      topic: "Prevención",
      percentage: 1.7,
      color: '#4B0082',
      examples: [
        "¿Cómo prevenir el dengue?",
        "¿Qué repelente usar?",
        "¿Cómo eliminar criaderos?"
      ]
    }
  ], [])

  // Datos para el gráfico de pastel
  const pieData = topicsData.map(topic => ({
    name: topic.topic,
    value: topic.percentage,
    color: topic.color
  }))

  const marketingRecommendations = useMemo(() => [
    {
      title: "Campaña en Espacios Públicos",
      description: "Implementar códigos QR en paradas de colectivo, centros de salud y plazas principales para acceso directo al chatbot.",
      icon: MapPin,
    },
    {
      title: "Alianzas Estratégicas",
      description: "Colaborar con centros de salud locales y farmacias para promocionar el chatbot mediante material impreso y recomendación directa.",
      icon: Building2,
    },
    {
      title: "Difusión en Redes Sociales",
      description: "Crear contenido informativo sobre prevención del dengue que redirija al chatbot a través de las redes sociales municipales.",
      icon: Share2,
    }
  ], [])

  // Función para crear un slug a partir del nombre del tema
  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <header className="max-w-6xl mx-auto mb-12 text-center">
          <div className="flex justify-end">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
            >
              {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-600" />}
            </button>
          </div>
          <div className="inline-block animate-bounce mb-4">
            <Megaphone size={48} className="text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Municipalidad de Frontera - Métricas del Chatbot
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Potenciando la prevención del dengue en nuestra comunidad
          </p>
        </header>

        {/* Resumen Ejecutivo */}
        <section className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Resumen</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Desde su lanzamiento el 17 de octubre, el chatbot ha interactuado con <span className="font-bold">60 usuarios</span>, con un promedio de <span className="font-bold">4.3 mensajes por usuario</span>. El tema más consultado es <span className="font-bold">&quot;Información sobre dengue&quot;</span>, representando el <span className="font-bold">55%</span> de las consultas totales.
          </p>
        </section>

        <section className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedMetricCard
              title="Interacciones Totales"
              value="60"
              icon={MessageSquare}
              color="text-purple-600 dark:text-purple-400"
              description="Conversaciones únicas iniciadas con el chatbot"
            />
            <AnimatedMetricCard
              title="Promedio Mensajes/Usuario"
              value="4.3"
              icon={Users}
              color="text-blue-600 dark:text-blue-400"
              description="Nivel de engagement por usuario"
            />
          </div>
        </section>

        <section className="max-w-6xl mx-auto mb-12">
          <div className="flex items-center gap-2 mb-6">
            <LineChart className="text-purple-600 dark:text-purple-400" size={24} />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Análisis por Tema</h2>
          </div>

          {/* Gráfico de círculos con animaciones y leyendas */}
          <Card className="mb-6 p-6 bg-white dark:bg-gray-900">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Distribución de Consultas por Tema</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      onClick={() => {
                        const id = slugify(entry.name)
                        setExpandedTopicId(id)
                      }}
                      cursor="pointer"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white dark:bg-gray-800 p-2 rounded shadow">
                          <p className="text-gray-800 dark:text-white font-bold">{data.name}</p>
                          <p className="text-gray-600 dark:text-gray-400">{`Porcentaje: ${data.value}%`}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Leyenda personalizada */}
            <div className="flex flex-wrap justify-center mt-4">
              {pieData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center mx-2 my-1">
                  <div className="w-3 h-3 mr-2" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm text-gray-800 dark:text-gray-200">{entry.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {topicsData.map((topic, index) => (
              <TopicAnalysis
                key={index}
                id={slugify(topic.topic)}
                topic={topic.topic}
                percentage={topic.percentage}
                examples={topic.examples}
                color={topic.color}
                isExpanded={expandedTopicId === slugify(topic.topic)}
                onToggle={() => {
                  const id = slugify(topic.topic)
                  setExpandedTopicId(expandedTopicId === id ? null : id)
                }}
              />
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
            <Megaphone className="text-purple-600 dark:text-purple-400" />
            Estrategias de Difusión Municipal
          </h2>
          <div className="space-y-4">
            {marketingRecommendations.map((rec, index) => (
              <RecommendationCard
                key={index}
                title={rec.title}
                description={rec.description}
                icon={rec.icon}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
