import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return new NextResponse("Missing url parameter", { status: 400 });
    }

    const rangeHeader = request.headers.get("range");
    const headers: Record<string, string> = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.instagram.com/",
    };

    if (rangeHeader) {
        headers["Range"] = rangeHeader;
    }

    try {
        const mediaResponse = await fetch(url, { headers });

        if (!mediaResponse.ok && mediaResponse.status !== 206) {
            return new NextResponse("Resource Expired or Unavailable", { status: mediaResponse.status });
        }

        // Get the response Content-Type header
        let contentType = mediaResponse.headers.get("Content-Type") || "";

        // 🔍 Safe Fallback & Normalization Routine for Mobile Video Containers
        if (
            !contentType ||
            contentType === "application/octet-stream" ||
            contentType === "application/x-mpegurl"
        ) {
            // Check if the URL string hints at a specific container format
            const lowerUrl = url.toLowerCase();
            if (lowerUrl.includes(".mov") || lowerUrl.includes("qt=")) {
                contentType = "video/quicktime"; // Safe mapping for raw Apple QuickTime uploads
            } else if (lowerUrl.includes(".webm")) {
                contentType = "video/webm";
            } else if (lowerUrl.includes(".ogv") || lowerUrl.includes(".ogg")) {
                contentType = "video/ogg";
            } else {
                contentType = "video/mp4"; // Default fallback standard
            }
        }

        const responseHeaders = new Headers({
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
            "Access-Control-Allow-Origin": "*",
        });

        const contentRange = mediaResponse.headers.get("Content-Range");
        const contentLength = mediaResponse.headers.get("Content-Length");

        if (contentRange) responseHeaders.set("Content-Range", contentRange);
        if (contentLength) responseHeaders.set("Content-Length", contentLength);

        return new NextResponse(mediaResponse.body, {
            status: mediaResponse.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error("Proxy stream fatal error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}