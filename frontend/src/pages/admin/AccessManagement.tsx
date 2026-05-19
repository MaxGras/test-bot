import React, { useEffect, useState } from 'react'
import { Card, CardTitle, CardBody, Button, LoadingSpinner, Input } from '@components/common'
import { Layout, Header } from '@components/layout/Header'
import { useNavigationStore } from '@stores/navigationStore'

interface User {
  id: number
  telegram_id: number
  first_name: string
  role: string
  is_active: boolean
}

export const AccessManagement: React.FC = () => {
  const { navigate } = useNavigationStore()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newTelegramId, setNewTelegramId] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`)
      const data = await response.json()
      setUsers(data.data || data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async () => {
    if (!newTelegramId.trim()) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_id: parseInt(newTelegramId),
          role: 'sales_manager',
        }),
      })

      if (response.ok) {
        setNewTelegramId('')
        setShowAdd(false)
        await fetchUsers()
        alert('✅ User added')
      } else {
        alert('❌ Error adding user')
      }
    } catch (error) {
      console.error('Error adding user:', error)
      alert('❌ Error adding user')
    }
  }

  const handleRemoveUser = async (userId: number) => {
    if (!confirm('Remove access for this user?')) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchUsers()
        setSelectedUser(null)
        alert('✅ User removed')
      }
    } catch (error) {
      console.error('Error removing user:', error)
      alert('❌ Error removing user')
    }
  }

  if (loading) {
    return (
      <Layout hasNavigation={false}>
        <Header title="Manage Access" />
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  if (selectedUser) {
    return (
      <Layout hasNavigation={false}>
        <Header title="User Details" />
        <div className="p-4 space-y-4">
          <Card>
            <CardBody>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-secondary-600">Name</p>
                  <p className="text-sm font-semibold">{selectedUser.first_name}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600">Telegram ID</p>
                  <p className="text-sm font-semibold">{selectedUser.telegram_id}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600">Role</p>
                  <p className="text-sm font-semibold">{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600">Status</p>
                  <p className="text-sm font-semibold">
                    {selectedUser.is_active ? '✅ Active' : '❌ Inactive'}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="space-y-2">
            <Button
              onClick={() => handleRemoveUser(selectedUser.id)}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              🗑️ Remove Access
            </Button>
            <Button onClick={() => setSelectedUser(null)} className="w-full">
              🔙 Back
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout hasNavigation={false}>
      <Header title="Manage Access" />
      <div className="p-4 space-y-4">
        {showAdd ? (
          <Card>
            <CardTitle>Add User</CardTitle>
            <CardBody>
              <div className="space-y-3">
                <Input
                  type="number"
                  placeholder="Telegram User ID"
                  value={newTelegramId}
                  onChange={(e) => setNewTelegramId(e.target.value)}
                />
                <div className="space-y-2">
                  <Button onClick={handleAddUser} className="w-full">
                    ✅ Add User
                  </Button>
                  <Button onClick={() => setShowAdd(false)} className="w-full">
                    ❌ Cancel
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
            <Card>
              <CardTitle>Users with Access</CardTitle>
              <CardBody>
                {users.length === 0 ? (
                  <p className="text-sm text-secondary-600">No users yet</p>
                ) : (
                  <div className="space-y-2">
                    {users.map((user) => (
                      <Button
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className="w-full text-left"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold">{user.first_name}</p>
                          <p className="text-xs text-secondary-600">
                            {user.role} • {user.is_active ? '✅' : '❌'}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            <Button onClick={() => setShowAdd(true)} className="w-full">
              ➕ Add User
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
