import React, { useEffect } from 'react'
import { Home } from '@pages/Home'
import { Modal } from '@components/common'
import { useModalStore } from '@stores/appStore'

export const App: React.FC = () => {
  const { modal, hideModal } = useModalStore()

  useEffect(() => {
    // Prevent zoom on iOS
    document.addEventListener('touchmove', (e) => {
      if ((e as any).scale !== 1) {
        e.preventDefault()
      }
    })
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen">
      <Home />

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
