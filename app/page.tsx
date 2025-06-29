"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  MessageCircle,
  Mic,
  Calendar,
  CheckCircle,
  Shield,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  Phone,
  Stethoscope,
  Activity,
  X,
  Headphones,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    OmniDimVoiceWidget?: any
  }
}

export default function LandingPage() {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [isVoiceLoading, setIsVoiceLoading] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "loading" | "ready" | "active" | "error">("idle")
  const voiceWidgetRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load the OmniDim script when component mounts
    if (!scriptLoadedRef.current) {
      const script = document.createElement("script")
      script.id = "omnidimension-web-widget"
      script.async = true
      script.src = "https://backend.omnidim.io/web_widget.js?secret_key=9ecad2e5d28f2f68d294126fee7b6854"

      script.onload = () => {
        scriptLoadedRef.current = true
        console.log("OmniDim voice widget script loaded successfully")
      }

      script.onerror = () => {
        console.error("Failed to load OmniDim voice widget script")
      }

      document.head.appendChild(script)
    }

    return () => {
      // Cleanup if needed
      if (window.OmniDimVoiceWidget && typeof window.OmniDimVoiceWidget.destroy === "function") {
        window.OmniDimVoiceWidget.destroy()
      }
    }
  }, [])

  const handleTryVoiceAssistant = async () => {
    setIsVoiceModalOpen(true)
    setIsVoiceLoading(true)
    setVoiceStatus("loading")

    try {
      // Wait for script to be loaded
      if (!scriptLoadedRef.current) {
        // Wait a bit for script to load
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      if (window.OmniDimVoiceWidget && voiceWidgetRef.current) {
        // Initialize the voice widget
        await window.OmniDimVoiceWidget.init({
          container: voiceWidgetRef.current,
          mode: "demo", // Demo mode for landing page
          theme: {
            primaryColor: "#3b82f6",
            backgroundColor: "#ffffff",
            textColor: "#1f2937",
            borderRadius: "12px",
            fontFamily: "Inter, sans-serif",
          },
          settings: {
            welcomeMessage: "Hello! I'm your AI voice assistant. Try speaking to me about your health concerns.",
            autoStart: true,
            showControls: true,
            enableDemo: true,
          },
          onStatusChange: (status: string) => {
            setVoiceStatus(status as any)
          },
          onReady: () => {
            setVoiceStatus("ready")
            setIsVoiceLoading(false)
            toast({
              title: "Voice Assistant Ready",
              description: "You can now speak to our AI assistant!",
            })
          },
          onActive: () => {
            setVoiceStatus("active")
          },
          onError: (error: any) => {
            console.error("Voice widget error:", error)
            setVoiceStatus("error")
            setIsVoiceLoading(false)
            toast({
              title: "Voice Assistant Error",
              description: "Unable to start voice assistant. Please try again.",
              variant: "destructive",
            })
          },
        })
      } else {
        throw new Error("Voice widget not available")
      }
    } catch (error) {
      console.error("Error initializing voice assistant:", error)
      setVoiceStatus("error")
      setIsVoiceLoading(false)
      toast({
        title: "Service Unavailable",
        description: "Voice assistant is temporarily unavailable. Please try the full voice page.",
        variant: "destructive",
      })
    }
  }

  const closeVoiceModal = () => {
    setIsVoiceModalOpen(false)
    setVoiceStatus("idle")
    setIsVoiceLoading(false)

    // Cleanup voice widget
    if (window.OmniDimVoiceWidget && typeof window.OmniDimVoiceWidget.destroy === "function") {
      window.OmniDimVoiceWidget.destroy()
    }
  }

  const getVoiceStatusMessage = () => {
    switch (voiceStatus) {
      case "loading":
        return "Initializing voice assistant..."
      case "ready":
        return "Voice assistant is ready! Start speaking."
      case "active":
        return "Listening... Speak now."
      case "error":
        return "Error loading voice assistant."
      default:
        return "Preparing voice assistant..."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Healthcare Assistant
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Health,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Our Priority
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get instant symptom analysis, personalized health recommendations, and connect with healthcare professionals
            - all powered by advanced AI technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg">
              <Link href="/chat">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start AI Chat
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg bg-transparent"
            >
              <Link href="/consult">
                <Calendar className="mr-2 h-5 w-5" />
                Book Consultation
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm md:text-base text-gray-600">Available Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-sm md:text-base text-gray-600">Health Questions Answered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-sm md:text-base text-gray-600">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Complete Healthcare Solutions</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for better health management in one intelligent platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg md:text-xl">AI Chat Assistant</CardTitle>
                <CardDescription className="text-sm">
                  Instant health guidance through intelligent conversation
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/chat">
                    Start Chatting
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg md:text-xl">Voice Consultation</CardTitle>
                <CardDescription className="text-sm">
                  Speak naturally and get voice responses from our AI
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/voice">
                    Call Now
                    <Phone className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg md:text-xl">Doctor Booking</CardTitle>
                <CardDescription className="text-sm">
                  Schedule appointments with qualified healthcare professionals
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/consult">
                    Book Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-lg md:text-xl">Health Monitoring</CardTitle>
                <CardDescription className="text-sm">
                  Track symptoms and get personalized health insights
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full bg-transparent" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How SymptoCare Works</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get the healthcare guidance you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl md:text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Describe Your Symptoms</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Tell our AI about your health concerns through chat, voice, or our symptom checker form.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl md:text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Get AI Analysis</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Receive instant, personalized health recommendations and guidance based on your symptoms.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 md:w-20 h-16 md:h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl md:text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Connect with Doctors</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Book consultations with qualified healthcare professionals when needed for further care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Choose SymptoCare?</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Instant AI-Powered Analysis</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Get immediate health insights and recommendations powered by advanced medical AI technology.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Your health information is protected with enterprise-grade security and HIPAA compliance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">24/7 Availability</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Access healthcare guidance anytime, anywhere - our AI assistant never sleeps.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Expert Healthcare Network</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Connect with qualified doctors and healthcare professionals when you need human expertise.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 md:p-8 text-white">
                <div className="flex items-center mb-6">
                  <Stethoscope className="h-10 md:h-12 w-10 md:w-12 mr-4" />
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold">Ready to get started?</h3>
                    <p className="opacity-90 text-sm md:text-base">Join thousands who trust SymptoCare</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Button asChild size="lg" variant="secondary" className="w-full">
                    <Link href="/chat">
                      Start Free AI Chat
                      <MessageCircle className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full bg-transparent border-white text-white hover:bg-white hover:text-purple-600"
                    onClick={handleTryVoiceAssistant}
                  >
                    Try Voice Assistant
                    <Mic className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Take Control of Your Health Today</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Don't wait for symptoms to worsen. Get instant AI-powered health guidance now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg">
              <Link href="/chat">
                Start AI Chat Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Link href="/consult">
                Book Doctor Consultation
                <Calendar className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Voice Assistant Modal */}
      <Dialog open={isVoiceModalOpen} onOpenChange={setIsVoiceModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl">Voice Assistant Demo</DialogTitle>
                  <DialogDescription>Try our AI voice assistant right here!</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={closeVoiceModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status Display */}
            <div className="text-center py-4">
              <div className="flex justify-center mb-3">
                {isVoiceLoading ? (
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : voiceStatus === "active" ? (
                  <Headphones className="h-12 w-12 text-green-500 animate-pulse" />
                ) : voiceStatus === "ready" ? (
                  <Mic className="h-12 w-12 text-blue-500" />
                ) : voiceStatus === "error" ? (
                  <X className="h-12 w-12 text-red-500" />
                ) : (
                  <Mic className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <p className="text-sm text-gray-600">{getVoiceStatusMessage()}</p>
            </div>

            {/* Voice Widget Container */}
            <div
              ref={voiceWidgetRef}
              className="w-full min-h-[300px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
            >
              {voiceStatus === "idle" || voiceStatus === "loading" ? (
                <div className="text-center space-y-2">
                  <Mic className="h-16 w-16 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-500">Voice interface will appear here</p>
                </div>
              ) : null}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 text-sm mb-2">How to use:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Click the microphone button to start speaking</li>
                <li>• Ask about symptoms like "I have a headache"</li>
                <li>• The AI will respond with voice and text</li>
                <li>• For full features, visit our Voice page</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/voice" onClick={closeVoiceModal}>
                  Full Voice Page
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button onClick={closeVoiceModal} className="flex-1">
                Close Demo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
