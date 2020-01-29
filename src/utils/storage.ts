const asyncLocalStorage = {
  setItem: (key: string, value) => {
    return Promise.resolve().then(() => {
      window.localStorage.setItem(key, value)
    })
  },
  getItem: (key: string) => {
    return Promise.resolve().then(() => {
      return window.localStorage.getItem(key)
    })
  },
  removeItem: (key: string) => {
    return Promise.resolve().then(() => {
      return window.localStorage.removeItem(key)
    })
  },
  clear: () => {
    return Promise.resolve().then(() => {
      return window.localStorage.clear()
    })
  },
  key: (n: number) => {
    return Promise.resolve().then(() => {
      return window.localStorage.key(n)
    })
  },
}

export const syncStorage = {
  setItem: (key: string, value) => {
      window.localStorage.setItem(key, value)
  },
  getItem: (key: string) => {
      return window.localStorage.getItem(key)
  },
  removeItem: (key: string) => {
      return window.localStorage.removeItem(key)
  },
}


export default asyncLocalStorage
