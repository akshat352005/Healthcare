"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Phone, PhoneCall, Clock, Shield, Headphones } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    OmniDimVoiceWidget?: any
  }
}

const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+1", country: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+31", country: "NL", flag: "🇳🇱", name: "Netherlands" },
  { code: "+41", country: "CH", flag: "🇨🇭", name: "Switzerland" },
  { code: "+46", country: "SE", flag: "🇸🇪", name: "Sweden" },
  { code: "+47", country: "NO", flag: "🇳🇴", name: "Norway" },
  { code: "+45", country: "DK", flag: "🇩🇰", name: "Denmark" },
  { code: "+358", country: "FI", flag: "🇫🇮", name: "Finland" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+64", country: "NZ", flag: "🇳🇿", name: "New Zealand" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+27", country: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
]

export default function VoiceAssistantPage() {
  const [countryCode, setCountryCode] = useState("+1")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isCallRequested, setIsCallRequested] = useState(false)
  const [callStatus, setCallStatus] = useState<"idle" | "requesting" | "connecting" | "connected" | "ended">("idle")
  const widgetContainerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load the OmniDim script if not already loaded
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
        toast({
          title: "Service Unavailable",
          description: "Voice service is temporarily unavailable. Please try again later.",
          variant: "destructive",
        })
      }

      document.head.appendChild(script)
    }

    return () => {
      // Cleanup if needed
      if (window.OmniDimVoiceWidget && typeof window.OmniDimVoiceWidget.destroy === "function") {
        window.OmniDimVoiceWidget.destroy()
      }
    }
  }, [toast])

  const formatPhoneNumber = (value: string, code: string) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, "")

    // Format based on country code
    if (code === "+1") {
      // US/Canada format: (XXX) XXX-XXXX
      if (phoneNumber.length >= 6) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
      } else if (phoneNumber.length >= 3) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
      }
    } else if (code === "+44") {
      // UK format: XXXX XXX XXXX
      if (phoneNumber.length >= 7) {
        return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 11)}`
      } else if (phoneNumber.length >= 4) {
        return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`
      }
    } else {
      // Generic format: XXX XXX XXXX
      if (phoneNumber.length >= 6) {
        return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6)}`
      } else if (phoneNumber.length >= 3) {
        return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`
      }
    }

    return phoneNumber
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, countryCode)
    setPhoneNumber(formatted)
  }

  const handleCountryCodeChange = (newCode: string) => {
    setCountryCode(newCode)
    // Reformat existing number with new country code
    if (phoneNumber) {
      const cleanNumber = phoneNumber.replace(/\D/g, "")
      setPhoneNumber(formatPhoneNumber(cleanNumber, newCode))
    }
  }

  const getFullPhoneNumber = () => {
    const cleanNumber = phoneNumber.replace(/\D/g, "")
    return `${countryCode}${cleanNumber}`
  }

  const validatePhoneNumber = () => {
    const cleanNumber = phoneNumber.replace(/\D/g, "")

    // Basic validation based on country code
    if (countryCode === "+1") {
      return cleanNumber.length === 10
    } else if (countryCode === "+44") {
      return cleanNumber.length >= 10 && cleanNumber.length <= 11
    } else {
      return cleanNumber.length >= 7 && cleanNumber.length <= 15
    }
  }

  const initiateCall = async () => {
    if (!phoneNumber || !validatePhoneNumber()) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number for the selected country.",
        variant: "destructive",
      })
      return
    }

    setCallStatus("requesting")
    setIsCallRequested(true)

    try {
      // Initialize OmniDim voice widget for phone calls
      if (window.OmniDimVoiceWidget && widgetContainerRef.current) {
        await window.OmniDimVoiceWidget.initiateCall({
          phoneNumber: getFullPhoneNumber(),
          container: widgetContainerRef.current,
          onStatusChange: (status: string) => {
            setCallStatus(status as any)
          },
          onCallEnd: () => {
            setCallStatus("ended")
            toast({
              title: "Call Ended",
              description: "Your consultation call has ended. Thank you for using SymptoCare!",
            })
          },
        })

        setCallStatus("connecting")
        toast({
          title: "Call Initiated",
          description: "Your call is being connected. Please wait...",
        })
      } else {
        throw new Error("Voice widget not available")
      }
    } catch (error) {
      console.error("Error initiating call:", error)
      setCallStatus("idle")
      setIsCallRequested(false)
      toast({
        title: "Call Failed",
        description: "Unable to initiate call. Please try again or contact support.",
        variant: "destructive",
      })
    }
  }

  const endCall = () => {
    if (window.OmniDimVoiceWidget && typeof window.OmniDimVoiceWidget.endCall === "function") {
      window.OmniDimVoiceWidget.endCall()
    }
    setCallStatus("ended")
    setIsCallRequested(false)
  }

  const getStatusBadge = () => {
    switch (callStatus) {
      case "requesting":
        return (
          <Badge variant="outline" className="animate-pulse">
            Requesting Call...
          </Badge>
        )
      case "connecting":
        return <Badge className="bg-yellow-500">Connecting...</Badge>
      case "connected":
        return <Badge className="bg-green-500">Connected</Badge>
      case "ended":
        return <Badge variant="secondary">Call Ended</Badge>
      default:
        return <Badge variant="secondary">Ready</Badge>
    }
  }

  const selectedCountry = countryCodes.find((c) => c.code === countryCode)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Voice Health Consultation</h1>
        <p className="text-xl text-gray-600">
          Get instant voice consultation with our AI health assistant via phone call
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Call Interface */}
        <div className="lg:col-span-2">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-600" />
                <span>Request Voice Consultation</span>
              </CardTitle>
              <CardDescription>
                Enter your phone number to receive an AI-powered health consultation call
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isCallRequested ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="country-code">Country & Phone Number</Label>
                    <div className="flex space-x-2">
                      <Select value={countryCode} onValueChange={handleCountryCodeChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue>
                            {selectedCountry && (
                              <div className="flex items-center space-x-2">
                                <span>{selectedCountry.flag}</span>
                                <span>{selectedCountry.code}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {countryCodes.map((country) => (
                            <SelectItem key={`${country.code}-${country.country}`} value={country.code}>
                              <div className="flex items-center space-x-2">
                                <span>{country.flag}</span>
                                <span>{country.code}</span>
                                <span className="text-sm text-gray-500">{country.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        placeholder={countryCode === "+1" ? "(555) 123-4567" : "Enter phone number"}
                        className="flex-1 text-lg"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-gray-500">We'll call you within 30 seconds at this number</p>
                      {phoneNumber && <p className="text-blue-600 font-medium">Full number: {getFullPhoneNumber()}</p>}
                    </div>
                  </div>

                  <Button
                    onClick={initiateCall}
                    className="w-full h-12 text-lg"
                    disabled={!phoneNumber || !validatePhoneNumber()}
                  >
                    <PhoneCall className="mr-2 h-5 w-5" />
                    Request Call Now
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">{getStatusBadge()}</div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Calling: {getFullPhoneNumber()}</h3>
                      {callStatus === "requesting" && <p className="text-gray-600">Initiating your call...</p>}
                      {callStatus === "connecting" && (
                        <p className="text-gray-600">Your phone should be ringing shortly...</p>
                      )}
                      {callStatus === "connected" && (
                        <p className="text-green-600">You're now connected with our AI assistant!</p>
                      )}
                      {callStatus === "ended" && (
                        <p className="text-gray-600">Call completed. Thank you for using SymptoCare!</p>
                      )}
                    </div>

                    {/* Voice Widget Container */}
                    <div
                      ref={widgetContainerRef}
                      className="w-full min-h-[200px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                    >
                      {callStatus === "connected" ? (
                        <div className="text-center space-y-2">
                          <Headphones className="h-12 w-12 text-blue-500 mx-auto animate-pulse" />
                          <p className="text-sm text-gray-600">Voice consultation in progress...</p>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <Phone className="h-12 w-12 text-gray-400 mx-auto" />
                          <p className="text-sm text-gray-500">Voice interface will appear here</p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-4 justify-center">
                      {callStatus === "connected" && (
                        <Button variant="destructive" onClick={endCall}>
                          End Call
                        </Button>
                      )}
                      {(callStatus === "ended" || callStatus === "idle") && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsCallRequested(false)
                            setCallStatus("idle")
                            setPhoneNumber("")
                          }}
                        >
                          Start New Call
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span>How It Works</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Select Country & Number</p>
                    <p className="text-xs text-gray-600">Choose your country code and enter phone number</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Receive Call</p>
                    <p className="text-xs text-gray-600">Our AI will call you within 30 seconds</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Voice Consultation</p>
                    <p className="text-xs text-gray-600">Speak naturally about your health concerns</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span>Supported Countries</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">
                We support calls to {countryCodes.length}+ countries worldwide
              </p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {countryCodes.slice(0, 8).map((country) => (
                  <div key={`${country.code}-${country.country}`} className="flex items-center space-x-1">
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">...and many more</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-red-800 text-sm">Emergency Notice</h3>
                <p className="text-xs text-red-700">
                  For medical emergencies, call your local emergency number immediately. This service provides general
                  health guidance and is not a substitute for emergency medical care.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-800 text-sm">Call Quality</h3>
                <p className="text-xs text-blue-700">
                  For the best experience, ensure you're in a quiet environment with good phone reception. The AI can
                  understand natural speech patterns in multiple languages.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
