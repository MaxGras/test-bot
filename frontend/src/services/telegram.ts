import type { TelegramWebApp, TelegramUser } from '@types'

class TelegramService {
  private tg: TelegramWebApp | null = null

  init() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.tg = window.Telegram.WebApp
      this.tg.ready()
      this.tg.expand()
    }
  }

  getTelegramUser(): TelegramUser | null {
    if (!this.tg) return null
    return this.tg.initDataUnsafe?.user || null
  }

  getInitData(): string {
    if (!this.tg) return ''
    return this.tg.initData
  }

  isReady(): boolean {
    return this.tg !== null
  }

  setMainButtonText(text: string) {
    if (!this.tg) return
    this.tg.MainButton.text = text
  }

  showMainButton() {
    if (!this.tg) return
    this.tg.MainButton.show()
  }

  hideMainButton() {
    if (!this.tg) return
    this.tg.MainButton.hide()
  }

  enableMainButton() {
    if (!this.tg) return
    this.tg.MainButton.enable()
  }

  disableMainButton() {
    if (!this.tg) return
    this.tg.MainButton.disable()
  }

  onMainButtonClick(callback: () => void) {
    if (!this.tg) return
    this.tg.MainButton.onClick(callback)
  }

  close() {
    if (!this.tg) return
    this.tg.close()
  }

  showAlert(message: string) {
    if (!this.tg) {
      console.log(message)
      return
    }
    // Telegram Web App doesn't have showAlert, use console for now
    console.log(message)
  }
}

export const telegram = new TelegramService()
