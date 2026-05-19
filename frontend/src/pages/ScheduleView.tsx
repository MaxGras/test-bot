import React, { useEffect, useState } from 'react'
import { LoadingSpinner } from '@components/common'
import { Layout, Header } from '@components/layout/Header'
import { TelegramButton, TelegramMessage } from '@components/telegram'
import { useNavigationStore } from '@stores/navigationStore'

interface Developer {
  id: number
  name: string
}

interface Call {
  id: number
  title: string
  start_time: string
  end_time: string
}

export const ScheduleView: React.FC = () => {
  const { navigate } = useNavigationStore()
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'developer' | 'date' | 'view'>('developer')

  useEffect(() => {
    fetchDevelopers()
  }, [])

  const fetchDevelopers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/developers`)
      const data = await response.json()
      setDevelopers(data.items || data)
    } catch (error) {
      console.error('Error fetching developers:', error)
    }
  }

  const handleSelectDeveloper = (dev: Developer) => {
    setSelectedDeveloper(dev)
    setStep('date')
  }

  const handleSelectDate = async () => {
    if (!selectedDeveloper) return

    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/developers/${selectedDeveloper.id}/calls?date=${selectedDate}`
      )
      const data = await response.json()
      setCalls(Array.isArray(data) ? data : data.items || [])
      setStep('view')
    } catch (error) {
      console.error('Error fetching calls:', error)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'developer') {
    return (
      <Layout hasNavigation={false}>
        <Header title="📅 View Schedule" />
        <div className="p-4 space-y-4">
          <TelegramMessage icon="👨‍💻">
            Choose a developer:
          </TelegramMessage>

          <div className="space-y-2">
            {developers.length === 0 ? (
              <TelegramMessage>❌ No developers yet</TelegramMessage>
            ) : (
              developers.map((dev) => (
                <TelegramButton
                  key={dev.id}
                  onClick={() => handleSelectDeveloper(dev)}
                >
                  👨‍💻 {dev.name}
                </TelegramButton>
              ))
            )}
          </div>

          <TelegramButton onClick={() => navigate('home')} variant="secondary">
            🔙 Back
          </TelegramButton>
        </div>
      </Layout>
    )
  }

  if (step === 'date') {
    return (
      <Layout hasNavigation={false}>
        <Header title="📅 Select Date" />
        <div className="p-4 space-y-4">
          <TelegramMessage icon="📅">
            {`Selected: 👨‍💻 ${selectedDeveloper?.name}\n\nChoose a date:`}
          </TelegramMessage>

          <div className="space-y-2">
            <TelegramButton onClick={() => {
              setSelectedDate(new Date().toISOString().split('T')[0])
              handleSelectDate()
            }}>
              📌 Today
            </TelegramButton>
            <TelegramButton onClick={() => {
              const tomorrow = new Date()
              tomorrow.setDate(tomorrow.getDate() + 1)
              setSelectedDate(tomorrow.toISOString().split('T')[0])
              handleSelectDate()
            }}>
              📌 Tomorrow
            </TelegramButton>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-600 mb-2">Or pick custom date:</p>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="space-y-2 mt-4">
            <TelegramButton onClick={handleSelectDate} disabled={loading}>
              {loading ? '⏳ Loading...' : '📅 View Schedule'}
            </TelegramButton>
            <TelegramButton onClick={() => setStep('developer')} variant="secondary">
              🔙 Change Developer
            </TelegramButton>
            <TelegramButton onClick={() => navigate('home')} variant="secondary">
              🏠 Home
            </TelegramButton>
          </div>
        </div>
      </Layout>
    )
  }

  if (loading) {
    return (
      <Layout hasNavigation={false}>
        <Header title="📅 Loading..." />
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  return (
    <Layout hasNavigation={false}>
      <Header title="📅 Schedule" />
      <div className="p-4 space-y-4">
        <TelegramMessage icon="📅">
          {`Schedule for ${selectedDeveloper?.name}\n${selectedDate}`}
        </TelegramMessage>

        {calls.length === 0 ? (
          <TelegramMessage icon="✅">
            No calls scheduled
          </TelegramMessage>
        ) : (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-2">
            {calls.map((call) => {
              const startTime = new Date(call.start_time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })
              const endTime = new Date(call.end_time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })
              return (
                <div key={call.id} className="text-sm">
                  <p className="font-semibold">• {call.title}</p>
                  <p className="text-xs text-gray-600">⏰ {startTime} - {endTime}</p>
                </div>
              )
            })}
          </div>
        )}

        <div className="space-y-2">
          <TelegramButton onClick={() => setStep('date')}>
            📅 Another Day
          </TelegramButton>
          <TelegramButton onClick={() => navigate('home')} variant="secondary">
            🔙 Back to Menu
          </TelegramButton>
        </div>
      </div>
    </Layout>
  )
}
