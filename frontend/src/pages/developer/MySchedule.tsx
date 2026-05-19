import React, { useEffect, useState } from 'react'
import { Card, CardTitle, CardBody, Button, LoadingSpinner } from '@components/common'
import { Layout, Header } from '@components/layout/Header'
import { useNavigationStore } from '@stores/navigationStore'

interface Call {
  id: number
  title: string
  start_time: string
  end_time: string
  sales_manager: { first_name: string }
  status: string
}

export const MySchedule: React.FC = () => {
  const { navigate } = useNavigationStore()
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchMySchedule()
  }, [selectedDate])

  const fetchMySchedule = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/calls/my-schedule?date=${selectedDate}`
      )
      const data = await response.json()
      setCalls(data.data || data)
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout hasNavigation={false}>
        <Header title="My Schedule" />
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  return (
    <Layout hasNavigation={false}>
      <Header title="My Schedule" />
      <div className="p-4 space-y-4">
        <Card>
          <CardBody>
            <label className="text-xs text-secondary-600 block mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </CardBody>
        </Card>

        <Card>
          <CardTitle>
            Scheduled Calls - {new Date(selectedDate).toLocaleDateString()}
          </CardTitle>
          <CardBody>
            {calls.length === 0 ? (
              <p className="text-sm text-secondary-600">✅ No calls scheduled for this day</p>
            ) : (
              <div className="space-y-3">
                {calls.map((call) => (
                  <div key={call.id} className="bg-primary-50 p-3 rounded-lg">
                    <p className="font-semibold text-sm">{call.title}</p>
                    <p className="text-xs text-secondary-600 mt-1">
                      👤 {call.sales_manager.first_name}
                    </p>
                    <p className="text-xs text-secondary-600 mt-1">
                      ⏰{' '}
                      {new Date(call.start_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {new Date(call.end_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
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
