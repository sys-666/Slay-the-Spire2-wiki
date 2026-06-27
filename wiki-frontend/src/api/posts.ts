import request from './request'
import type { Post, PostsResponse } from '@/types'

export interface PostParams {
  page?: number
  pageSize?: number
  category?: string
  keyword?: string
  tag?: string
  postType?: string
  cardSubtype?: string
  bossFloor?: string
}

export const getPosts = (params: PostParams): Promise<PostsResponse> =>
  request.get('/posts', { params })

export const getPost = (id: string): Promise<{ data: Post }> =>
  request.get(`/posts/${id}`)

export const createPost = (data: Partial<Post>): Promise<{ data: Post }> =>
  request.post('/posts', data)

export const updatePost = (id: string, data: Partial<Post>): Promise<{ data: Post }> =>
  request.put(`/posts/${id}`, data)

export const deletePost = (id: string): Promise<{ message: string }> =>
  request.delete(`/posts/${id}`)
