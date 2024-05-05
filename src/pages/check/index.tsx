import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

const HomePage = () => {
  const { data: session } = useSession()

  console.log('Sessing', session?.user?.email)

  const handleLogout = async () => {
    await signOut({ redirect: false, callbackUrl: '/' })
  }

  return (
    <div>
      <h1>Home Page</h1>
      {session ? (
        <div>
          <p>Welcome, {session.user?.email}</p>

          {JSON.stringify(session.user)}
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <Link href="/login">Log In</Link>
      )}
    </div>
  )
}

export default HomePage
