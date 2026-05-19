import React, { useEffect, useState } from 'react'
import { Card, CardTitle, CardBody, Button, LoadingSpinner } from '@components/common'
import { Layout, Header } from '@components/layout/Header'

interface Call {
  id: number
  title: string
  developer_id: number
  developer: { name: string }
  start_time: string
  end_time: string
  status: string
}

export const MyCalls: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCall, setSelectedCall] = useState<Call | null>(null)

  useEffect(() => {
    fetchMyCalls()
  }, [])

  const fetchMyCalls = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/my-calls`)
      const data = await response.json()
      setCalls(data)
    } catch (error) {
      console.error('Error fetching calls:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSuspendCall = async (callId: number) => {
    if (!confirm('Are you sure you want to suspend this call?')) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/calls/${callId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCalls(calls.filter((c) => c.id !== callId))
        setSelectedCall(null)
        alert('✅ Call suspended')
      }
    } catch (error) {
      console.error('Error suspending call:', error)
      alert('❌ Error suspending call')
    }
  }

  if (loading) {
    return (
      <Layout hasNavigation={false}>
        <Header title="My Calls" />
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  if (selectedCall) {
    return (
      <Layout hasNavigation={false}>
        <Header title="Call Details" />
        <div className="p-4 space-y-4">
          <Card>
            <CardBody>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-secondary-600">Title</p>
                  <p className="text-sm font-semibold">{selectedCall.title}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600">Developer</p>
                  <p className="text-sm font-semibold">👨‍💻 {selectedCall.developer.name}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600">Date & Time</p>
                  <p className="text-sm font-semibold">
                    📅 {new Date(selectedCall.start_time).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600">Status</p>
                  <p className="text-sm font-semibold">{selectedCall.status}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="space-y-2">
            <Button
              onClick={() => handleSuspendCall(selectedCall.id)}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              ⏸️ Suspend Call
            </Button>
            <Button onClick={() => setSelectedCall(null)} className="w-full">
              🔙 Back
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout hasNavigation={false}>
      <Header title="My Calls" />
      <div className="p-4 space-y-4">
        <Card>
          <CardTitle>Your Scheduled Calls</CardTitle>
          <CardBody>
            {calls.length === 0 ? (
              <p className="text-sm text-secondary-600">No calls scheduled</p>
            ) : (
              <div className="space-y-2">
                {calls.map((call) => (
                  <Button
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className="w-full text-left"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">{call.title}</p>
                      <p className="text-xs text-secondary-600">
                        👨‍💻 {call.developer.name} • 📅{' '}
                        {new Date(call.start_time).toLocaleDateString()}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <div className="space-y-2">
          <a href="#/manager/book-call" className="block">
            <Button className="w-full">📞 Book New Call</Button>
          </a>
          <a href="#/home" className="block">
            <Button className="w-full">🔙 Back to Menu</Button>
          </a>
        </div>
      </div>
    </Layout>
  )
}
