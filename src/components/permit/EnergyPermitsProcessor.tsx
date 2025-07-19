import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add this import
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MessageSquare, Loader2 } from "lucide-react";
import PermitTypeSelector from "./PermitTypeSelector";
import AnalysisModeSelector from "./AnalysisModeSelector";
import FileUploader from "../ui/FileUploader";
import { BACKEND_URL } from "@/utils/api";

const EnergyPermitsProcessor = () => {
  const [selectedPermit, setSelectedPermit] = useState("solar");
  const [selectedModes, setSelectedModes] = useState([
    "standard-extraction",
    "legal-review",
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // ✅ Initialize navigate

  const handlePermitSelect = (permitId: string) => {
    setSelectedPermit(permitId);
  };

  const handleModeToggle = (modeId: string) => {
    setSelectedModes((prev) =>
      prev.includes(modeId)
        ? prev.filter((id) => id !== modeId)
        : [...prev, modeId]
    );
  };

  const handleFilesSelected = async (files: File[]) => {
    setUploadedFiles(files);
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", files[0]); // Upload the first file for now
      formData.append("permitType", selectedPermit); // ✅ Send permitType
      formData.append("analysisModes", JSON.stringify(selectedModes)); // ✅ Send analysisModes
      
      console.log("🚀 Sending to backend:", {
        permitType: selectedPermit,
        analysisModes: selectedModes
      });

      const response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend upload failed");
      }

      const result = await response.json();
      console.log("✅ Backend response:", result);
      setAnalysisData({
        ...result,
        metadata: {
          ...result.metadata,
          permit_type_selected: selectedPermit,        // Add permit type
          analysis_modes_selected: selectedModes,      // Add analysis modes
        },
      });
    } catch (err: any) {
      console.error("❌ Upload error:", err);
      setError("Failed to process document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = selectedPermit && selectedModes.length > 0;

  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Options
              </Button>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">
                Upload Your Permit Documents
              </h1>
              <p className="text-muted-foreground">
                Upload PDF or DOCX files to begin breakthrough AI analysis
              </p>
            </div>

            {/* File uploader */}
            <div className="bg-card rounded-lg border p-8">
              <FileUploader
                selectedPermit={selectedPermit} // 👈 pass it
                selectedModes={selectedModes}   // 👈 pass it
                onUploadSuccess={(data) => {
                  console.log("✅ Upload success:", data);
                  setAnalysisData(data);
                }}
                onUploadError={(err) => {
                  console.error("❌ Upload error:", err);
                  setError(err);
                }}
              />
            </div>

            {isLoading && (
              <div className="flex justify-center items-center mt-8">
                <Loader2 className="animate-spin w-6 h-6 text-primary" />
                <span className="ml-2 text-primary">Analyzing document...</span>
              </div>
            )}

            {error && (
              <div className="mt-4 text-red-600 text-center">
                {error}
              </div>
            )}

            {analysisData && (
              <div className="bg-card rounded-lg border p-6 mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm font-medium text-success">
                    Analysis Complete! 🎉
                  </span>
                </div>

                <p className="text-foreground font-medium">
                  Document processed and saved to database.
                </p>

                <div className="flex gap-3 mt-4">
                  {/* ✅ View Analysis */}
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() =>
                      navigate("/permit/analysis", {
                        state: { metadata: analysisData.metadata },
                      })
                    }
                  >
                    View Analysis
                  </Button>

                  {/* ✅ Start Chat with permitType + analysisModes */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() =>
                      navigate("/permit/chat", {
                        state: {
                          metadata: analysisData.metadata,
                          permitType: selectedPermit,       // ✅ Pass permitType
                          analysisModes: selectedModes,     // ✅ Pass analysisModes
                        },
                      })
                    }
                  >
                    <MessageSquare className="w-4 h-4" />
                    Start Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    My Documents
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              ⚡ Breakthrough AI Technology
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Permit Review in{" "}
              <span className="text-primary">Seconds, Not Days</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Rayfield Energy AI delivers breakthrough analysis of complex
              permit agreements—transforming weeks of manual legal review into
              seconds of intelligent extraction for energy and legal teams.
            </p>
          </div>

          {/* Permit Type Selection */}
          <div className="bg-card rounded-lg border p-8">
            <PermitTypeSelector
              selectedPermit={selectedPermit}
              onPermitSelect={handlePermitSelect}
            />
          </div>

          {/* Analysis Modes */}
          <div className="bg-card rounded-lg border p-8">
            <AnalysisModeSelector
              selectedModes={selectedModes}
              onModeToggle={handleModeToggle}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              disabled={!canProceed}
              onClick={() => setCurrentStep(2)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 flex items-center gap-2"
            >
              Continue to Upload & Analyze Permit
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyPermitsProcessor;