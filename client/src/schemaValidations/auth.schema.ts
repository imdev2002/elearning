import { User } from '@/app/globals'
import z from 'zod'

// Register
export const RegisterBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword'],
      })
    }
  })

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>

export const RegisterResponse = z.object({
  data: z.object({
    email: z.string().email(),
  }),
  message: z.string(),
})

export type RegisterResponseType = z.TypeOf<typeof RegisterResponse>

// Login
export const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
})

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const LoginResponse = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.number(),
    email: z.string(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    gender: z.string(),
    password: z.null(),
    salt: z.null(),
    phone: z.string(),
    avatar: z.string(),
    birthday: z.string(),
    isVerified: z.boolean(),
    verifyCode: z.null(),
    platform: z.string(),
    refreshToken: z.string(),
    firstTime: z.boolean(),
    isNewUser: z.boolean(),
    timestamp: z.string(),
    roles: z.array(
      z.object({
        id: z.number(),
        timestamp: z.string(),
        roleId: z.number(),
        userId: z.number(),
        role: z.object({
          id: z.number(),
          name: z.string(),
          description: z.string(),
        }),
      })
    ),
  }),
})

export type LoginResponseType = {
  accessToken: string
  refreshToken: string
  user: User
}

export type TokensType = {
  accessToken: string
  refreshToken: string
}
