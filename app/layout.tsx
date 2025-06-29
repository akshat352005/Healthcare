import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "SymptoCare - AI Healthcare Assistant",
  description: "Get instant symptom analysis and book doctor consultations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Navbar />
          {/* Add top padding to account for fixed navbar */}
          <main className="pt-16 container mx-auto px-4 py-8">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
