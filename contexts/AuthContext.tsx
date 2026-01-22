"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { getUserData, UserData, handleGoogleRedirect } from "@/lib/firebase/auth"

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handle Google redirect result if present
    const handleRedirect = async () => {
      try {
        const { user: redirectUser } = await handleGoogleRedirect()
        if (redirectUser) {
          // Redirect user based on role after a brief delay to allow state update
          setTimeout(async () => {
            const data = await getUserData(redirectUser.uid)
            if (data?.role === 'admin' || data?.role === 'super admin') {
              window.location.href = '/admin/dashboard'
            } else {
              window.location.href = '/dashboard'
            }
          }, 500)
        }
      } catch (error) {
        console.error("Error handling Google redirect:", error)
      }
    }
    handleRedirect()

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser) {
        // Fetch user data from Firestore
        const data = await getUserData(firebaseUser.uid)
        setUserData(data)
      } else {
        setUserData(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

