// 'use client'
// import { AccountResType } from '@/schemaValidations/account.schema'
// import { getItem } from '@/utils/localStorage'
// import { createContext, useContext, useState } from 'react'
// import { useReadLocalStorage } from 'usehooks-ts'

// type User = AccountResType['data']

// const AccountContext = createContext<{
//   user: User | null
//   setUser: (user: User | null) => void
// }>({
//   user: null,
//   setUser: () => {},
// })
// export const useAccountContext = () => {
//   const context = useContext(AccountContext)
//   return context
// }
// export default function AccountProvider({
//   children,
//   inititalSessionToken = '',
//   user: userProp,
// }: {
//   children: React.ReactNode
//   inititalSessionToken?: string
//   user?: User | null
// }) {
//   const initUser = useReadLocalStorage<any>('user')?.value
//   const [user, setUser] = useState<User | null>(initUser)

//   return (
//     <AccountContext.Provider
//       value={{
//         user,
//         setUser,
//       }}
//     >
//       {children}
//     </AccountContext.Provider>
//   )
// }

'use client'
import { User } from '@/app/globals'
import { clientTokens } from '@/lib/http'
import { AccountResType } from '@/schemaValidations/account.schema'
import { TokensType } from '@/schemaValidations/auth.schema'
import { createContext, useContext, useState } from 'react'
import { useReadLocalStorage } from 'usehooks-ts'

// type User = Omit<AccountResType['data'], 'refreshToken'>
// type UserTY = User

const AccountContext = createContext<{
  user: User | null
  setUser: (user: User | null) => void
}>({
  user: null,
  setUser: () => {},
})
export const useAccountContext = () => {
  const context = useContext(AccountContext)
  return context
}
export default function AccountProvider({
  children,
  inititalTokens = {
    accessToken: '',
    refreshToken: '',
  },
  user: userProp,
}: {
  children: React.ReactNode
  inititalTokens?: TokensType
  user?: User | null
}) {
  const initUser = useReadLocalStorage<any>('user')?.value

  const [user, setUser] = useState<User | null>(initUser)
  useState(() => {
    if (typeof window !== 'undefined') {
      clientTokens.value = inititalTokens
    }
  })

  return (
    <AccountContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}
