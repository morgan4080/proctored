import 'next-auth/jwt'
import { DefaultSession } from 'next-auth'
// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module 'next-auth' {
  interface User {
    userRole?: Role
    writer: boolean
  }

  interface Session extends DefaultSession {
    user?: User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userRole: 'user' | 'admin' | 'superuser'
    writer: boolean
  }
}
