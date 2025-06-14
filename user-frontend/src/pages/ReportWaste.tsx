import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Camera,
  MapPin,
  QrCode,
  Upload,
  CheckCircle,
  AlertTriangle,
  Coins,
  Clock,
  Loader2,
  Zap,
  AlertCircle,
  Brain,
} from "lucide-react";

type ReportStep = "location" | "photo" | "details" | "submit" | "success";
type UrgencyLevel = "low" | "medium" | "high" | "critical";

const urgencyLevels: Record<
  UrgencyLevel,
  { label: string; color: string; description: string }
> = {
  low: {
    label: "Low",
    color: "bg-green-100 text-green-800",
    description: "Minor litter, not urgent",
  },
  medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800",
    description: "Moderate waste accumulation",
  },
  high: {
    label: "High",
    color: "bg-orange-100 text-orange-800",
    description: "Significant waste buildup",
  },
  critical: {
    label: "Critical",
    color: "bg-red-100 text-red-800",
    description: "Overflowing, immediate attention needed",
  },
};

// Configuration for your backend
const API_BASE_URL = "http://localhost:3000/api"; // Update this to match your backend URL

const ReportWaste = () => {
  const [currentStep, setCurrentStep] = useState<ReportStep>("location");
  const [isLoading, setIsLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{
    urgency: string;
    confidence: number;
    fillLevel: number;
    success: boolean;
  } | null>(null);

  const [formData, setFormData] = useState({
    binId: "",
    location: "",
    coordinates: { lat: 0, lng: 0 },
    description: "",
  });

  // Show notification helper
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Function to submit data to backend
  const submitToBackend = async () => {
    if (!uploadedFile) {
      throw new Error("No image file available");
    }

    // Create FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append('image', uploadedFile);
    formDataToSend.append('binId', formData.binId);
    formDataToSend.append('gps', JSON.stringify({
      latitude: formData.coordinates.lat,
      longitude: formData.coordinates.lng,
      location: formData.location
    }));
    formDataToSend.append('userId', `user_${Date.now()}`); // Auto-generate user ID
    formDataToSend.append('description', formData.description);
    
    // Use backend's configured account for token distribution
    formDataToSend.append('userAccountId', '0.0.6153352');

    console.log("Submitting data to backend...");

    const response = await fetch(`${API_BASE_URL}/submit-bin-data`, {
      method: "POST",
      body: formDataToSend, // Don't set Content-Type header, let browser set it with boundary
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  const handleLocationDetection = async () => {
    setDetectingLocation(true);

    try {
      // Simulate GPS detection
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockLocation = "Central Park, Bin #42";
      const mockCoords = { lat: 40.7829, lng: -73.9654 };

      setFormData((prev) => ({
        ...prev,
        location: mockLocation,
        coordinates: mockCoords,
        binId: "BIN_042_CP",
      }));

      showNotification("success", "Location detected successfully!");
      setCurrentStep("photo");
    } catch (error) {
      showNotification("error", "Failed to detect location");
    } finally {
      setDetectingLocation(false);
    }
  };

  const [isScanning, setIsScanning] = useState(false);

  const handleQRScan = async () => {
    setIsScanning(true);
    setIsLoading(true);

    try {
      // Simulate camera opening and QR scanning process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setFormData((prev) => ({
        ...prev,
        binId: "BIN_128_DT",
        location: "Downtown Plaza, Bin #128",
        coordinates: { lat: 40.7505, lng: -73.9934 },
      }));

      showNotification("success", "QR code scanned successfully!");
      setCurrentStep("photo");
    } catch (error) {
      showNotification("error", "Failed to scan QR code");
    } finally {
      setIsLoading(false);
      setIsScanning(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAnalyzingImage(true);
    setUploadedFile(file); // Store the actual file
    setAiAnalysis(null); // Reset previous analysis

    try {
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Show analyzing state
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showNotification("success", "Image uploaded successfully! Ready for AI analysis.");
      setCurrentStep("details");
    } catch (error) {
      showNotification("error", "Failed to upload image");
    } finally {
      setAnalyzingImage(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Submit to your backend
      const result = await submitToBackend();
      
      console.log("Backend response:", result);
      
      // Store AI analysis results
      if (result.aiAnalysis) {
        setAiAnalysis(result.aiAnalysis);
      }
      
      // Show success message with actual response data
      if (result.success) {
        let successMessage = "Report submitted successfully!";
        
        if (result.tokens && result.tokens.success) {
          successMessage += ` You earned ${result.tokens.amount} CleanTokens!`;
        } else {
          successMessage += " Data recorded on blockchain!";
        }
        
        if (result.aiAnalysis && result.aiAnalysis.success) {
          successMessage += ` AI detected ${result.aiAnalysis.urgency} fill level.`;
        }
        
        showNotification("success", successMessage);

        // Move to success step to show results
        setCurrentStep("success");
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      showNotification("error", `Failed to submit report: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNewReport = () => {
    setCurrentStep("location");
    setFormData({
      binId: "",
      location: "",
      coordinates: { lat: 0, lng: 0 },
      description: "",
    });
    setUploadedImage(null);
    setUploadedFile(null);
    setAiAnalysis(null);
    setNotification(null);
  };

  const getStepProgress = () => {
    const steps = ["location", "photo", "details", "submit", "success"];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Notification */}
      {notification && (
        <div className="mb-6">
          <Alert className={notification.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <AlertCircle className={`h-4 w-4 ${notification.type === "success" ? "text-green-600" : "text-red-600"}`} />
            <AlertDescription className={notification.type === "success" ? "text-green-800" : "text-red-800"}>
              {notification.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Waste</h1>
        <p className="text-gray-600">
          Help clean your city and earn crypto rewards with AI-powered analysis
        </p>

        {/* Progress Bar */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(getStepProgress())}%</span>
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>
      </div>

      {/* Step 1: Location Detection */}
      {currentStep === "location" && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-green-600" />
              Step 1: Locate Waste Bin
            </CardTitle>
            <CardDescription>
              Find the waste bin using QR code or GPS location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="gps" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gps">GPS Detection</TabsTrigger>
                <TabsTrigger value="qr">QR Code Scan</TabsTrigger>
              </TabsList>

              <TabsContent value="gps" className="space-y-4">
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <MapPin className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Auto-detect Location
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Use your device's GPS to find nearby waste bins
                  </p>
                  <Button
                    onClick={handleLocationDetection}
                    disabled={detectingLocation}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {detectingLocation ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        Detect Location
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="qr" className="space-y-4">
                {!isScanning ? (
                  <div className="text-center py-8">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <QrCode className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Scan QR Code</h3>
                    <p className="text-gray-600 mb-6">
                      Scan the QR code on the waste bin for precise
                      identification
                    </p>
                    <Button
                      onClick={handleQRScan}
                      disabled={isLoading}
                      variant="outline"
                      className="border-green-200 text-green-700"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Open Camera Scanner
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Simulated Camera Interface */}
                    <div className="relative bg-black rounded-lg p-8 aspect-video">
                      <div className="absolute inset-4 border-2 border-white/50 rounded-lg">
                        {/* QR Code Scanning Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            {/* Corner indicators */}
                            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-green-400"></div>
                            <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-green-400"></div>
                            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-green-400"></div>
                            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-green-400"></div>

                            {/* QR Code placeholder */}
                            <div className="w-24 h-24 bg-white/20 rounded border border-green-400">
                              <div className="w-full h-full grid grid-cols-6 gap-px p-1">
                                {Array.from({ length: 36 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`bg-white/60 ${
                                      Math.random() > 0.5
                                        ? "opacity-100"
                                        : "opacity-30"
                                    }`}
                                  ></div>
                                ))}
                              </div>
                            </div>

                            {/* Scanning line animation */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-0.5 bg-green-400 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Camera info */}
                      <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span className="text-sm">
                            Scanning for QR code...
                          </span>
                        </div>
                        <p className="text-xs opacity-80">
                          Position the QR code within the frame
                        </p>
                      </div>
                    </div>

                    {/* Cancel button */}
                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsScanning(false);
                          setIsLoading(false);
                        }}
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        Cancel Scan
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {formData.location && (
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-center text-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span className="font-medium">Location Detected</span>
                </div>
                <p className="text-sm text-green-600 mt-1">{formData.location}</p>
                <p className="text-xs text-green-500">Bin ID: {formData.binId}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Photo Upload */}
      {currentStep === "photo" && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2 h-5 w-5 text-green-600" />
              Step 2: Take Photo
            </CardTitle>
            <CardDescription>
              Upload a clear photo of the waste bin for AI-powered analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!uploadedImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <span className="text-lg font-semibold text-green-600 hover:text-green-700">
                        Upload a photo
                      </span>
                      <Input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </Label>
                    <p className="text-gray-600 text-sm mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded waste"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {analyzingImage && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-white">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin mb-2" />
                        <p>Processing image...</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-center text-green-700 mb-2">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span className="font-medium">Image Ready for Analysis</span>
                  </div>
                  <p className="text-sm text-green-600">
                    Image uploaded successfully. AI analysis will be performed when you submit the report.
                  </p>
                </div>

                <Button
                  onClick={() => setCurrentStep("details")}
                  disabled={analyzingImage}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Continue to Details
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Details */}
      {currentStep === "details" && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-green-600" />
              Step 3: Report Details
            </CardTitle>
            <CardDescription>
              Add optional description before AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">
                Additional Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the waste situation in more detail..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>

            <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-green-50">
              <div className="flex items-center text-purple-700 mb-2">
                <Brain className="mr-2 h-4 w-4" />
                <span className="font-medium">AI Analysis</span>
              </div>
              <p className="text-sm text-purple-600 mb-2">
                Our AI will automatically analyze your image to determine:
              </p>
              <ul className="text-xs text-purple-600 list-disc list-inside space-y-1">
                <li>Fill level percentage</li>
                <li>Urgency classification</li>
                <li>Contamination detection</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 bg-green-50">
              <div className="flex items-center text-green-700 mb-2">
                <Coins className="mr-2 h-4 w-4" />
                <span className="font-medium">Automatic Rewards</span>
              </div>
              <p className="text-2xl font-bold text-green-600">10 CleanTokens</p>
              <p className="text-sm text-green-600">
                Automatically distributed to account 0.0.6153352
              </p>
            </div>

            <Button
              onClick={() => setCurrentStep("submit")}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Review & Submit
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Submit */}
      {currentStep === "submit" && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              Step 4: Review & Submit
            </CardTitle>
            <CardDescription>
              Review your report before submitting to the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Location
                  </Label>
                  <p className="text-sm text-gray-900">{formData.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Bin ID
                  </Label>
                  <p className="text-sm text-gray-900">{formData.binId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Reward Account
                  </Label>
                  <p className="text-sm text-gray-900">0.0.6153352 (Auto)</p>
                </div>
              </div>

              {uploadedImage && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Photo for AI Analysis
                  </Label>
                  <img
                    src={uploadedImage}
                    alt="Waste report"
                    className="w-full h-32 object-cover rounded-lg mt-1"
                  />
                </div>
              )}
            </div>

            {formData.description && (
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <p className="text-sm text-gray-900">{formData.description}</p>
              </div>
            )}

            {/* AI Analysis Results (if available) */}
            {aiAnalysis && (
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-center text-green-700 mb-2">
                  <Brain className="mr-2 h-4 w-4" />
                  <span className="font-medium">AI Analysis Results</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-600">Fill Level:</span>
                    <span className="font-medium ml-2">{aiAnalysis.fillLevel}%</span>
                  </div>
                  <div>
                    <span className="text-green-600">Urgency:</span>
                    <span className="font-medium ml-2 capitalize">{aiAnalysis.urgency}</span>
                  </div>
                  <div>
                    <span className="text-green-600">Confidence:</span>
                    <span className="font-medium ml-2">{aiAnalysis.confidence}%</span>
                  </div>
                  <div>
                    <span className="text-green-600">Status:</span>
                    <span className={`font-medium ml-2 ${aiAnalysis.success ? 'text-green-600' : 'text-red-600'}`}>
                      {aiAnalysis.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="border rounded-lg p-4 bg-green-50">
              <div className="flex items-center text-green-700 mb-2">
                <Clock className="mr-2 h-4 w-4" />
                <span className="font-medium">Secure Report Recording</span>
              </div>
              <p className="text-sm text-green-600">
               Your report will be permanently saved in a secure digital ledger that can't be changed or deleted. This ensures transparency and helps city services track waste management efficiently.
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading || !uploadedFile}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing with AI & Submitting to Blockchain...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Success */}
      {currentStep === "success" && (
        <Card className="shadow-lg border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="mr-2 h-5 w-5" />
              Report Submitted Successfully!
            </CardTitle>
            <CardDescription className="text-green-600">
              Your waste report has been processed and recorded on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* AI Analysis Results */}
            {aiAnalysis && (
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-center text-green-700 mb-4">
                  <Brain className="mr-2 h-5 w-5" />
                  <span className="font-medium text-lg">AI Analysis Results</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="text-green-600 font-medium">Fill Level:</span>
                      <div className="flex items-center mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${aiAnalysis.fillLevel}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-green-700">{aiAnalysis.fillLevel}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Urgency Level:</span>
                      <div className="mt-1">
                        <Badge 
                          className={urgencyLevels[aiAnalysis.urgency as UrgencyLevel]?.color || "bg-gray-100 text-gray-800"}
                        >
                          {aiAnalysis.urgency.charAt(0).toUpperCase() + aiAnalysis.urgency.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-green-600 font-medium">AI Confidence:</span>
                      <div className="flex items-center mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${aiAnalysis.confidence}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-green-700">{aiAnalysis.confidence}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Analysis Status:</span>
                      <div className="mt-1">
                        <span className={`font-medium ${aiAnalysis.success ? 'text-green-600' : 'text-red-600'}`}>
                          {aiAnalysis.success ? '✅ Successful' : '❌ Failed'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Report Summary */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-700 mb-3">Report Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Location:</span>
                  <p className="font-medium">{formData.location}</p>
                </div>
                <div>
                  <span className="text-gray-600">Bin ID:</span>
                  <p className="font-medium">{formData.binId}</p>
                </div>
                <div>
                  <span className="text-gray-600">Coordinates:</span>
                  <p className="font-medium">
                    {formData.coordinates.lat.toFixed(4)}, {formData.coordinates.lng.toFixed(4)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Reward Account:</span>
                  <p className="font-medium">0.0.6153352</p>
                </div>
              </div>
              {formData.description && (
                <div className="mt-3">
                  <span className="text-gray-600">Description:</span>
                  <p className="font-medium mt-1">{formData.description}</p>
                </div>
              )}
            </div>

            {/* Blockchain & Rewards Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-center text-green-700 mb-2">
                  <Coins className="mr-2 h-4 w-4" />
                  <span className="font-medium">Rewards Earned</span>
                </div>
                <p className="text-2xl font-bold text-green-600">10 CleanTokens</p>
                <p className="text-sm text-green-600">Distributed to account 0.0.6153352</p>
              </div>

              <div className="border rounded-lg p-4 bg-purple-50">
                <div className="flex items-center text-purple-700 mb-2">
                  <Clock className="mr-2 h-4 w-4" />
                  <span className="font-medium">Permanent Record</span>
                </div>
                <p className="text-sm text-purple-600">
                  Data securely saved in our digital system Transparent and reliable waste management tracking
                </p>
                <p className="text-xs text-purple-500 mt-1">
                  Transparent and immutable waste management data
                </p>
              </div>
            </div>

            {/* Uploaded Image */}
            {uploadedImage && (
              <div className="border rounded-lg p-4">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Analyzed Image
                </Label>
                <img
                  src={uploadedImage}
                  alt="Analyzed waste"
                  className="w-full max-w-md mx-auto h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleStartNewReport}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Report Another Bin
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex-1 border-gray-300"
              >
                <Clock className="mr-2 h-4 w-4" />
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportWaste;