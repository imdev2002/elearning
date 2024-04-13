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
  data: z.object({
    email: z.string().email(),
  }),
  message: z.string(),
})

export type LoginResponseType = z.TypeOf<typeof LoginResponse>
