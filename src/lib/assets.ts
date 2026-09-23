/**
 * Asset URL helper providing an abstraction layer for static assets vs future Object Storage (R2/S3/CDN).
 */
export function getAssetUrl(path: string | undefined): string {
  if (!path) return '/assets/placeholder.svg';
  
  // If already absolute or data URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // Future Object Storage hook:
  // e.g., if process.env.CDN_BASE_URL is defined:
  const cdnBase = import.meta.env.PUBLIC_CDN_BASE_URL || '';
  if (cdnBase) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cdnBase.replace(/\/$/, '')}${cleanPath}`;
  }

  // Default local static asset
  return path.startsWith('/') ? path : `/${path}`;
}

export function getContentRoute(type: string, id: string): string {
  switch (type) {
    case 'skill':
      return `/skills/${id}`;
    case 'tutorial':
      return `/tutorials/${id}`;
    case 'presentation':
      return `/presentations/${id}`;
    case 'project':
      return `/projects/${id}`;
    case 'note':
      return `/notes/${id}`;
    default:
      return `/${type}/${id}`;
  }
}
