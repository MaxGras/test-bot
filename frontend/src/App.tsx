import React, { useEffect, useState } from 'react'
import { Home } from '@pages/Home'
import { DeveloperManagement } from '@pages/admin/DeveloperManagement'
import { AccessManagement } from '@pages/admin/AccessManagement'
import { ScheduleView } from '@pages/ScheduleView'
import { BookCall } from '@pages/manager/BookCall'
import { MyCalls } from '@pages/manager/MyCalls'
import { MySchedule } from '@pages/developer/MySchedule'
import { Modal } from '@components/common'
import { useModalStore } from '@stores/appStore'

export const App: React.FC = () => {
  const { modal, hideModal } = useModalStore()
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    // Prevent zoom on iOS
    document.addEventListener('touchmove', (e) => {
      if ((e as any).scale !== 1) {
        e.preventDefault()
      }
    })

    // Handle hash-based routing
    const handleHashChange = () => {
      const path = window.location.hash.slice(1) || 'home'
      setCurrentPage(path)
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()

    return () => window.removeEventListener('hashchange', handleHashChange)
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
      case '':
        return <Home />
      default:
        return <Home />
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {renderPage()}

      {/* Global Modal */}
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
