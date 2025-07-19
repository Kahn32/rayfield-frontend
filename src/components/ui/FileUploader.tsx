import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { BACKEND_URL } from "@/utils/api";

interface FileUploaderProps {
  onUploadSuccess: (data: any) => void;
  onUploadError: (error: string) => void;
  selectedPermit: string;        // 👈 add this
  selectedModes: string[];       // 👈 add this
}

const FileUploader = ({
  onUploadSuccess,
  onUploadError,
  selectedPermit,   // 👈 use this
  selectedModes,    // 👈 use this
}: FileUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      uploadFiles(files);
    }
  }, [selectedPermit, selectedModes]); // 👈 dependencies

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      uploadFiles(files);
    }
  }, [selectedPermit, selectedModes]); // 👈 dependencies

  const uploadFiles = async (files: File[]) => {
    setUploadedFiles(files);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", files[0]); // Only handle first file for now
      formData.append("permitType", selectedPermit); // ✅ Send permit type
      formData.append("analysisModes", JSON.stringify(selectedModes)); // ✅ Send analysis modes

      const response = await fetch(`${BACKEND_URL}/api/upload`, {

        method: "POST",
        body: formData,
      });

      console.log("📡 Raw response object:", response);

      // ✅ Ensure backend responded properly
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Backend error response:", errorText);
        throw new Error(`Backend upload failed (status ${response.status}): ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.log("✅ Parsed backend JSON:", result);
        onUploadSuccess(result);
      } else {
        console.error("❌ Invalid Content-Type:", contentType);
        throw new Error("Backend did not return JSON.");
      }
    } catch (err: any) {
      console.error("❌ Upload error (frontend):", err);
      onUploadError(err.message || "Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-accent/30"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {isUploading ? (
          <div className="flex justify-center items-center gap-2">
            <Loader2 className="animate-spin w-6 h-6 text-primary" />
            <span className="text-primary">Uploading...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-primary rounded-lg">
                <Upload className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Drag & drop PDF/DOCX</h3>
              <p className="text-muted-foreground">or click to browse</p>
            </div>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Uploaded Files</h3>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg"
              >
                <div className="p-2 bg-primary/10 rounded">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setUploadedFiles([])}
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;