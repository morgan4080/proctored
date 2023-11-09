import 'next-auth/jwt'
import { DefaultSession } from 'next-auth'
import { User } from '@/lib/service_types'
// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: User & { image?: string | null }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: User
    userRole: 'user' | 'admin' | 'superuser'
  }
}
