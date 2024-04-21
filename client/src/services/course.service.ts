import http from '@/lib/http'
import {
  CourseBodyType,
  CoursePartsBodyType,
} from '@/schemaValidations/course.schema'

export const courseManagerApiRequests = {
  create: () => http.post('/courses', undefined),

  get: (id: number, access_token: string) =>
    http.get(`/courses/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),

  getList: (access_token: string) =>
    http.get('/courses', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),

  update: (courseId: number, body: CourseBodyType) =>
    http.patch(`/course/${courseId}`, body),

  ceateParts: (courseId: number, body: CoursePartsBodyType) =>
    http.post(`/courses/${courseId}/parts`, body),
  getListParts: (courseId: number) => http.get(`/courses/${courseId}/parts`),

  getPart: (courseId: number, partId: number) =>
    http.get(`/courses/${courseId}/${partId}`),

  updatePart: (courseId: number, partId: number, body: CoursePartsBodyType) =>
    http.patch(`/courses/${courseId}/${partId}`, body),

  deletePart: (courseId: number, partId: number) =>
    http.delete(`/courses/${courseId}/${partId}`),

  approve: (courseId: number) =>
    http.patch(`/courses/${courseId}/actions/approve`, undefined),
}

export const coursePublicApiRequests = {
  getList: () =>
    http.get('-public/courses?limit&offset&search&category&orderBy&direction', {
      cache: 'no-store',
    }),

  get: (courseId: number) => http.get(`-public/courses/${courseId}`),

  buy: (courseId: number) => http.post('-public/courses/actions/buy', courseId),

  like: (courseId: number) =>
    http.post('-public/courses/actions/heart', courseId),

  rating: (body: any) => http.post('-public/courses/actions/rate', body),

  comment: (body: any) => http.post('-public/courses/actions/comment', body),

  editComment: (id: number, body: any) =>
    http.patch(`-public/courses/actions/comment/${id}`, body),

  deleteComment: (id: number) =>
    http.delete(`-public/courses/actions/comment/${id}`),

  reactAction: (body: any) => http.post('-public/courses/actions/emoji', body),
}
