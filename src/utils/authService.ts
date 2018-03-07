export default class AuthService {
  checkToken = () => {
    const token = this.getToken()
    return !!token && !this.isTokenExpired(token)
  }

  isTokenExpired = (token) => {
    try {

    } catch (error) {

    }
  }
}
