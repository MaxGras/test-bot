import React, { useEffect, useState } from 'react'
import { Card, CardTitle, CardBody, Button, LoadingSpinner, Input } from '@components/common'
import { Layout, Header } from '@components/layout/Header'
import { useNavigationStore } from '@stores/navigationStore'

interface Developer {
  id: number
  name: string
  user_id: number
}

export const DeveloperManagement: React.FC = () => {
  const { navigate } = useNavigationStore()
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newDeveloperName, setNewDeveloperName] = useState('')
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null)

  useEffect(() => {
    fetchDevelopers()
  }, [])

  const fetchDevelopers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/developers`)
      const data = await response.json()
      setDevelopers(data.items || data)
    } catch (error) {
      console.error('Error fetching developers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDeveloper = async () => {
    if (!newDeveloperName.trim()) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/developers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDeveloperName }),
      })

      if (response.ok) {
        setNewDeveloperName('')
        setShowCreate(false)
        await fetchDevelopers()
      }
    } catch (error) {
      console.error('Error creating developer:', error)
    }
  }

  if (loading && developers.length === 0) {
    return (
      <Layout hasNavigation={false}>
        <Header title="Manage Developers" />
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  if (selectedDeveloper) {
    return (
      <Layout hasNavigation={false}>
        <Header title={selectedDeveloper.name} />
        <div className="p-4 space-y-4">
          <Card>
            <CardBody>
              <p className="text-sm">👨‍💻 {selectedDeveloper.name}</p>
            </CardBody>
          </Card>

          <Button onClick={() => setSelectedDeveloper(null)} className="w-full">
            🔙 Back
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout hasNavigation={false}>
      <Header title="Manage Developers" />
      <div className="p-4 space-y-4">
        {showCreate ? (
          <Card>
            <CardTitle>Create Developer</CardTitle>
            <CardBody>
              <div className="space-y-3">
                <Input
                  placeholder="Developer name"
                  value={newDeveloperName}
                  onChange={(e) => setNewDeveloperName(e.target.value)}
                />
                <div className="space-y-2">
                  <Button onClick={handleCreateDeveloper} className="w-full">
                    ✅ Create
                  </Button>
                  <Button onClick={() => setShowCreate(false)} className="w-full">
                    ❌ Cancel
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
            <Card>
              <CardTitle>Developers</CardTitle>
              <CardBody>
                {developers.length === 0 ? (
                  <p className="text-sm text-secondary-600">No developers yet</p>
                ) : (
                  <div className="space-y-2">
                    {developers.map((dev) => (
                      <Button
                        key={dev.id}
                        onClick={() => setSelectedDeveloper(dev)}
                        className="w-full text-left"
                      >
                        👨‍💻 {dev.name}
                      </Button>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            <Button onClick={() => setShowCreate(true)} className="w-full">
              ➕ Create Developer
            </Button>

            <Button onClick={() => navigate('home')} className="w-full">
              🔙 Back to Menu
            </Button>
          </>
        )}
      </div>
    </Layout>
  )
}
