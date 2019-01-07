const asyncLocalStorage = {
  setItem: (key, value) => {
    return Promise.resolve().then(() => {
      window.localStorage.setItem(key, value)
    })
  },
  getItem: (key) => {
    return Promise.resolve().then(() => {
      return window.localStorage.getItem(key)
    })
  },
}

export default asyncLocalStorage
