// hooks/useAuth.ts
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

interface TokenPayload {
  sub: string
  roles: "admin" | "client"
  exp: number
}

export default function useAuth() {
  const [roles, setRoles] = useState<"admin" | "client" | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const decoded = jwtDecode<TokenPayload>(token)
      const isExpired = decoded.exp * 1000 < Date.now()
      if (isExpired) {
        localStorage.removeItem("token")
        setRoles(null)
      } else {
        setRoles(decoded.roles)
      }
    } catch (err) {
      console.error("Token invalide", err)
      setRoles(null)
    }
  }, [])

  return {
    roles,
    isAdmin: roles === "admin",
    isClient: roles === "client"
  }
}
