export function buildUrl(
  endpoint: string,
  params: Record<string, string | number>
) {
  let url = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, String(value));
  });
  return url;
}
