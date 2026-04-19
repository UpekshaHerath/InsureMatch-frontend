"use client";

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { RiderIngestResponse } from "@/lib/types/api";

const ACCEPTED_EXTENSIONS = ".pdf,.docx,.txt";
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

interface UploadState {
  status: "idle" | "uploading" | "success" | "error";
  message: string;
  extracted?: number;
}

export default function RiderUploadForm() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [state, setState] = useState<UploadState>({ status: "idle", message: "" });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFileError("");
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      setFileError("Only PDF, DOCX, and TXT files are accepted.");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setSelectedFile(file);
    setState({ status: "idle", message: "" });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFile) {
      setFileError("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    setState({ status: "uploading", message: "" });

    try {
      const { data } = await apiClient.post<RiderIngestResponse>(
        ENDPOINTS.RIDERS,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 180_000,
        }
      );
      setState({
        status: "success",
        message: `Indexed ${data.riders_extracted} rider${data.riders_extracted === 1 ? "" : "s"} (${data.chunks_indexed} chunks). Previous rider catalog was replaced.`,
        extracted: data.riders_extracted,
      });
      await queryClient.invalidateQueries({ queryKey: ["riders"] });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
      setState({ status: "error", message });
    }
  }

  const isUploading = state.status === "uploading";

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-secondary">
          Upload Riders Catalog
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload a single document listing all riders and the policies each
          rider can attach to. The AI extracts every rider and maps it to
          existing policies. Re-uploading replaces the previous catalog.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="rider-file">
              Riders document <span className="text-red-500 ml-1">*</span>
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
              <input
                ref={fileInputRef}
                id="rider-file"
                type="file"
                accept={ACCEPTED_EXTENSIONS}
                onChange={handleFileChange}
                disabled={isUploading}
                className="sr-only"
              />
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

          {state.status === "success" && (
            <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {state.message}
            </div>
          )}
          {state.status === "error" && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {state.message}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {isUploading ? "Extracting riders…" : "Upload riders document"}
            </Button>
            {isUploading && (
              <p className="text-sm text-muted-foreground">
                LLM extraction can take 1–2 minutes for a large catalog.
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
