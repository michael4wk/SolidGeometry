export default async function onRequest(context) {
  const url = new URL(context.request.url);
  const p = url.pathname;
  const staticPrefixes = [
    "/assets/",
    "/favicon.svg",
  ];
  for (const prefix of staticPrefixes) {
    if (p.startsWith(prefix)) {
      return fetch(context.request);
    }
  }
  const staticExts = [
    ".js",
    ".css",
    ".png",
    ".jpg",
    ".jpeg",
    ".svg",
    ".ico",
    ".json",
    ".webp",
    ".map",
    ".txt",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".glb"
  ];
  for (const ext of staticExts) {
    if (p.endsWith(ext)) {
      return fetch(context.request);
    }
  }
  const indexUrl = new URL("/index.html", url.origin);
  return fetch(indexUrl);
}
