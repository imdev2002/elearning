import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import jwt from 'jsonwebtoken'

export function cn(...inputs: ClassValue[]) {
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

export const generateMediaLink = (media: string) => {
  if (media.startsWith('http')) return media
  return `${process.env.NEXT_PUBLIC_API_BASE}/files/${media.replace(
    /^uploads\//,
    ''
  )}`
}

export const convertObjectToFormData = (data: any) => {
  const formData = new FormData()
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })
  return formData
}

export const displayFullname = (firstName?: string, lastName?: string) =>
  firstName
    ? firstName
    : '' + (firstName && lastName)
    ? ' '
    : '' + lastName
    ? lastName
    : ''

export const formatDuration = (duration: number) => {
  let seconds = Math.floor(duration % 60)
  let minutes = Math.floor(duration / 60) % 60
  let hours = Math.floor(duration / 3600) % 24
  let days = Math.floor(duration / 86400)
  let result = ''

  if (days) {
    result += days > 1 ? days + 'd ' : '1d '
  }

  if (hours) {
    result += hours > 1 ? hours + 'h ' : '1h '
  }

  if (minutes) {
    result += minutes > 1 ? minutes + 'm ' : '1m '
  }

  if (seconds) {
    result += seconds > 1 ? seconds + 's' : '1s'
  }

  return result.trim() || '0s'
}

export const formatVideoDuration = (duration: number) => {
  let hours = Math.floor(duration / 3600)
  let minutes = Math.floor((duration % 3600) / 60)
  let seconds = Math.ceil(duration % 60)

  if (hours < 1) {
    let minutesStr = String(minutes).padStart(2, '0')
    let secondsStr = String(seconds).padStart(2, '0')
    return minutesStr + ':' + secondsStr
  } else {
    let hoursStr = String(hours).padStart(2, '0')
    let minutesStr = String(minutes).padStart(2, '0')
    return hoursStr + ':' + minutesStr
  }
}
