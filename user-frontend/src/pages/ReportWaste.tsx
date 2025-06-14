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
import { toast } from "sonner";
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
} from "lucide-react";

type ReportStep = "location" | "photo" | "details" | "submit";
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

const ReportWaste = () => {
  const [currentStep, setCurrentStep] = useState<ReportStep>("location");
  const [isLoading, setIsLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{
    urgency: UrgencyLevel;
    confidence: number;
    wasteType: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    binId: "",
    location: "",
    coordinates: { lat: 0, lng: 0 },
    description: "",
    urgency: "medium" as UrgencyLevel,
  });

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

      toast.success("Location detected successfully!");
      setCurrentStep("photo");
    } catch (error) {
      toast.error("Failed to detect location");
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

      toast.success("QR code scanned successfully!");
      setCurrentStep("photo");
    } catch (error) {
      toast.error("Failed to scan QR code");
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

    try {
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockAnalysis = {
        urgency: "high" as UrgencyLevel,
        confidence: 89,
        wasteType: "Mixed waste with recyclables",
      };

      setAiAnalysis(mockAnalysis);
      setFormData((prev) => ({ ...prev, urgency: mockAnalysis.urgency }));

      toast.success("Image analyzed successfully!");
      setCurrentStep("details");
    } catch (error) {
      toast.error("Failed to analyze image");
    } finally {
      setAnalyzingImage(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Report submitted successfully! You earned 50 ECO tokens!");

      // Reset form
      setCurrentStep("location");
      setFormData({
        binId: "",
        location: "",
        coordinates: { lat: 0, lng: 0 },
        description: "",
        urgency: "medium",
      });
      setUploadedImage(null);
      setAiAnalysis(null);
    } catch (error) {
      toast.error("Failed to submit report");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepProgress = () => {
    const steps = ["location", "photo", "details", "submit"];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Waste</h1>
        <p className="text-gray-600">
          Help clean your city and earn crypto rewards
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
              <MapPin className="mr-2 h-5 w-5 text-eco-600" />
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
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-eco-100">
                    <MapPin className="h-8 w-8 text-eco-600" />
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
                    className="eco-gradient text-white"
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
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nature-100">
                      <QrCode className="h-8 w-8 text-nature-600" />
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
                      className="border-nature-200 text-nature-700"
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
              <div className="border rounded-lg p-4 bg-eco-50">
                <div className="flex items-center text-eco-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span className="font-medium">Location Detected</span>
                </div>
                <p className="text-sm text-eco-600 mt-1">{formData.location}</p>
                <p className="text-xs text-eco-500">Bin ID: {formData.binId}</p>
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
              <Camera className="mr-2 h-5 w-5 text-eco-600" />
              Step 2: Take Photo
            </CardTitle>
            <CardDescription>
              Upload a clear photo of the waste for AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!uploadedImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <span className="text-lg font-semibold text-eco-600 hover:text-eco-700">
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
                        <p>Analyzing image...</p>
                      </div>
                    </div>
                  )}
                </div>

                {aiAnalysis && (
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center text-blue-700 mb-2">
                      <Zap className="mr-2 h-4 w-4" />
                      <span className="font-medium">AI Analysis Complete</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600">
                          Urgency Level:
                        </span>
                        <Badge
                          className={urgencyLevels[aiAnalysis.urgency].color}
                        >
                          {urgencyLevels[aiAnalysis.urgency].label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600">
                          Confidence:
                        </span>
                        <span className="text-sm font-medium">
                          {aiAnalysis.confidence}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600">
                          Waste Type:
                        </span>
                        <span className="text-sm font-medium">
                          {aiAnalysis.wasteType}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => setCurrentStep("details")}
                  disabled={analyzingImage}
                  className="w-full eco-gradient text-white"
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
              <AlertTriangle className="mr-2 h-5 w-5 text-eco-600" />
              Step 3: Report Details
            </CardTitle>
            <CardDescription>
              Add additional information about the waste
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {Object.entries(urgencyLevels).map(([level, config]) => (
                  <Button
                    key={level}
                    variant={formData.urgency === level ? "default" : "outline"}
                    className={`justify-center ${
                      formData.urgency === level
                        ? "eco-gradient text-white"
                        : ""
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        urgency: level as UrgencyLevel,
                      }))
                    }
                  >
                    {config.label}
                  </Button>
                ))}
              </div>
              {formData.urgency && (
                <p className="text-sm text-gray-600">
                  {urgencyLevels[formData.urgency].description}
                </p>
              )}
            </div>

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

            <div className="border rounded-lg p-4 bg-green-50">
              <div className="flex items-center text-green-700 mb-2">
                <Coins className="mr-2 h-4 w-4" />
                <span className="font-medium">Estimated Reward</span>
              </div>
              <p className="text-2xl font-bold text-green-600">50 ECO Tokens</p>
              <p className="text-sm text-green-600">
                Based on urgency level and first report bonus
              </p>
            </div>

            <Button
              onClick={() => setCurrentStep("submit")}
              className="w-full eco-gradient text-white"
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
              <CheckCircle className="mr-2 h-5 w-5 text-eco-600" />
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
                    Urgency
                  </Label>
                  <Badge className={urgencyLevels[formData.urgency].color}>
                    {urgencyLevels[formData.urgency].label}
                  </Badge>
                </div>
              </div>

              {uploadedImage && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Photo
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

            <div className="border rounded-lg p-4 bg-blue-50">
              <div className="flex items-center text-blue-700 mb-2">
                <Clock className="mr-2 h-4 w-4" />
                <span className="font-medium">Blockchain Transaction</span>
              </div>
              <p className="text-sm text-blue-600">
                This report will be recorded on the Hedera blockchain for
                transparency and rewards.
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full eco-gradient text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting to Blockchain...
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
    </div>
  );
};

export default ReportWaste;
