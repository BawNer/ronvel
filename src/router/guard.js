import cookie from '../cookie'

export default function (to, from, next) {
  if (cookie.getCookie('user') !== null) {
    next()
  } else {
    next('/login')
  }
}