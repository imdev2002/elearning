'use client'

import { useAccountContext } from '@/contexts/account'
import { cartApiRequest } from '@/services/cart.service'
import { createContext, use, useContext, useEffect, useState } from 'react'

type CartContextType = {
  cart: any
  setCart: (cart: any) => void
  setCartRefresh: (val: any) => void
}

const CartContext = createContext<CartContextType>({
  cart: [],
  setCart: () => {},
  setCartRefresh: () => {},
})
function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAccountContext()
  const [cart, setCart] = useState<any>()
  const [cartRefresh, setCartRefresh] = useState(false)
  useEffect(() => {
    if (user?.email)
      (async () => {
        const res = await cartApiRequest.get()
        if (res.status === 200) setCart(res.payload)
      })()
  }, [cartRefresh, setCart])
  return (
    <CartContext.Provider value={{ cart, setCart, setCartRefresh }}>
      {children}
    </CartContext.Provider>
  )
}

function useCart() {
  const context = useContext(CartContext)
  if (typeof context === 'undefined')
    throw new Error('useDropdown must be used within AlertProvider')
  return context
}
export { useCart, CartProvider }
