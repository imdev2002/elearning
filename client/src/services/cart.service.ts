import http from '@/lib/http'

export const cartApiRequest = {
  get: () => http.get('-public/carts'),

  add: (courseId: number) =>
    http.post('-public/carts/actions/add', { courseId }),

  remove: (courseId: number) =>
    http.post('-public/carts/actions/remove', { courseId }),

  clear: () => http.post('-public/carts/actions/clear', {}),

  checkout: (coursesId: number[]) =>
    http.post('-public/carts/actions/checkout', { coursesId }),
}
