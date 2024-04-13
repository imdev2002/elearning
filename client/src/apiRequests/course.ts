import axiosInstance from '@/apiRequests/axiosInstance'

export const createCourse = async (payload: any) => {
  try {
    const response = await axiosInstance.post('/courses', payload)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const getCourse = async (id: string) => {
  try {
    const response = await axiosInstance.post(`/courses/${id}`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const getListCourse = async () => {
  try {
    const response = await axiosInstance.post('/courses')
    return response.data
  } catch (error) {
    console.error(error)
  }
}
