import axios, { AxiosInstance } from 'axios'
import type {
  User,
  Developer,
  Call,
  Access,
  NotificationSettings,
  ListResponse,
} from '@types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // Users
  async getUser(userId: number): Promise<User> {
    const response = await this.client.get(`/users/${userId}`)
    return response.data
  }

  async getUserByTelegramId(telegramId: number): Promise<User> {
    const response = await this.client.get(`/users/telegram/${telegramId}`)
    return response.data
  }

  async createUser(data: Partial<User>): Promise<User> {
    const response = await this.client.post('/users', data)
    return response.data
  }

  async listUsers(skip = 0, limit = 100): Promise<ListResponse<User>> {
    const response = await this.client.get('/users', { params: { skip, limit } })
    return response.data
  }

  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    const response = await this.client.patch(`/users/${userId}`, data)
    return response.data
  }

  async deleteUser(userId: number): Promise<void> {
    await this.client.delete(`/users/${userId}`)
  }

  // Developers
  async getDeveloper(developerId: number): Promise<Developer> {
    const response = await this.client.get(`/developers/${developerId}`)
    return response.data
  }

  async listDevelopers(skip = 0, limit = 100): Promise<ListResponse<Developer>> {
    const response = await this.client.get('/developers', { params: { skip, limit } })
    return response.data
  }

  async createDeveloper(data: Partial<Developer>): Promise<Developer> {
    const response = await this.client.post('/developers', data)
    return response.data
  }

  async updateDeveloper(developerId: number, data: Partial<Developer>): Promise<Developer> {
    const response = await this.client.patch(`/developers/${developerId}`, data)
    return response.data
  }

  async deleteDeveloper(developerId: number): Promise<void> {
    await this.client.delete(`/developers/${developerId}`)
  }

  // Calls
  async getCall(callId: number): Promise<Call> {
    const response = await this.client.get(`/calls/${callId}`)
    return response.data
  }

  async listCalls(
    skip = 0,
    limit = 100,
    developerId?: number,
    salesManagerId?: number
  ): Promise<ListResponse<Call>> {
    const response = await this.client.get('/calls', {
      params: {
        skip,
        limit,
        developer_id: developerId,
        sales_manager_id: salesManagerId,
      },
    })
    return response.data
  }

  async createCall(data: Partial<Call>): Promise<Call> {
    const response = await this.client.post('/calls', data)
    return response.data
  }

  async updateCall(callId: number, data: Partial<Call>): Promise<Call> {
    const response = await this.client.patch(`/calls/${callId}`, data)
    return response.data
  }

  async deleteCall(callId: number): Promise<void> {
    await this.client.delete(`/calls/${callId}`)
  }

  // Access
  async grantAccess(userId: number, grantedBy: number): Promise<Access> {
    const response = await this.client.post('/access', {
      user_id: userId,
      granted_by: grantedBy,
    })
    return response.data
  }

  async listAccess(userId?: number): Promise<ListResponse<Access>> {
    const response = await this.client.get('/access', {
      params: { user_id: userId },
    })
    return response.data
  }

  async revokeAccess(accessId: number): Promise<void> {
    await this.client.delete(`/access/${accessId}`)
  }

  // Notification Settings
  async getNotificationSettings(settingsId: number): Promise<NotificationSettings> {
    const response = await this.client.get(`/notification-settings/${settingsId}`)
    return response.data
  }

  async listNotificationSettings(
    salesManagerId?: number,
    developerId?: number
  ): Promise<ListResponse<NotificationSettings>> {
    const response = await this.client.get('/notification-settings', {
      params: {
        sales_manager_id: salesManagerId,
        developer_id: developerId,
      },
    })
    return response.data
  }

  async updateNotificationSettings(
    settingsId: number,
    data: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    const response = await this.client.patch(`/notification-settings/${settingsId}`, data)
    return response.data
  }

  async toggleNotifications(salesManagerId: number, developerId: number) {
    const response = await this.client.post(
      `/notification-settings/${salesManagerId}/${developerId}/toggle`
    )
    return response.data
  }
}

export const api = new ApiClient()
