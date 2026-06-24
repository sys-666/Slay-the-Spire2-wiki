export interface User {
  id: string
  username: string
  role: 'admin' | 'user'
}

export interface LoginResponse {
  token: string
  user: User
}

export interface Post {
  _id: string
  title: string
  content: string
  summary: string
  cover: string
  category: string
  tags: string[]
  isPinned: boolean
  viewCount: number
  author: string
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PostsResponse {
  data: Post[]
  pagination: Pagination
}

export interface Comment {
  _id: string
  post: string
  author: string
  content: string
  createdAt: string
}

export interface CommentsResponse {
  data: Comment[]
  pagination: Pagination
}
