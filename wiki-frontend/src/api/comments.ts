import request from './request'
import type { CommentsResponse, Comment } from '@/types'

export const getComments = (postId: string, page = 1): Promise<CommentsResponse> =>
  request.get('/comments', { params: { postId, page } })

export const createComment = (data: { postId: string; author: string; content: string }): Promise<{ data: Comment }> =>
  request.post('/comments', data)

export const deleteComment = (id: string): Promise<{ message: string }> =>
  request.delete(`/comments/${id}`)
