import React, { useEffect } from 'react'
import { useAppStore } from '@stores/appStore'
import { useNavigationStore } from '@stores/navigationStore'
import { telegram } from '@services/telegram'
import { LoadingSpinner, EmptyState } from '@components/common'
import { Layout, Header } from '@components/layout/Header'
import { TelegramButton, TelegramMessage } from '@components/telegram'

export const Home: React.FC = () => {
  const { user, loading, fetchUser } = useAppStore()
  const { navigate } = useNavigationStore()

  useEffect(() => {
    telegram.init()
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
      <Header title="👤 Main Menu" />
      <div className="p-4 space-y-4">
        {/* Welcome Message */}
        <TelegramMessage icon="👤">
          Welcome, <span className="font-bold">{user.first_name}</span>
          {'\n\n'}
          <span className="text-xs text-gray-600">
            Role: {user.role}
            {'\n'}
            Status: {user.is_active ? '🟢 Active' : '🔴 Inactive'}
          </span>
        </TelegramMessage>

        {/* Role-based Menu */}
        <div className="space-y-2">
          {user.role === 'admin' && (
            <>
              <TelegramButton onClick={() => navigate('admin/developers')}>
                Manage Developers
              </TelegramButton>
              <TelegramButton onClick={() => navigate('admin/access')}>
                Manage Access
              </TelegramButton>
              <TelegramButton onClick={() => navigate('admin/schedule')}>
                View Schedule
              </TelegramButton>
            </>
          )}

          {user.role === 'sales_manager' && (
            <>
              <TelegramButton onClick={() => navigate('manager/schedule')}>
                📅 Check Schedule
              </TelegramButton>
              <TelegramButton onClick={() => navigate('manager/book-call')}>
                📞 Set Up Call
              </TelegramButton>
              <TelegramButton onClick={() => navigate('manager/my-calls')}>
                ⏸️ My Calls
              </TelegramButton>
            </>
          )}

          {user.role === 'developer' && (
            <TelegramButton onClick={() => navigate('developer/schedule')}>
              📅 My Schedule
            </TelegramButton>
          )}
        </div>

        {/* Role Description */}
        <TelegramMessage>
          {user.role === 'admin' && (
            <>
              You have full access to:
              {'\n\n'}
              • Manage developers
              {'\n'}
              • Manage user access
              {'\n'}
              • View all schedules
              {'\n'}
              • Delete calls
            </>
          )}
          {user.role === 'sales_manager' && (
            <>
              You can:
              {'\n\n'}
              • View developer schedules
              {'\n'}
              • Book calls with developers
              {'\n'}
              • Cancel your own calls
              {'\n'}
              • Toggle notifications
            </>
          )}
          {user.role === 'developer' && (
            <>
              You can:
              {'\n\n'}
              • View your scheduled calls
              {'\n'}
              • See call details
            </>
          )}
        </TelegramMessage>
      </div>
    </Layout>
  )
}
