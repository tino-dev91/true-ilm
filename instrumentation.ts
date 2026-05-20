export async function register() {
  // Node < 19.9 lacks URL.canParse, which Next's metadata resolver relies on.
  // Vercel runs Node 24 (fine); this keeps local dev on older Node working.
  const U = URL as unknown as { canParse?: (url: string, base?: string) => boolean };
  if (typeof U.canParse !== "function") {
    U.canParse = (url: string, base?: string) => {
      try {
        // eslint-disable-next-line no-new
        new URL(url, base);
        return true;
      } catch {
        return false;
      }
    };
  }
}
