import { withAuth } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    async authorized(data) {
      const { req } = data
      const { pathname }: { pathname: string } = req.nextUrl
      const token = await getToken({ req })
      const user = token?.user
      if (
        user &&
        (pathname.startsWith('/admin') || pathname.startsWith('/user'))
      ) {
        return user.userRole === 'admin' || user.userRole === 'superuser'
      }
      return !!token
    },
  },
})

export const config = {
  matcher: ['/admin/:path*', '/order/:path*', '/user/:path*', '/me/:path*'],
}
