const asyncLocalStorage = {
  setItem: (key: string, value) =>
    Promise.resolve().then(() => {
      window.localStorage.setItem(key, value)
    }),
  getItem: (key: string) => Promise.resolve().then(() => window.localStorage.getItem(key)),
  removeItem: (key: string) => Promise.resolve().then(() => window.localStorage.removeItem(key)),
  clear: () => Promise.resolve().then(() => window.localStorage.clear()),
  key: (n: number) => Promise.resolve().then(() => window.localStorage.key(n)),
}

export const syncStorage = {
  setItem: (key: string, value) => {
    window.localStorage.setItem(key, value)
  },
  getItem: (key: string) => window.localStorage.getItem(key),
  removeItem: (key: string) => window.localStorage.removeItem(key),
}

export default asyncLocalStorage
