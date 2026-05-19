import React, { useEffect, useState } from 'react'
import { Card, CardTitle, CardBody, Button, LoadingSpinner } from '@components/common'
import { Layout, Header } from '@components/layout/Header'
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
      setDevelopers(data)
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
      setCalls(data)
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
        <Header title="View Schedule" />
        <div className="p-4 space-y-4">
          <Card>
            <CardTitle>Select Developer</CardTitle>
            <CardBody>
              {developers.length === 0 ? (
                <p className="text-sm text-secondary-600">No developers available</p>
              ) : (
                <div className="space-y-2">
                  {developers.map((dev) => (
                    <Button
                      key={dev.id}
                      onClick={() => handleSelectDeveloper(dev)}
                      className="w-full text-left"
                    >
                      👨‍💻 {dev.name}
                    </Button>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Button onClick={() => navigate('home')} className="w-full">
            🔙 Back to Menu
          </Button>
        </div>
      </Layout>
    )
  }

  if (step === 'date') {
    return (
      <Layout hasNavigation={false}>
        <Header title="Select Date" />
        <div className="p-4 space-y-4">
          <Card>
            <CardBody>
              <p className="text-sm font-semibold mb-3">👨‍💻 {selectedDeveloper?.name}</p>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </CardBody>
          </Card>

          <div className="space-y-2">
            <Button onClick={handleSelectDate} className="w-full">
              📅 View Schedule
            </Button>
            <Button onClick={() => setStep('developer')} className="w-full">
              🔙 Change Developer
            </Button>
            <a href="/" className="block">
              <Button className="w-full">🏠 Home</Button>
            </a>
          </div>
        </div>
      </Layout>
    )
  }

  if (loading) {
    return (
      <Layout hasNavigation={false}>
        <Header title="Schedule" />
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  return (
    <Layout hasNavigation={false}>
      <Header title="Schedule" />
      <div className="p-4 space-y-4">
        <Card>
          <CardTitle>
            {selectedDeveloper?.name} - {selectedDate}
          </CardTitle>
          <CardBody>
            {calls.length === 0 ? (
              <p className="text-sm text-secondary-600">✅ No calls scheduled</p>
            ) : (
              <div className="space-y-2">
                {calls.map((call) => (
                  <div key={call.id} className="bg-primary-50 p-3 rounded-lg">
                    <p className="text-sm font-semibold">{call.title}</p>
                    <p className="text-xs text-secondary-600">
                      {call.start_time} - {call.end_time}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <div className="space-y-2">
          <Button onClick={() => setStep('date')} className="w-full">
            📅 Another Day
          </Button>
          <a href="/" className="block">
            <Button className="w-full">🏠 Home</Button>
          </a>
        </div>
      </div>
    </Layout>
  )
}
