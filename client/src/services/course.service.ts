import { Course } from '@/app/globals'
import http from '@/lib/http'
import {
  CoursePartsBodyType,
  CourseResType,
  GetCoursesPublicParamsType,
} from '@/schemaValidations/course.schema'

export const courseManagerApiRequests: any = {
  create: () => http.post('/courses', undefined),

  get: (id: number, access_token: string) =>
    http.get<Course>(`/courses/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        cache: 'no-store',
      },
    }),

  getList: (access_token: string) =>
    http.get('/courses', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        cache: 'no-store',
      },
    }),

  update: (courseId: number, body: any) =>
    http.patch(`/courses/${courseId}`, body),

  delete: (courseId: number) => http.delete(`/courses/${courseId}`),

  ceateParts: (courseId: number, body: any) =>
    http.post(`/courses/${courseId}/parts`, body),
  getListParts: (courseId: number) => http.get(`/courses/${courseId}/parts`),

  getPart: (courseId: number, partId: number) =>
    http.get(`/courses/${courseId}/${partId}`),

  updatePart: (courseId: number, partId: number, body: any) =>
    http.patch(`/courses/${courseId}/parts/${partId}`, body),

  deletePart: (courseId: number, partId: number) =>
    http.delete(`/courses/${courseId}/${partId}`),

  approve: (courseId: number) =>
    http.patch(`/courses/${courseId}/actions/approve`, undefined),
}

export const coursePublicApiRequests = {
  getList: (params: string = '') =>
    http.get<CourseResType[]>(`-public/courses` + params, {
      cache: 'no-store',
    }),

  get: (courseId: number) =>
    http.get<Course>(`-public/courses/${courseId}`, {
      cache: 'no-store',
    }),

  buy: (courseId: number) =>
    http.post('-public/courses/actions/buy', { courseId }),

  toogleHeart: (courseId: number) =>
    http.post('-public/courses/actions/heart', { courseId }),

  rating: (body: any) => http.post('-public/courses/actions/rate', body),

  comment: (body: any) => http.post('-public/courses/actions/comment', body),

  editComment: (id: number, body: any) =>
    http.patch(`-public/courses/actions/comment/${id}`, body),

  deleteComment: (id: number) =>
    http.delete(`-public/courses/actions/comment/${id}`),

  reactAction: (body: any) => http.post('-public/courses/actions/emoji', body),
}
