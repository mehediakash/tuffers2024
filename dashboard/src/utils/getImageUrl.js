/**
 * Resolves an image path or URL into an absolute URL.
 * Supports:
 * 1. Cloudinary URLs (https://res.cloudinary.com/...)
 * 2. Absolute URLs (http:// or https://)
 * 3. Legacy relative paths (/uploads/...) with server URL fallback
 *
 * @param {string} image - Image path or URL
 * @param {string} [serverBaseUrl] - Optional base URL for server
 * @returns {string} - Absolute image URL
 */
export const getImageUrl = (image, serverBaseUrl) => {
  if (!image || typeof image !== "string") return "";

  // If already an absolute URL (Cloudinary or full URL)
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Base URL fallback
  const base =
    serverBaseUrl ||
    (typeof window !== "undefined" && window.__SERVER_URL__) ||
    "https://server.tuffersbd.com";

  const cleanBase = base.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "");
  const cleanPath = image.startsWith("/") ? image : `/${image}`;

  return `${cleanBase}${cleanPath}`;
};

export default getImageUrl;
