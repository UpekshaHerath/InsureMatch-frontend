"use client";

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectField from "@/components/molecules/SelectField";
import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { POLICY_TYPE_LABELS } from "@/lib/utils/constants";

// Build SelectField-compatible options from the shared constants
const POLICY_TYPE_OPTIONS = Object.entries(POLICY_TYPE_LABELS).map(
  ([value, label]) => ({ value, label })
) as readonly { value: string; label: string }[];

// Accepted MIME types and file extensions
const ACCEPTED_EXTENSIONS = ".pdf,.docx,.txt";
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

interface UploadState {
  status: "idle" | "uploading" | "success" | "error";
  message: string;
}

export default function PolicyUploadForm() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [policyName, setPolicyName] = useState("");
  const [policyType, setPolicyType] = useState("");
  const [company, setCompany] = useState("");
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    message: "",
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFileError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate type client-side for immediate feedback
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      setFileError("Only PDF, DOCX, and TXT files are accepted.");
      setSelectedFile(null);
      // Reset input so the same file can be re-selected after correction
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    setUploadState({ status: "idle", message: "" });
  }

  function resetForm() {
    setSelectedFile(null);
    setFileError("");
    setPolicyName("");
    setPolicyType("");
    setCompany("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedFile) {
      setFileError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (policyName.trim()) formData.append("policy_name", policyName.trim());
    if (policyType) formData.append("policy_type", policyType);
    if (company.trim()) formData.append("company", company.trim());

    setUploadState({ status: "uploading", message: "" });

    try {
      await apiClient.post(ENDPOINTS.INGEST, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        // LLM metadata extraction can take 30-60 s; use a longer timeout
        timeout: 120_000,
      });

      setUploadState({
        status: "success",
        message: `"${selectedFile.name}" was ingested successfully.`,
      });

      // Refresh the policies table
      await queryClient.invalidateQueries({ queryKey: ["policies"] });

      // Clear the form so a new document can be uploaded straight away
      resetForm();
    } catch (err: unknown) {
      let message = "Upload failed. Please try again.";

      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response
      ) {
        const data = (err as { response: { data: unknown } }).response.data;
        if (
          data &&
          typeof data === "object" &&
          "detail" in data &&
          typeof (data as { detail: unknown }).detail === "string"
        ) {
          message = (data as { detail: string }).detail;
        }
      }

      setUploadState({ status: "error", message });
    }
  }

  const isUploading = uploadState.status === "uploading";

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-secondary">
          Upload Policy Document
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload a PDF, DOCX, or TXT file. Metadata fields are optional — the
          AI will extract them automatically if left blank (adds 30-60 s).
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* File input */}
          <div className="space-y-2">
            <Label htmlFor="policy-file">
              Document file
              <span className="text-red-500 ml-1">*</span>
            </Label>

            <div
              className={[
                "flex items-center gap-3 rounded-md border px-3 py-2 transition-colors",
                fileError
                  ? "border-red-500 bg-red-50"
                  : selectedFile
                    ? "border-primary/60 bg-orange-50"
                    : "border-input bg-background hover:border-primary/40",
              ].join(" ")}
            >
              {/* Hidden native input */}
              <input
                ref={fileInputRef}
                id="policy-file"
                type="file"
                accept={ACCEPTED_EXTENSIONS}
                onChange={handleFileChange}
                disabled={isUploading}
                className="sr-only"
              />

              {/* Styled trigger button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 border-primary text-primary hover:bg-orange-50"
              >
                Choose file
              </Button>

              <span
                className={[
                  "truncate text-sm",
                  selectedFile
                    ? "text-secondary font-medium"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {selectedFile ? selectedFile.name : "No file chosen"}
              </span>

              {selectedFile && (
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(0)} KB
                </span>
              )}
            </div>

            {fileError && (
              <p className="text-sm text-red-500" role="alert">
                {fileError}
              </p>
            )}
          </div>

          {/* Optional metadata */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="policy-name">Policy name</Label>
              <Input
                id="policy-name"
                placeholder="e.g. AIA Smart Health"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                disabled={isUploading}
              />
            </div>

            <SelectField
              name="policy-type"
              label="Policy type"
              placeholder="Auto-detect"
              options={POLICY_TYPE_OPTIONS}
              value={policyType}
              onValueChange={setPolicyType}
            />

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="e.g. AIA Insurance"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Status messages */}
          {uploadState.status === "success" && (
            <div
              role="status"
              className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700"
            >
              {uploadState.message}
            </div>
          )}

          {uploadState.status === "error" && (
            <div
              role="alert"
              className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
            >
              {uploadState.message}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  {/* Inline spinner — avoids importing Spinner atom in a form */}
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Uploading…
                </span>
              ) : (
                "Upload document"
              )}
            </Button>

            {isUploading && (
              <p className="text-sm text-muted-foreground">
                This may take up to a minute while metadata is extracted.
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
