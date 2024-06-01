import http from '@/lib/http'

export const BookmarkApiRequest = {
  getList: () => http.get('-public/bookmarks', { cache: 'no-store' }),

  create: (body: any) => http.post('-public/bookmarks', body),

  delete: (bookmarkId: number) =>
    http.delete(`-public/bookmarks/${bookmarkId}`),
}
