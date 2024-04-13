export const setItem = (key: string, value: any, exprire?: Date) => {
  localStorage.setItem(
    key,
    JSON.stringify({
      value,
      exprire,
    })
  )
}

export const getItem = (key: string) => {
  const item = localStorage.getItem(key)
  if (item) {
    const parsed = JSON.parse(item)
    if (parsed.exprire) {
      const now = new Date().getTime()
      if (now < new Date(parsed.exprire).getTime()) {
        return parsed.value
      } else {
        localStorage.removeItem(key)
        return undefined
      }
    } else {
      return parsed.value
    }
  }
  return undefined
}

export const removeItem = (key: string) => {
  localStorage.removeItem(key)
}
