import React, { useEffect, useState } from 'react'
import { Card, CardTitle, CardBody, Button, Input } from '@components/common'
import { Layout, Header } from '@components/layout/Header'
import { useNavigationStore } from '@stores/navigationStore'

interface Developer {
  id: number
  name: string
}

interface TimeSlot {
  time: string
  available: boolean
}

export const BookCall: React.FC = () => {
  const { navigate } = useNavigationStore()
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [callTitle, setCallTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'developer' | 'date' | 'time' | 'details'>('developer')

  useEffect(() => {
    fetchDevelopers()
  }, [])

  const fetchDevelopers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/developers`)
      const data = await response.json()
      setDevelopers(data.data || data)
    } catch (error) {
      console.error('Error fetching developers:', error)
    }
  }

  const fetchTimeSlots = async () => {
    if (!selectedDeveloper) return

    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/developers/${selectedDeveloper.id}/available-slots?date=${selectedDate}`
      )
      const data = await response.json()
      setTimeSlots(data)
      setStep('time')
    } catch (error) {
      console.error('Error fetching time slots:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookCall = async () => {
    if (!selectedDeveloper || !selectedTime || !callTitle.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/calls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: callTitle,
          developer_id: selectedDeveloper.id,
          start_time: `${selectedDate}T${selectedTime}:00`,
          end_time: `${selectedDate}T${new Date(new Date(`2024-01-01T${selectedTime}:00`).getTime() + 3600000).toTimeString().slice(0, 5)}:00`,
        }),
      })

      if (response.ok) {
        alert('✅ Call booked successfully!')
        navigate('manager/my-calls')
      }
    } catch (error) {
      console.error('Error booking call:', error)
      alert('❌ Error booking call')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'developer') {
    return (
      <Layout hasNavigation={false}>
        <Header title="Set Up Call" />
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
                      onClick={() => {
                        setSelectedDeveloper(dev)
                        setStep('date')
                      }}
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
            <Button onClick={fetchTimeSlots} className="w-full" disabled={loading}>
              {loading ? 'Loading...' : '📅 Check Available Times'}
            </Button>
            <Button onClick={() => setStep('developer')} className="w-full">
              🔙 Change Developer
            </Button>
            <Button onClick={() => navigate('home')} className="w-full">
              🏠 Home
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  if (step === 'time') {
    return (
      <Layout hasNavigation={false}>
        <Header title="Select Time" />
        <div className="p-4 space-y-4">
          <Card>
            <CardTitle>Available Times</CardTitle>
            <CardBody>
              {timeSlots.length === 0 ? (
                <p className="text-sm text-secondary-600">❌ No available slots</p>
              ) : (
                <div className="space-y-2">
                  {timeSlots
                    .filter((slot) => slot.available)
                    .map((slot) => (
                      <Button
                        key={slot.time}
                        onClick={() => {
                          setSelectedTime(slot.time)
                          setStep('details')
                        }}
                        className="w-full text-left"
                      >
                        🕐 {slot.time}
                      </Button>
                    ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Button onClick={() => setStep('date')} className="w-full">
            📅 Change Date
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout hasNavigation={false}>
      <Header title="Confirm Call" />
      <div className="p-4 space-y-4">
        <Card>
          <CardTitle>Call Details</CardTitle>
          <CardBody>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-secondary-600">Developer</p>
                <p className="text-sm font-semibold">👨‍💻 {selectedDeveloper?.name}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-600">Date & Time</p>
                <p className="text-sm font-semibold">📅 {selectedDate} at {selectedTime}</p>
              </div>
              <Input
                placeholder="Call title"
                value={callTitle}
                onChange={(e) => setCallTitle(e.target.value)}
              />
            </div>
          </CardBody>
        </Card>

        <div className="space-y-2">
          <Button onClick={handleBookCall} className="w-full" disabled={loading}>
            {loading ? 'Booking...' : '✅ Book Call'}
          </Button>
          <Button onClick={() => setStep('time')} className="w-full">
            🔙 Change Time
          </Button>
          <Button onClick={() => navigate('home')} className="w-full">
            🏠 Home
          </Button>
        </div>
      </div>
    </Layout>
  )
}
