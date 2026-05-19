import React, { useEffect } from 'react'
import { useAppStore } from '@stores/appStore'
import { telegram } from '@services/telegram'
import { Card, CardTitle, CardBody, LoadingSpinner, EmptyState } from '@components/common'
import { Layout, Header } from '@components/layout/Header'

export const Home: React.FC = () => {
  const { user, loading, fetchUser } = useAppStore()

  useEffect(() => {
    // Initialize Telegram
    telegram.init()

    // Get Telegram user
    const tgUser = telegram.getTelegramUser()
    if (tgUser) {
      fetchUser(tgUser.id)
    }
  }, [fetchUser])

  if (loading) {
    return (
      <Layout hasNavigation={false}>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout hasNavigation={false}>
        <div className="p-4">
          <EmptyState
            icon="👤"
            title="No Access"
            message="You don't have access to this application. Please contact administrator."
          />
        </div>
      </Layout>
    )
  }

  return (
    <Layout hasNavigation={false}>
      <Header title="Developer Call Scheduler" />
      <div className="p-4 space-y-4">
        {/* User Info Card */}
        <Card>
          <CardBody>
            <div className="space-y-2">
              <p className="text-sm text-secondary-600">
                Welcome, <span className="font-semibold">{user.first_name}</span>
              </p>
              <p className="text-xs text-secondary-500">Role: {user.role}</p>
              <p className="text-xs text-secondary-500">Status: {user.is_active ? '✓ Active' : '✗ Inactive'}</p>
            </div>
          </CardBody>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardTitle>Quick Info</CardTitle>
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 p-3 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">—</p>
                <p className="text-xs text-secondary-600">Upcoming Calls</p>
              </div>
              <div className="bg-success-50 p-3 rounded-lg">
                <p className="text-2xl font-bold text-success-600">—</p>
                <p className="text-xs text-secondary-600">Completed Calls</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Role Info */}
        <Card>
          <CardTitle>Your Role</CardTitle>
          <CardBody>
            <p className="text-sm text-secondary-700">
              {user.role === 'admin' &&
                'You have full access to manage developers, users, calls, and view all schedules.'}
              {user.role === 'sales_manager' &&
                'You can view developer schedules and book calls with developers.'}
              {user.role === 'developer' &&
                'You are a developer and can view your scheduled calls.'}
            </p>
          </CardBody>
        </Card>
      </div>
    </Layout>
  )
}
