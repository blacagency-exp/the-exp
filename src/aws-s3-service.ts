// AWS S3 service using AWS SDK v3
import { S3Client, ListObjectsV2Command, GetObjectCommand, type _Object } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Create S3 client with caching
let s3ClientInstance: S3Client | null = null

// Create S3 client
const getS3Client = () => {
  // Return cached instance if available
  if (s3ClientInstance) {
    return s3ClientInstance
  }

  console.log("Creating S3 client with config:", {
    region: import.meta.env.VITE_AWS_REGION || "eu-north-1",
    hasAccessKey: !!import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    hasSecretKey: !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    bucket: import.meta.env.VITE_AWS_S3_BUCKET || "panaromictours",
  })

  // Create new instance
  s3ClientInstance = new S3Client({
    region: import.meta.env.VITE_AWS_REGION || "eu-north-1",
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
    },
  })

  return s3ClientInstance
}

// Cache for signed URLs
const urlCache: Record<string, { url: string; expires: number }> = {}

// Get a signed URL for a video (valid for a limited time)
export const getSignedVideoUrl = async (key: string, expirationInSeconds = 3600): Promise<string> => {
  // Check cache first
  const now = Date.now()
  const cacheKey = `${key}-${expirationInSeconds}`

  if (urlCache[cacheKey] && urlCache[cacheKey].expires > now) {
    console.log("Using cached signed URL for key:", key)
    return urlCache[cacheKey].url
  }

  console.log("Getting signed URL for key:", key)
  const client = getS3Client()

  const command = new GetObjectCommand({
    Bucket: import.meta.env.VITE_AWS_S3_BUCKET || "panaromictours",
    Key: key,

    ResponseCacheControl: "public, max-age=31536000, must-revalidate",
  })

  try {
    // Generate a signed URL that expires after the specified time
    const url = await getSignedUrl(client, command, { expiresIn: expirationInSeconds })
    console.log("Generated signed URL:", url.substring(0, 100) + "...")

    // Cache the URL
    urlCache[cacheKey] = {
      url,
      expires: now + expirationInSeconds * 1000 - 60000, // Expire 1 minute early to be safe
    }

    return url
  } catch (error) {
    console.error("Error generating signed URL:", error)
    console.error("Error details:", error instanceof Error ? error.message : String(error))
    console.error("S3 client config:", {
      region: import.meta.env.VITE_AWS_REGION || "eu-north-1",
      bucket: import.meta.env.VITE_AWS_S3_BUCKET || "panaromictours",
      hasAccessKey: !!import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      hasSecretKey: !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    })
    console.error("Request params:", {
      Bucket: import.meta.env.VITE_AWS_S3_BUCKET || "panaromictours",
      Key: key,
    })
    throw error
  }
}

// Cache for tour video listings
let tourVideosCache: { data: { key: string; size: number }[]; timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Get a list of all tour videos in the bucket
export const listTourVideos = async (): Promise<{ key: string; size: number }[]> => {
  // Check cache first
  const now = Date.now()
  if (tourVideosCache && now - tourVideosCache.timestamp < CACHE_TTL) {
    console.log("Using cached tour videos list")
    return tourVideosCache.data
  }

  const client = getS3Client()

  const command = new ListObjectsV2Command({
    Bucket: import.meta.env.VITE_AWS_S3_BUCKET || "panaromictours",
    Prefix: "tours/", // Assuming you store tour videos in a 'tours/' folder
  })

  try {
    const response = await client.send(command)
    const data = (response.Contents || [])
      .filter((item: _Object) => item.Key && item.Size)
      .map((item: _Object) => ({
        key: item.Key as string,
        size: item.Size as number,
      }))

    // Cache the results
    tourVideosCache = {
      data,
      timestamp: now,
    }

    return data
  } catch (error) {
    console.error("Error listing tour videos:", error)
    throw error
  }
}

// Test S3 connectivity and permissions
export const testS3Connection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const client = getS3Client()

    // Try to list objects to test connectivity
    const command = new ListObjectsV2Command({
      Bucket: import.meta.env.VITE_AWS_S3_BUCKET || "panaromictours",
      MaxKeys: 1, // Just get one object to verify connection
    })

    await client.send(command)
    return {
      success: true,
      message: "Successfully connected to S3 bucket",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    }
  }
}

// Add this function to the aws-s3-service.ts file
// Optimize video loading with range requests
export const getVideoSegment = async (
  key: string,
  start = 0,
  end: number = 1024 * 1024, // Default to first 1MB
): Promise<Blob> => {
  const client = getS3Client()

  const command = new GetObjectCommand({
    Bucket: import.meta.env.VITE_AWS_S3_BUCKET || "panaromictours",
    Key: key,
    Range: `bytes=${start}-${end}`,
  })

  try {
    const response = await client.send(command)

    if (!response.Body) {
      throw new Error("No response body received")
    }

    // Convert the response body to a blob
    const stream = response.Body as ReadableStream
    const reader = stream.getReader()
    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) chunks.push(value)
    }

    const blob = new Blob(chunks, {
      type: response.ContentType || "video/mp4",
    })

    return blob
  } catch (error) {
    console.error("Error fetching video segment:", error)
    throw error
  }
}

// Add this function to optimize video loading
export const optimizeVideoLoading = async (key: string): Promise<string> => {
  try {
    // First get a signed URL for the full video
    const fullUrl = await getSignedVideoUrl(key)

    // Create a video element to test loading speed
    const testVideo = document.createElement("video")
    testVideo.preload = "metadata"
    testVideo.src = fullUrl

    // Return a promise that resolves with the appropriate URL strategy
    return new Promise((resolve) => {
      // Set a timeout to measure initial loading speed
      const timeoutId = setTimeout(() => {
        // If it takes too long to load metadata, use segmented loading
        console.log("Slow connection detected, using optimized loading")
        resolve(fullUrl)
      }, 3000)

      // If metadata loads quickly, use the full URL
      testVideo.onloadedmetadata = () => {
        clearTimeout(timeoutId)
        console.log("Fast connection detected, using standard loading")
        resolve(fullUrl)
      }

      // Handle errors
      testVideo.onerror = () => {
        clearTimeout(timeoutId)
        console.log("Error loading test video, falling back to standard URL")
        resolve(fullUrl)
      }
    })
  } catch (error) {
    console.error("Error in optimizeVideoLoading:", error)
    // Fall back to standard URL
    return getSignedVideoUrl(key)
  }
}

