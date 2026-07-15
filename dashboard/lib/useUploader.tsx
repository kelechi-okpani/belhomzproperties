"use client";

import { useState, useCallback } from "react";
import axios, { AxiosError, AxiosProgressEvent } from "axios";

interface UploaderOptions {
  onCompleted?: (res: CloudinaryUploadResponse) => void;
  onError?: (error: string) => void;
  cloudName: string;      // Your Cloudinary Cloud Name
  uploadPreset: string;   // Your configured Unsigned Upload Preset
}

// Full response structure returned directly from Cloudinary's Upload API
interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string; // This is the HTTPS URL you want to save
  folder: string;
  access_mode: string;
  [key: string]: any;
}

const useUploader = (options: UploaderOptions) => {
  const [uploadPercentage, setUploadPercentage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = useCallback(() => {
    setError(null);
    setUploadPercentage(0);
    setLoading(false);
  }, []);

  const upload = async (file: File) => {
    if (!file) return null;

    handleReset();
    setLoading(true);

    const { cloudName, uploadPreset } = options;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    // Determine resource type automatically (image, video, raw)
    const resourceType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
            ? "video"
            : "raw";

    try {
      const response = await axios.post<CloudinaryUploadResponse>(
          `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadPercentage(percentCompleted);
              }
            },
          }
      );

      const result = response.data;

      if (result && result.secure_url) {
        options.onCompleted?.(result);
        setTimeout(() => setUploadPercentage(0), 1000);
        return result;
      } else {
        throw new Error("Invalid Cloudinary response layout");
      }

    } catch (err: any) {
      let errorMessage = "Critical upload failure";

      if (axios.isAxiosError(err)) {
        // If Cloudinary returns an error, it is nested inside response.data.error
        const rawResponse = err.response?.data;
        if (rawResponse && typeof rawResponse === "object" && "error" in rawResponse) {
          errorMessage = rawResponse.error.message || err.message;
        } else if (typeof rawResponse === "string") {
          errorMessage = rawResponse.slice(0, 100);
        } else {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      options.onError?.(errorMessage);
      console.error("[CLOUDINARY_UPLOADER_ERROR]:", errorMessage);
      return null;

    } finally {
      setLoading(false);
    }
  };

  return { upload, uploadPercentage, loading, error, handleReset };
};

export default useUploader;