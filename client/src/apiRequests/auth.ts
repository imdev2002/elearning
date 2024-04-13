import axiosInstance from '@/apiRequests/axiosInstance'
import {
  LoginBodyType,
  LoginResponseType,
  RegisterBodyType,
  RegisterResponseType,
} from '@/schemaValidations/auth.schema'

export const loginByEmail = async (payload: LoginBodyType) => {
  try {
    const response: LoginResponseType = await axiosInstance.post(
      '/auth/local/login',
      payload
    )
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const registerByEmail = async (payload: RegisterBodyType) => {
  try {
    const response: RegisterResponseType = await axiosInstance.post(
      '/auth/local/register',
      payload
    )
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const loginByGoogle = async () => {}
