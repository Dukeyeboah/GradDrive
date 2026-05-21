"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react"
import { User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { getUserData, UserData } from "@/lib/firebase/auth"

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  refreshUserData: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUserData = useCallback(async () => {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) {
      setUserData(null)
      return
    }
    try {
      const data = await getUserData(firebaseUser.uid)
      setUserData(data)
    } catch (error) {
      console.error("Error refreshing user data:", error)
      setUserData(null)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      // End "auth resolving" immediately so routes don't sit behind Firestore latency
      // (userData may still load a moment later).
      setLoading(false)

      if (firebaseUser) {
        try {
          const data = await getUserData(firebaseUser.uid)
          setUserData(data)
        } catch (error) {
          console.error("Error fetching user data:", error)
          setUserData(null)
        }
      } else {
        setUserData(null)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, refreshUserData }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
