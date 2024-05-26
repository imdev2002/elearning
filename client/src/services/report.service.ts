import http from '@/lib/http'

export const reportApiRequest = {
  revenue: (access_token: string) =>
    http.get('/reports/total?groupBy=year', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        cache: 'no-store',
      },
    }),

  topAuthors: (access_token: string) =>
    http.get('/reports/authors', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        cache: 'no-store',
      },
    }),

  topCourses: (access_token: string) =>
    http.get('/reports/courses/star', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        cache: 'no-store',
      },
    }),
}
