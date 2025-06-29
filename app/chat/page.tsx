"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Thermometer,
  Heart,
  Brain,
  Stethoscope,
  Activity,
  History,
  Calendar,
  Trash2,
  Eye,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const commonSymptoms = [
  "Headache",
  "Fever",
  "Cough",
  "Sore throat",
  "Fatigue",
  "Nausea",
  "Dizziness",
  "Chest pain",
  "Shortness of breath",
  "Abdominal pain",
  "Back pain",
  "Joint pain",
  "Skin rash",
  "Vomiting",
  "Diarrhea",
]

const severityLevels = [
  { value: "mild", label: "Mild - Doesn't interfere with daily activities", color: "bg-green-100 text-green-800" },
  { value: "moderate", label: "Moderate - Some interference with activities", color: "bg-yellow-100 text-yellow-800" },
  { value: "severe", label: "Severe - Significantly impacts daily life", color: "bg-red-100 text-red-800" },
]

interface HistoryEntry {
  id: string
  date: Date
  symptoms: string[]
  severity: string
  duration: string
  additionalInfo: string
  analysis: any
}

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [customSymptom, setCustomSymptom] = useState("")
  const [severity, setSeverity] = useState("")
  const [duration, setDuration] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<HistoryEntry | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isHistoryDetailOpen, setIsHistoryDetailOpen] = useState(false)
  const { toast } = useToast()

  // Load history from localStorage on component mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem("symptocare-history")
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory).map((entry: any) => ({
            ...entry,
            date: new Date(entry.date),
          }))
          setHistory(parsedHistory)
          console.log(`Loaded ${parsedHistory.length} history entries from localStorage`)
        } else {
          console.log("No history found in localStorage")
        }
      } catch (error) {
        console.error("Error loading history from localStorage:", error)
        // If there's corrupted data, clear it
        localStorage.removeItem("symptocare-history")
      }
    }

    loadHistory()
  }, [])

  // Save history to localStorage whenever history changes
  useEffect(() => {
    const saveHistory = () => {
      try {
        if (history.length > 0) {
          localStorage.setItem("symptocare-history", JSON.stringify(history))
          console.log(`Saved ${history.length} history entries to localStorage`)
        }
      } catch (error) {
        console.error("Error saving history to localStorage:", error)
        toast({
          title: "Storage Error",
          description: "Unable to save history. Your browser storage might be full.",
          variant: "destructive",
        })
      }
    }

    // Only save if history has been loaded (avoid saving empty array on initial load)
    if (history.length > 0) {
      saveHistory()
    }
  }, [history, toast])

  const addSymptom = (symptom: string) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom])
    }
  }

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter((s) => s !== symptom))
  }

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !symptoms.includes(customSymptom.trim())) {
      setSymptoms([...symptoms, customSymptom.trim()])
      setCustomSymptom("")
    }
  }

  const saveToHistory = (analysisResult: any) => {
    try {
      const newEntry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // More unique ID
        date: new Date(),
        symptoms: [...symptoms],
        severity,
        duration,
        additionalInfo,
        analysis: analysisResult,
      }

      const updatedHistory = [newEntry, ...history].slice(0, 100) // Keep last 100 entries
      setHistory(updatedHistory)

      // Immediately save to localStorage as backup
      localStorage.setItem("symptocare-history", JSON.stringify(updatedHistory))

      toast({
        title: "Analysis Saved",
        description: "Your symptom analysis has been permanently saved to history.",
      })
    } catch (error) {
      console.error("Error saving to history:", error)
      toast({
        title: "Save Error",
        description: "Unable to save analysis to history. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteHistoryEntry = (id: string) => {
    try {
      const updatedHistory = history.filter((entry) => entry.id !== id)
      setHistory(updatedHistory)

      // Update localStorage immediately
      if (updatedHistory.length > 0) {
        localStorage.setItem("symptocare-history", JSON.stringify(updatedHistory))
      } else {
        localStorage.removeItem("symptocare-history")
      }

      toast({
        title: "Entry Deleted",
        description: "History entry has been permanently removed.",
      })
    } catch (error) {
      console.error("Error deleting history entry:", error)
      toast({
        title: "Delete Error",
        description: "Unable to delete history entry. Please try again.",
        variant: "destructive",
      })
    }
  }

  const clearAllHistory = () => {
    try {
      setHistory([])
      localStorage.removeItem("symptocare-history")
      console.log("All history cleared from localStorage")
      toast({
        title: "History Cleared",
        description: "All history entries have been permanently removed.",
      })
    } catch (error) {
      console.error("Error clearing history:", error)
      toast({
        title: "Clear Error",
        description: "Unable to clear history. Please try again.",
        variant: "destructive",
      })
    }
  }

  const viewHistoryEntry = (entry: HistoryEntry) => {
    setSelectedHistoryEntry(entry)
    setIsHistoryDetailOpen(true)
  }

  const loadFromHistory = (entry: HistoryEntry) => {
    setSymptoms(entry.symptoms)
    setSeverity(entry.severity)
    setDuration(entry.duration)
    setAdditionalInfo(entry.additionalInfo)
    setAnalysis(entry.analysis)
    setIsHistoryOpen(false)

    toast({
      title: "History Loaded",
      description: "Previous analysis has been loaded.",
    })
  }

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) {
      toast({
        title: "No symptoms selected",
        description: "Please select at least one symptom to analyze.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockAnalysis = generateMockAnalysis(symptoms, severity, duration)
      setAnalysis(mockAnalysis)
      setLoading(false)

      // Automatically save to history
      saveToHistory(mockAnalysis)

      toast({
        title: "Analysis Complete",
        description: "Your symptom analysis is ready below.",
      })
    }, 2000)
  }

  const generateMockAnalysis = (symptoms: string[], severity: string, duration: string) => {
    const hasEmergencySymptoms = symptoms.some(
      (s) =>
        s.toLowerCase().includes("chest pain") ||
        s.toLowerCase().includes("shortness of breath") ||
        s.toLowerCase().includes("severe"),
    )

    const hasFeverSymptoms = symptoms.some(
      (s) =>
        s.toLowerCase().includes("fever") ||
        s.toLowerCase().includes("headache") ||
        s.toLowerCase().includes("fatigue"),
    )

    const hasRespiratorySymptoms = symptoms.some(
      (s) =>
        s.toLowerCase().includes("cough") ||
        s.toLowerCase().includes("sore throat") ||
        s.toLowerCase().includes("shortness of breath"),
    )

    const hasDigestiveSymptoms = symptoms.some(
      (s) =>
        s.toLowerCase().includes("nausea") ||
        s.toLowerCase().includes("vomiting") ||
        s.toLowerCase().includes("abdominal pain") ||
        s.toLowerCase().includes("diarrhea"),
    )

    const hasPainSymptoms = symptoms.some(
      (s) =>
        s.toLowerCase().includes("headache") ||
        s.toLowerCase().includes("back pain") ||
        s.toLowerCase().includes("joint pain"),
    )

    let urgencyLevel = "low"
    let recommendations = []
    let possibleConditions = []
    let homeRemedies = []
    let medications = []
    let prevention = []

    if (hasEmergencySymptoms || severity === "severe") {
      urgencyLevel = "high"
      recommendations = [
        "Seek immediate medical attention",
        "Consider visiting an emergency room",
        "Do not delay medical care",
      ]
      possibleConditions = ["Emergency condition", "Requires immediate evaluation"]
      homeRemedies = [
        "Stay calm and call for help immediately",
        "Sit upright if experiencing breathing difficulties",
        "Loosen tight clothing",
        "Do not take any medications without medical supervision",
      ]
      medications = [
        "⚠️ Do not self-medicate for emergency symptoms",
        "Wait for professional medical evaluation",
        "Have your current medication list ready for medical staff",
      ]
      prevention = [
        "Follow up with healthcare provider after emergency treatment",
        "Monitor for recurring symptoms",
        "Maintain emergency contact information",
      ]
    } else if (hasFeverSymptoms && hasRespiratorySymptoms) {
      urgencyLevel = "medium"
      recommendations = [
        "Rest and stay hydrated",
        "Monitor temperature regularly",
        "Consider seeing a healthcare provider if symptoms worsen",
        "Isolate if you suspect viral infection",
      ]
      possibleConditions = ["Common cold", "Flu", "Upper respiratory infection"]
      homeRemedies = [
        "🍵 Drink warm liquids like herbal tea, broth, or warm water with honey",
        "🛁 Take steam inhalations or hot showers to relieve congestion",
        "🍯 Use honey (1-2 teaspoons) to soothe throat irritation",
        "🧂 Gargle with warm salt water (1/2 tsp salt in warm water)",
        "❄️ Apply cool compresses to forehead for fever relief",
        "💤 Get plenty of rest in a comfortable, well-ventilated room",
      ]
      medications = [
        "💊 Paracetamol 500mg - 1-2 tablets every 4-6 hours for fever/pain",
        "💊 Ibuprofen 400mg - 1 tablet every 6-8 hours with food",
        "💊 Cetirizine 10mg - 1 tablet daily for runny nose/sneezing",
        "💊 Dextromethorphan syrup - 10-15ml every 4 hours for dry cough",
        "💊 Throat lozenges - Every 2 hours as needed",
        "⚠️ Do not exceed recommended dosages",
      ]
      prevention = [
        "🧼 Wash hands frequently with soap and water",
        "😷 Wear masks in crowded places during flu season",
        "💉 Get annual flu vaccination",
        "🏃‍♂️ Maintain regular exercise and healthy diet",
        "😴 Ensure adequate sleep (7-9 hours)",
        "🚭 Avoid smoking and secondhand smoke",
      ]
    } else if (hasDigestiveSymptoms) {
      urgencyLevel = "medium"
      recommendations = [
        "Follow BRAT diet (Bananas, Rice, Applesauce, Toast)",
        "Stay hydrated with small, frequent sips",
        "Avoid dairy and spicy foods temporarily",
        "Monitor for signs of dehydration",
      ]
      possibleConditions = ["Gastroenteritis", "Food poisoning", "Stomach flu"]
      homeRemedies = [
        "🍌 BRAT diet: Bananas, Rice, Applesauce, Toast",
        "💧 Sip clear fluids: water, clear broths, electrolyte solutions",
        "🫖 Ginger tea or ginger ale for nausea relief",
        "🍃 Peppermint tea to soothe stomach muscles",
        "🔥 Apply warm compress to abdomen for cramps",
        "🥄 Small, frequent meals instead of large portions",
      ]
      medications = [
        "💊 Omeprazole 20mg - 1 capsule before breakfast for acidity",
        "💊 Domperidone 10mg - 1 tablet before meals for nausea",
        "💊 Loperamide 2mg - 1-2 capsules for diarrhea (max 8mg/day)",
        "💊 ORS packets - Mix with water for dehydration",
        "💊 Simethicone 40mg - 1-2 tablets after meals for gas",
        "⚠️ Avoid anti-diarrheal medications if fever is present",
      ]
      prevention = [
        "🧼 Practice good hand hygiene before eating",
        "🍽️ Eat freshly cooked, hot foods",
        "💧 Drink bottled or boiled water when traveling",
        "🥗 Wash fruits and vegetables thoroughly",
        "❄️ Store food at proper temperatures",
        "🚫 Avoid street food and undercooked meals",
      ]
    } else if (hasPainSymptoms) {
      urgencyLevel = "low"
      recommendations = [
        "Apply hot/cold therapy as appropriate",
        "Gentle stretching and movement",
        "Maintain good posture",
        "Consider over-the-counter pain relief",
      ]
      possibleConditions = ["Tension headache", "Muscle strain", "Minor injury"]
      homeRemedies = [
        "🧊 Apply ice pack for 15-20 minutes for acute injuries",
        "🔥 Use heat therapy for muscle tension and chronic pain",
        "🧘‍♀️ Practice relaxation techniques and deep breathing",
        "💆‍♀️ Gentle massage of affected area",
        "🛌 Ensure proper sleep position and supportive pillows",
        "🚶‍♂️ Light exercise and stretching as tolerated",
      ]
      medications = [
        "💊 Paracetamol 500mg - 1-2 tablets every 4-6 hours",
        "💊 Ibuprofen 400mg - 1 tablet every 6-8 hours with food",
        "💊 Diclofenac gel - Apply to affected area 3-4 times daily",
        "💊 Aspirin 500mg - 1-2 tablets every 4 hours (avoid if stomach issues)",
        "💊 Muscle relaxants - Only if prescribed by doctor",
        "⚠️ Don't exceed maximum daily doses",
      ]
      prevention = [
        "🪑 Maintain good posture while sitting and standing",
        "💪 Regular exercise to strengthen muscles",
        "🧘‍♀️ Practice stress management techniques",
        "💧 Stay hydrated throughout the day",
        "😴 Ensure quality sleep with proper pillow support",
        "⚖️ Maintain healthy weight to reduce joint stress",
      ]
    } else {
      urgencyLevel = "low"
      recommendations = [
        "Monitor symptoms closely",
        "Rest and maintain good hydration",
        "Consider over-the-counter remedies",
        "See a healthcare provider if symptoms persist",
      ]
      possibleConditions = ["Minor illness", "Self-limiting condition"]
      homeRemedies = [
        "💧 Stay well-hydrated with water and clear fluids",
        "💤 Get adequate rest and sleep",
        "🍎 Maintain a balanced, nutritious diet",
        "🌡️ Monitor symptoms and temperature regularly",
        "🏠 Stay in a comfortable, well-ventilated environment",
        "🧘‍♀️ Practice stress reduction techniques",
      ]
      medications = [
        "💊 Paracetamol 500mg - For general discomfort (as needed)",
        "💊 Multivitamins - To support immune system",
        "💊 Probiotics - For digestive health",
        "⚠️ Consult pharmacist before taking any medications",
        "📋 Keep a symptom diary for healthcare provider",
      ]
      prevention = [
        "🧼 Regular hand washing and hygiene",
        "🏃‍♂️ Maintain regular physical activity",
        "🥗 Eat a balanced diet rich in fruits and vegetables",
        "😴 Ensure adequate sleep (7-9 hours nightly)",
        "💧 Stay hydrated throughout the day",
        "🚭 Avoid smoking and limit alcohol consumption",
      ]
    }

    return {
      urgencyLevel,
      recommendations,
      possibleConditions,
      homeRemedies,
      medications,
      prevention,
      riskFactors: severity === "severe" ? ["High severity reported"] : ["Low to moderate severity"],
      nextSteps:
        urgencyLevel === "high"
          ? ["Seek immediate medical care"]
          : ["Monitor for 24-48 hours", "Schedule appointment if no improvement"],
    }
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-green-600 bg-green-50 border-green-200"
    }
  }

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="h-5 w-5" />
      case "medium":
        return <Clock className="h-5 w-5" />
      default:
        return <CheckCircle className="h-5 w-5" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <h1 className="text-4xl font-bold text-gray-900">AI Symptom Checker</h1>
          <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                <History className="h-4 w-4" />
                <span>History ({history.length})</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>Symptom Analysis History</span>
                </DialogTitle>
                <DialogDescription>View your previous symptom analyses and health recommendations</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {history.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No history entries yet</p>
                    <p className="text-sm">Your symptom analyses will appear here automatically</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">{history.length} entries found</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllHistory}
                        className="text-red-600 hover:text-red-700 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear All
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {history.map((entry) => (
                        <Card key={entry.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">
                                    {entry.date.toLocaleDateString()} at{" "}
                                    {entry.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                  <Badge variant="outline" className={getUrgencyColor(entry.analysis.urgencyLevel)}>
                                    {entry.analysis.urgencyLevel} priority
                                  </Badge>
                                </div>

                                <div className="mb-2">
                                  <p className="text-sm font-medium mb-1">Symptoms:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {entry.symptoms.slice(0, 3).map((symptom, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {symptom}
                                      </Badge>
                                    ))}
                                    {entry.symptoms.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{entry.symptoms.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <p className="text-xs text-gray-500">
                                  Severity: {entry.severity} • Duration: {entry.duration}
                                </p>
                              </div>

                              <div className="flex space-x-2 ml-4">
                                <Button size="sm" variant="outline" onClick={() => viewHistoryEntry(entry)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" onClick={() => loadFromHistory(entry)}>
                                  Load
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteHistoryEntry(entry.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-xl text-gray-600">Describe your symptoms and get personalized health recommendations</p>
      </div>

      {/* History Detail Modal */}
      <Dialog open={isHistoryDetailOpen} onOpenChange={setIsHistoryDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Symptom Analysis Details</DialogTitle>
            <DialogDescription>
              {selectedHistoryEntry && (
                <>
                  Analysis from {selectedHistoryEntry.date.toLocaleDateString()} at{" "}
                  {selectedHistoryEntry.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedHistoryEntry && (
            <div className="space-y-6">
              {/* Original Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Original Input</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="font-medium">Symptoms:</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedHistoryEntry.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="secondary">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-medium">Severity:</Label>
                      <p className="text-sm capitalize">{selectedHistoryEntry.severity}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Duration:</Label>
                      <p className="text-sm">{selectedHistoryEntry.duration}</p>
                    </div>
                  </div>
                  {selectedHistoryEntry.additionalInfo && (
                    <div>
                      <Label className="font-medium">Additional Information:</Label>
                      <p className="text-sm mt-1">{selectedHistoryEntry.additionalInfo}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Analysis Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div
                    className={`p-4 rounded-lg border-2 ${getUrgencyColor(selectedHistoryEntry.analysis.urgencyLevel)}`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {getUrgencyIcon(selectedHistoryEntry.analysis.urgencyLevel)}
                      <span className="font-semibold text-lg">
                        {selectedHistoryEntry.analysis.urgencyLevel === "high"
                          ? "High Priority"
                          : selectedHistoryEntry.analysis.urgencyLevel === "medium"
                            ? "Medium Priority"
                            : "Low Priority"}
                      </span>
                    </div>
                  </div>

                  {/* Home Remedies */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-3">🏠 Home Remedies</h4>
                    <ul className="text-sm text-green-700 space-y-2">
                      {selectedHistoryEntry.analysis.homeRemedies.map((remedy: string, index: number) => (
                        <li key={index}>• {remedy}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Medications */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">💊 Medications</h4>
                    <ul className="text-sm text-blue-700 space-y-2">
                      {selectedHistoryEntry.analysis.medications.map((medication: string, index: number) => (
                        <li key={index}>• {medication}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Prevention */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-3">🛡️ Prevention Tips</h4>
                    <ul className="text-sm text-purple-700 space-y-2">
                      {selectedHistoryEntry.analysis.prevention.map((tip: string, index: number) => (
                        <li key={index}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5" />
                <span>Symptom Selection</span>
              </CardTitle>
              <CardDescription>Select your symptoms from the list below or add custom ones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Common Symptoms</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonSymptoms.map((symptom) => (
                    <Button
                      key={symptom}
                      variant={symptoms.includes(symptom) ? "default" : "outline"}
                      size="sm"
                      onClick={() => (symptoms.includes(symptom) ? removeSymptom(symptom) : addSymptom(symptom))}
                      className="justify-start h-auto py-2 px-3 text-sm"
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="custom-symptom">Add Custom Symptom</Label>
                <div className="flex space-x-2">
                  <Input
                    id="custom-symptom"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    placeholder="Describe your symptom..."
                    onKeyPress={(e) => e.key === "Enter" && addCustomSymptom()}
                  />
                  <Button onClick={addCustomSymptom} disabled={!customSymptom.trim()}>
                    Add
                  </Button>
                </div>
              </div>

              {symptoms.length > 0 && (
                <div className="space-y-3">
                  <Label>Selected Symptoms</Label>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        variant="secondary"
                        className="px-3 py-1 cursor-pointer hover:bg-red-100 hover:text-red-800"
                        onClick={() => removeSymptom(symptom)}
                      >
                        {symptom} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="severity">Symptom Severity</Label>
                  <Select onValueChange={setSeverity} value={severity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity level" />
                    </SelectTrigger>
                    <SelectContent>
                      {severityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${level.color.split(" ")[0]}`}></div>
                            <span>{level.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select onValueChange={setDuration} value={duration}>
                    <SelectTrigger>
                      <SelectValue placeholder="How long have you had these symptoms?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="few-hours">A few hours</SelectItem>
                      <SelectItem value="1-day">1 day</SelectItem>
                      <SelectItem value="2-3-days">2-3 days</SelectItem>
                      <SelectItem value="1-week">About a week</SelectItem>
                      <SelectItem value="more-week">More than a week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-info">Additional Information (Optional)</Label>
                <Textarea
                  id="additional-info"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Any additional details about your symptoms, medical history, or concerns..."
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={analyzeSymptoms}
                className="w-full h-12 text-lg"
                disabled={loading || symptoms.length === 0}
              >
                {loading ? (
                  <>
                    <Activity className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-5 w-5" />
                    Analyze My Symptoms
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {analysis && (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Analysis Results</span>
                </CardTitle>
                <CardDescription>Based on your reported symptoms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className={`p-4 rounded-lg border-2 ${getUrgencyColor(analysis.urgencyLevel)}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {getUrgencyIcon(analysis.urgencyLevel)}
                    <span className="font-semibold text-lg">
                      {analysis.urgencyLevel === "high"
                        ? "High Priority"
                        : analysis.urgencyLevel === "medium"
                          ? "Medium Priority"
                          : "Low Priority"}
                    </span>
                  </div>
                  <p className="text-sm">
                    {analysis.urgencyLevel === "high"
                      ? "Your symptoms may require immediate medical attention."
                      : analysis.urgencyLevel === "medium"
                        ? "Your symptoms should be monitored and may require medical consultation."
                        : "Your symptoms appear to be manageable with self-care."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <Thermometer className="h-4 w-4 mr-2 text-blue-600" />
                      Possible Conditions
                    </h3>
                    <ul className="space-y-2">
                      {analysis.possibleConditions.map((condition: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Home Remedies Section */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">🏠 Home Remedies</h4>
                  <ul className="text-sm text-green-700 space-y-2">
                    {analysis.homeRemedies.map((remedy: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span>•</span>
                        <span>{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Medications Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">💊 Medications</h4>
                  <ul className="text-sm text-blue-700 space-y-2">
                    {analysis.medications.map((medication: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span>•</span>
                        <span>{medication}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
                    <strong>Important:</strong> Always read medicine labels, follow dosage instructions, and consult a
                    pharmacist or doctor if you have allergies or take other medications.
                  </div>
                </div>

                {/* Prevention Section */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center">🛡️ Prevention Tips</h4>
                  <ul className="text-sm text-purple-700 space-y-2">
                    {analysis.prevention.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span>•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Next Steps</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {analysis.nextSteps.map((step: string, index: number) => (
                      <li key={index}>• {step}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>Important Notice</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                This symptom checker is for informational purposes only and should not replace professional medical
                advice.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Seek immediate medical attention if you experience:</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Severe chest pain</li>
                <li>• Difficulty breathing</li>
                <li>• Loss of consciousness</li>
                <li>• Severe bleeding</li>
                <li>• Signs of stroke</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <h3 className="font-semibold text-green-800">Need Professional Help?</h3>
                <p className="text-sm text-green-700">
                  Book a consultation with our qualified healthcare professionals
                </p>
                <Button className="w-full bg-transparent" variant="outline">
                  Book Consultation
                </Button>
              </div>
            </CardContent>
          </Card>

          {history.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <History className="h-12 w-12 text-blue-600 mx-auto" />
                  <h3 className="font-semibold text-blue-800">Your Health History</h3>
                  <p className="text-sm text-blue-700">
                    You have {history.length} saved analysis{history.length !== 1 ? "es" : ""}
                  </p>
                  <Button className="w-full bg-transparent" variant="outline" onClick={() => setIsHistoryOpen(true)}>
                    <History className="mr-2 h-4 w-4" />
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
