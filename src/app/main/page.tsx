"use client"
import { SessionProvider } from "next-auth/react"
import MainPage from "./main"

export default function Main() {
  return (
    <SessionProvider>
      <MainPage />
    </SessionProvider>
    )
}