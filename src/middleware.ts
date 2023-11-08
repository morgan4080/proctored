import { withAuth } from 'next-auth/middleware'

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    authorized(data) {
      // `/admin` requires admin role
      const { req, token } = data
      if (req.nextUrl.pathname === '/admin') {
        return token?.userRole === 'admin' || token?.userRole === 'superuser'
      }
      // `/me` only requires the user to be logged in
      return !!token
    },
  },
})

export const config = {
  matcher: ['/admin/:path*', '/order/:path*', '/user/:path*', '/me'],
}
