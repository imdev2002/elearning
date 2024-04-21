import http from '@/lib/http'

export const BookmarkApiRequest = {
  getList: () => http.get('/bookmarks'),

  create: (body: any) => http.post('/bookmarks', body),

  delete: (bookmarkId: number) => http.delete(`/bookmarks/${bookmarkId}`),
}
