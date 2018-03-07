export default class AuthService {
  checkToken = () => {
    const token = this.getToken()
    return !!token
  }

  isTokenExpired = (token) => {
  }

  getToken = () => {
    return localStorage.getItem('token')
  }

  logout = () => {
    localStorage.removeItem('token')
  }
}
