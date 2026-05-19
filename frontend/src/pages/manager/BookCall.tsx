import React, { useEffect, useState } from 'react'
import { Input } from '@components/common'
import { Layout, Header } from '@components/layout/Header'
import { TelegramButton, TelegramMessage } from '@components/telegram'
import { useNavigationStore } from '@stores/navigationStore'

interface Developer {
  id: number
  name: string
}

export const BookCall: React.FC = () => {
  const { navigate } = useNavigationStore()
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [duration, setDuration] = useState<30 | 60 | 90>(60)
  const [callTitle, setCallTitle] = useState('')
  const [callLink, setCallLink] = useState('')
  const [salaryFork, setSalaryFork] = useState('')
  const [jobPostLink, setJobPostLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [step, setStep] = useState<'developer' | 'date' | 'time' | 'duration' | 'account' | 'link' | 'salary' | 'job' | 'confirm'>('developer')

  useEffect(() => {
    fetchDevelopers()
  }, [])

  const fetchDevelopers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/developers`)
      const data = await response.json()
      setDevelopers(data.items || data)
    } catch (error) {
      console.error('Error fetching developers:', error)
    }
  }

  const handleBookCall = async () => {
    if (!selectedDeveloper || !selectedTime || !callTitle.trim()) return

    setLoading(true)
    setError('')
    try {
      const startDateTime = `${selectedDate}T${selectedTime}:00`
      const endDate = new Date(startDateTime)
      endDate.setMinutes(endDate.getMinutes() + duration)
      const endDateTime = endDate.toISOString().split('.')[0]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/calls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          developer_id: selectedDeveloper.id,
          start_time: startDateTime,
          end_time: endDateTime,
          title: callTitle,
          call_link: callLink || null,
          salary_fork: salaryFork || null,
          job_post_link: jobPostLink || null,
        }),
      })

      if (response.ok) {
        navigate('manager/my-calls')
      } else {
        const data = await response.json()
        setError(data.detail || 'Error booking call')
      }
    } catch (error) {
      console.error('Error booking call:', error)
      setError('Error booking call. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 1: Select Developer
  if (step === 'developer') {
    return (
      <Layout hasNavigation={false}>
        <Header title="📞 Set Up Call" />
        <div className="p-4 space-y-4">
          <TelegramMessage icon="👨‍💻">
            Select a developer:
          </TelegramMessage>

          <div className="space-y-2">
            {developers.length === 0 ? (
              <TelegramMessage>❌ No developers available</TelegramMessage>
            ) : (
              developers.map((dev) => (
                <TelegramButton
                  key={dev.id}
                  onClick={() => {
                    setSelectedDeveloper(dev)
                    setStep('date')
                  }}
                >
                  👨‍💻 {dev.name}
                </TelegramButton>
              ))
            )}
          </div>

          <TelegramButton onClick={() => navigate('home')} variant="secondary">
            🔙 Back
          </TelegramButton>
        </div>
      </Layout>
    )
  }

  // Step 2: Select Date
  if (step === 'date') {
    return (
      <Layout hasNavigation={false}>
        <Header title="📅 Select Date" />
        <div className="p-4 space-y-4">
          <TelegramMessage icon="📅">
            {`When should the call be?\n\nSelected: 👨‍💻 ${selectedDeveloper?.name}`}
          </TelegramMessage>

          <div className="space-y-2">
            <TelegramButton onClick={() => {
              setSelectedDate(new Date().toISOString().split('T')[0])
              setStep('time')
            }}>
              📌 Today
            </TelegramButton>
            <TelegramButton onClick={() => {
              const tomorrow = new Date()
              tomorrow.setDate(tomorrow.getDate() + 1)
              setSelectedDate(tomorrow.toISOString().split('T')[0])
              setStep('time')
            }}>
              📌 Tomorrow
            </TelegramButton>
            <TelegramButton onClick={() => setStep('time')}>
              📅 Pick Date
            </TelegramButton>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-600 mb-2">Or choose custom date:</p>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <TelegramButton onClick={() => setStep('time')} className="mt-2">
              ✓ Confirm Date
            </TelegramButton>
          </div>

          <div className="space-y-2 mt-4">
            <TelegramButton onClick={() => setStep('developer')} variant="secondary">
              🔙 Change Developer
            </TelegramButton>
            <TelegramButton onClick={() => navigate('home')} variant="secondary">
              🏠 Home
            </TelegramButton>
          </div>
        </div>
      </Layout>
    )
  }

  // Step 3: Select Time
  if (step === 'time') {
    return (
      <Layout hasNavigation={false}>
        <Header title="⏰ Select Time" />
        <div className="p-4 space-y-4">
          <TelegramMessage icon="⏰">
            {`Enter start time (HH:MM):\n\nSelected: 📅 ${selectedDate}`}
          </TelegramMessage>

          <Input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            placeholder="HH:MM"
          />

          <div className="space-y-2">
            <TelegramButton onClick={() => setStep('duration')} disabled={!selectedTime}>
              ✓ Continue
            </TelegramButton>
            <TelegramButton onClick={() => setStep('date')} variant="secondary">
              🔙 Change Date
            </TelegramButton>
          </div>
        </div>
      </Layout>
    )
  }

  // Step 4: Select Duration
  if (step === 'duration') {
    return (
      <Layout hasNavigation={false}>
        <Header title="⏱️ Duration" />
        <div className="p-4 space-y-4">
          <TelegramMessage icon="⏱️">
            {`How long should the call be?\n\nTime: ⏰ ${selectedTime}`}
          </TelegramMessage>

          <div className="space-y-2">
            <TelegramButton
              onClick={() => {
                setDuration(30)
                setStep('account')
              }}
              variant={duration === 30 ? 'primary' : 'secondary'}
            >
              {duration === 30 ? '✓' : ''} ⏱ 30 min
            </TelegramButton>
            <TelegramButton
              onClick={() => {
                setDuration(60)
                setStep('account')
              }}
              variant={duration === 60 ? 'primary' : 'secondary'}
            >
              {duration === 60 ? '✓' : ''} ⏱ 1 hour
            </TelegramButton>
            <TelegramButton
              onClick={() => {
                setDuration(90)
                setStep('account')
              }}
              variant={duration === 90 ? 'primary' : 'secondary'}
            >
              {duration === 90 ? '✓' : ''} ⏱ 1.5 hours
            </TelegramButton>
          </div>

          <TelegramButton onClick={() => setStep('time')} variant="secondary">
            🔙 Change Time
          </TelegramButton>
        </div>
      </Layout>
    )
  }

  // Step 5: Account Name
  if (step === 'account') {
    return (
      <Layout hasNavigation={false}>
        <Header title="📌 Account Name" />
        <div className="p-4 space-y-4">
          <TelegramMessage icon="📌">
            {`Enter account name:\n\nDuration: ⏱ ${duration === 30 ? '30 min' : duration === 60 ? '1 hour' : '1.5 hours'}`}
          </TelegramMessage>

          <Input
            placeholder="Company or Account Name"
            value={callTitle}
            onChange={(e) => setCallTitle(e.target.value)}
          />

          <div className="space-y-2">
            <TelegramButton onClick={() => setStep('link')} disabled={!callTitle.trim()}>
              ✓ Continue
            </TelegramButton>
            <TelegramButton onClick={() => setStep('duration')} variant="secondary">
              🔙 Change Duration
            </TelegramButton>
          </div>
        </div>
      </Layout>
    )
  }

  // Step 6: Call Link
  if (step === 'link') {
    return (
      <Layout hasNavigation={false}>
        <Header title="📎 Call Link" />
        <div className="p-4 space-y-4">
          <TelegramMessage icon="📎">
            {`Enter call link (or skip):\n\nAccount: 📌 ${callTitle}`}
          </TelegramMessage>

          <Input
            placeholder="https://zoom.us/... (optional)"
            value={callLink}
            onChange={(e) => setCallLink(e.target.value)}
          />

          <div className="space-y-2">
            <TelegramButton onClick={() => setStep('salary')}>
              ✓ Continue
            </TelegramButton>
            <TelegramButton onClick={() => setStep('salary')} variant="success">
              ⏭️ Skip
            </TelegramButton>
            <TelegramButton onClick={() => setStep('account')} variant="secondary">
              🔙 Change Account
            </TelegramButton>
          </div>
        </div>
      </Layout>
    )
  }

  // Step 7: Salary Fork
  if (step === 'salary') {
    return (
      <Layout hasNavigation={false}>
        <Header title="💰 Salary Fork" />
        <div className="p-4 space-y-4">
          <TelegramMessage icon="💰">
            {`Enter salary fork (or skip):\n\nLink: ${callLink ? '✓ Added' : '⏭️ Skipped'}`}
          </TelegramMessage>

          <Input
            placeholder="50k-70k (optional)"
            value={salaryFork}
            onChange={(e) => setSalaryFork(e.target.value)}
          />

          <div className="space-y-2">
            <TelegramButton onClick={() => setStep('job')}>
              ✓ Continue
            </TelegramButton>
            <TelegramButton onClick={() => setStep('job')} variant="success">
              ⏭️ Skip
            </TelegramButton>
            <TelegramButton onClick={() => setStep('link')} variant="secondary">
              🔙 Change Link
            </TelegramButton>
          </div>
        </div>
      </Layout>
    )
  }

  // Step 8: Job Post Link
  if (step === 'job') {
    return (
      <Layout hasNavigation={false}>
        <Header title="📄 Job Post" />
        <div className="p-4 space-y-4">
          <TelegramMessage icon="📄">
            {`Enter job post link (or skip):\n\nSalary: ${salaryFork ? '✓ Added' : '⏭️ Skipped'}`}
          </TelegramMessage>

          <Input
            placeholder="https://jobs.example.com/... (optional)"
            value={jobPostLink}
            onChange={(e) => setJobPostLink(e.target.value)}
          />

          <div className="space-y-2">
            <TelegramButton onClick={() => setStep('confirm')}>
              ✓ Continue
            </TelegramButton>
            <TelegramButton onClick={() => setStep('confirm')} variant="success">
              ⏭️ Skip
            </TelegramButton>
            <TelegramButton onClick={() => setStep('salary')} variant="secondary">
              🔙 Change Salary
            </TelegramButton>
          </div>
        </div>
      </Layout>
    )
  }

  // Step 9: Confirm & Book
  if (step === 'confirm') {
    return (
      <Layout hasNavigation={false}>
        <Header title="✅ Confirm Call" />
        <div className="p-4 space-y-4">
        <TelegramMessage icon="✅">
          Call Details:
          {'\n\n'}
          📌 {callTitle}
          {'\n'}
          👨‍💻 {selectedDeveloper?.name}
          {'\n'}
          📅 {selectedDate}
          {'\n'}
          ⏰ {selectedTime}
          {'\n'}
          ⏱ {duration === 30 ? '30 min' : duration === 60 ? '1 hour' : '1.5 hours'}
          {callLink && `\n📎 ${callLink}`}
          {salaryFork && `\n💰 ${salaryFork}`}
          {jobPostLink && `\n📄 ${jobPostLink}`}
        </TelegramMessage>

        {error && (
          <TelegramMessage icon="❌">
            {error}
          </TelegramMessage>
        )}

        <div className="space-y-2">
          <TelegramButton onClick={handleBookCall} disabled={loading} variant="success">
            {loading ? '⏳ Booking...' : '✅ Book Call'}
          </TelegramButton>
          <TelegramButton onClick={() => setStep('job')} variant="secondary" disabled={loading}>
            🔙 Change Details
          </TelegramButton>
          <TelegramButton onClick={() => navigate('home')} variant="secondary" disabled={loading}>
            🏠 Home
          </TelegramButton>
        </div>
      </div>
      </Layout>
    )
  }

  return null
}
