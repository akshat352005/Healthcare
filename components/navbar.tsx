"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Heart, MessageCircle, Mic, Calendar, Home, Menu, X } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/chat", label: "AI Chat", icon: MessageCircle },
    { href: "/voice", label: "Voice Call", icon: Mic },
    { href: "/consult", label: "Book Doctor", icon: Calendar },
  ]

  const closeSheet = () => setIsOpen(false)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg border-b z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={closeSheet}>
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold text-gray-800">SymptoCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  asChild
                  className="flex items-center space-x-2"
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between pb-6 border-b">
                    <Link href="/" className="flex items-center space-x-2" onClick={closeSheet}>
                      <Heart className="h-8 w-8 text-red-500" />
                      <span className="text-xl font-bold text-gray-800">SymptoCare</span>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={closeSheet} className="p-2">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Mobile Navigation Items */}
                  <div className="flex flex-col space-y-2 pt-6">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href

                      return (
                        <Button
                          key={item.href}
                          variant={isActive ? "default" : "ghost"}
                          asChild
                          className="justify-start h-12 text-base"
                          onClick={closeSheet}
                        >
                          <Link href={item.href} className="flex items-center space-x-3">
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Link>
                        </Button>
                      )
                    })}
                  </div>

                  {/* Mobile Footer */}
                  <div className="mt-auto pt-6 border-t">
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Need immediate help?</p>
                        <Button asChild className="w-full">
                          <Link href="/chat" onClick={closeSheet}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Start AI Chat
                          </Link>
                        </Button>
                      </div>
                      <div className="text-center text-xs text-gray-500">
                        <p>🚨 For emergencies, call 911</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
