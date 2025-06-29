"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, Clock, User, Mail, Phone, Download, ExternalLink } from "lucide-react"
import Link from "next/link"

interface AppointmentData {
  doctor: string
  doctorName: string
  date: string
  time: string
  email: string
  phone: string
  symptoms: string
  appointmentId: string
}

export default function ConfirmationPage() {
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null)

  useEffect(() => {
    const data = localStorage.getItem("appointmentData")
    if (data) {
      setAppointmentData(JSON.parse(data))
    }
  }, [])

  const generateCalendarLink = () => {
    if (!appointmentData) return ""

    const startDate = new Date(`${appointmentData.date}T${convertTo24Hour(appointmentData.time)}`)
    const endDate = new Date(startDate.getTime() + 30 * 60000) // 30 minutes later

    const title = encodeURIComponent(`Medical Consultation with ${appointmentData.doctorName}`)
    const details = encodeURIComponent(`Consultation regarding: ${appointmentData.symptoms}`)

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${details}`
  }

  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(" ")
    let [hours, minutes] = time.split(":")
    if (hours === "12") {
      hours = "00"
    }
    if (modifier === "PM") {
      hours = (Number.parseInt(hours, 10) + 12).toString()
    }
    return `${hours}:${minutes}`
  }

  if (!appointmentData) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">No Appointment Data Found</h1>
        <p className="text-gray-600">Please book an appointment first.</p>
        <Button asChild>
          <Link href="/consult">Book Consultation</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Appointment Confirmed!</h1>
        <p className="text-xl text-gray-600">Your consultation has been successfully scheduled</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Appointment Details</span>
            </CardTitle>
            <CardDescription>Your upcoming medical consultation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Appointment ID:</span>
                <Badge variant="outline">{appointmentData.appointmentId}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">{appointmentData.doctorName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(appointmentData.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{appointmentData.time}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">30 minutes</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">Video Consultation</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-green-600" />
              <span>Contact Information</span>
            </CardTitle>
            <CardDescription>Your registered contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{appointmentData.email}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{appointmentData.phone}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-sm mb-2">Symptoms Summary:</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{appointmentData.symptoms}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <span>Next Steps</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild className="flex items-center space-x-2">
              <a href={generateCalendarLink()} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
                <span>Add to Calendar</span>
              </a>
            </Button>

            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <ExternalLink className="h-4 w-4" />
              <span>Join Video Call</span>
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">What to Expect:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You'll receive email and SMS confirmations shortly</li>
              <li>• A video call link will be sent 30 minutes before your appointment</li>
              <li>• Please have your ID and insurance information ready</li>
              <li>• Prepare any questions you'd like to ask the doctor</li>
              <li>• Ensure you have a stable internet connection</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Need to Reschedule?</h4>
            <p className="text-sm text-green-700 mb-3">
              You can reschedule or cancel your appointment up to 2 hours before the scheduled time.
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                Reschedule
              </Button>
              <Button size="sm" variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <p className="text-gray-600">
          Need help? Contact our support team at{" "}
          <a href="mailto:support@symptocare.com" className="text-blue-600 hover:underline">
            support@symptocare.com
          </a>{" "}
          or call{" "}
          <a href="tel:+1-555-123-4567" className="text-blue-600 hover:underline">
            +1 (555) 123-4567
          </a>
        </p>

        <Button asChild variant="outline">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}
