import { useState } from "react";
import FileUploader from "@/components/ui/FileUploader";
import axios from "axios";
import { Button } from "@/components/ui/button";

const UploadPage = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null); // ✅ Add error state
    const [selectedPermit, setSelectedPermit] = useState<string>("Solar"); // Example default
    const [selectedModes, setSelectedModes] = useState<string[]>(["Standard Extraction"]); // Example default

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const handleStartAnalysis = async () => {
    if (files.length === 0) return alert("Please upload at least one file.");
    const formData = new FormData();
    formData.append("file", files[0]); // For now, just handle the first file

    try {
        setIsLoading(true);
        setError(null); // Clear previous error
        const response = await axios.post("http://localhost:3000/api/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
        },
        withCredentials: true, // optional for cookies
        });
        setResult(response.data);
        console.log("✅ Analysis result:", response.data);
    } catch (err) {
        console.error("❌ Upload failed:", err);
        setError("Upload or analysis failed. Please try again."); // ✅ Set error message
    } finally {
        setIsLoading(false);
    }
    };

    return (
    <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-4">Upload Your Permit Documents</h1>
        <p className="text-muted-foreground mb-6">
        Upload PDF or DOCX files to begin breakthrough AI analysis.
        </p>

        <FileUploader
            selectedPermit={selectedPermit}
            selectedModes={selectedModes}
            onUploadSuccess={(data) => {
                console.log("✅ Upload success:", data);
                setResult(data);
            }}
            onUploadError={(err) => {
                console.error("❌ Upload error:", err);
                setError(err);
            }}
        />

        {files.length > 0 && (
        <div className="mt-6 flex justify-end">
            <Button onClick={handleStartAnalysis} disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Start Analysis"}
            </Button>
        </div>
        )}

        {error && (
        <div className="mt-4 text-red-600">
            {error}
        </div>
        )}

        {result && (
        <div className="mt-8">
            <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(result, null, 2)}
            </pre>
        </div>
        )}
    </div>
    );
    };

    export default UploadPage;