import React, { useEffect } from 'react'
import { Home } from '@pages/Home'
import { DeveloperManagement } from '@pages/admin/DeveloperManagement'
import { AccessManagement } from '@pages/admin/AccessManagement'
import { ScheduleView } from '@pages/ScheduleView'
import { BookCall } from '@pages/manager/BookCall'
import { MyCalls } from '@pages/manager/MyCalls'
import { MySchedule } from '@pages/developer/MySchedule'
import { Modal } from '@components/common'
import { useModalStore } from '@stores/appStore'
import { useNavigationStore } from '@stores/navigationStore'

export const App: React.FC = () => {
  const { modal, hideModal } = useModalStore()
  const { currentPage } = useNavigationStore()

  useEffect(() => {
    document.addEventListener('touchmove', (e) => {
      if ((e as any).scale !== 1) {
        e.preventDefault()
      }
    })
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'admin/developers':
        return <DeveloperManagement />
      case 'admin/access':
        return <AccessManagement />
      case 'admin/schedule':
        return <ScheduleView />
      case 'manager/schedule':
        return <ScheduleView />
      case 'manager/book-call':
        return <BookCall />
      case 'manager/my-calls':
        return <MyCalls />
      case 'developer/schedule':
        return <MySchedule />
      case 'home':
      default:
        return <Home />
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {renderPage()}

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={hideModal}
      />
    </div>
  )
}
