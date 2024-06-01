import { Lesson } from '@/app/globals'
import http from '@/lib/http'
import {
  LessonTextBodyType,
  LessonVideoBodyType,
} from '@/schemaValidations/lesson.schema'

export const lessonManagerApiRequest = {
  create: (body: any) => http.post(`/lessons`, body),

  get: (lessonId: number) => http.get(`/lessons/${lessonId}`),

  getList: (access_token: string) =>
    http.get(`/lessons`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),

  update: (lessonId: number, payload: any) =>
    http.patch(`/lessons/${lessonId}`, payload),

  delete: (lessonId: number) => http.delete(`/lessons/${lessonId}`),

  approve: (lessonId: number) =>
    http.patch(`/lessons/${lessonId}/actions/approve`, undefined),
}

export const lessonPublicApiRequest = {
  get: (lessonId: number, access_token: string) =>
    http.get<Lesson>(`-public/lessons/${lessonId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    }),

  heart: (body: any) => http.post('-public/lessons/actions/heart', body),

  buy: (body: any) => http.post('-public/lessons/actions/buy', body),

  comment: (body: any) => http.post('-public/lessons/actions/comment', body),

  editComment: (lessonId: number, body: any) =>
    http.patch(`-public/lessons/actions/comment/${lessonId}`, body),

  deleteComment: (lessonId: number) =>
    http.delete(`-public/lessons/actions/comment/${lessonId}`),

  emojiAction: (body: any) => http.post('-public/lessons/actions/emoji', body),

  finish: (lessonId: number) =>
    http.post('-public/lessons/actions/done', { lessonId }),
}
