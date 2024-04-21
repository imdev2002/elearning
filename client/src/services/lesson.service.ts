import http from '@/lib/http'
import { LessonBodyType } from '@/schemaValidations/lesson.schema'

export const lessonManagerApiRequest = {
  create: (body: LessonBodyType) => http.post(`/lessons`, body),

  get: (lessonId: number) => http.get(`/lessons/${lessonId}`),

  getList: () => http.get(`/lessons`),

  update: (lessonId: number, payload: LessonBodyType) =>
    http.patch(`/lessons/${lessonId}`, payload),

  delete: (lessonId: number) => http.delete(`/lessons/${lessonId}`),

  approve: (lessonId: number) =>
    http.patch(`/lessons/${lessonId}/actions/approve`, undefined),
}

export const lessonPublicApiRequest = {
  get: (lessonId: number) => http.get(`-public/lessons/${lessonId}`),

  heart: (body: any) => http.post('-public/lessons/actions/heart', body),

  buy: (body: any) => http.post('-public/lessons/actions/buy', body),

  commnet: (body: any) => http.post('-public/lessons/actions/comment', body),

  editComment: (lessonId: number, body: any) =>
    http.patch(`-public/lessons/actions/comment/${lessonId}`, body),

  deleteComment: (lessonId: number) =>
    http.delete(`-public/lessons/actions/comment/${lessonId}`),

  emojiAction: (body: any) => http.post('-public/lessons/actions/emoji', body),
}
