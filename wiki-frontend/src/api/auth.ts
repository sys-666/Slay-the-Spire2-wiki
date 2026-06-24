import request from './request'
import type { LoginResponse, User } from '@/types'

export const login = (username: string, password: string): Promise<LoginResponse> =>
  request.post('/login', { username, password })

export const getUser = (): Promise<{ user: User }> => request.get('/user')
