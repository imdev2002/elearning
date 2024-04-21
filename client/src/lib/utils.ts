import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import jwt from 'jsonwebtoken'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const decodeJWT = <Payload = any>(token: string) => {
  return jwt.decode(token) as Payload
}

export const convertExpiresJWT = (time: number) =>
  new Date(Date.now() + time).toUTCString()
