import http from '@/lib/http'

export const cartApiRequest = {
  get: () =>
    http.get('-public/carts', {
      headers: {
        cache: 'no-store',
      },
    }),

  add: (courseId: number) =>
    http.post('-public/carts/actions/add', { courseId }),

  remove: (courseIds: number[]) =>
    http.post('-public/carts/actions/remove', { courseIds }),

  clear: () => http.post('-public/carts/actions/clear', {}),

  checkout: (courseIds: number[]) =>
    http.post('-public/carts/actions/checkout', { courseIds }),
}
