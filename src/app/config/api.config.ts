// Centralized API base URLs for switching between local and deployed backends

const inferBase = (): { v1: string; v0: string } => {
  // Allow override at build-time or runtime
  const buildEnv = (typeof process !== 'undefined' && (process as any).env && (process as any).env.NG_APP_API_BASE_URL) || '';
  const runtime = (typeof window !== 'undefined' && (window as any).__API_BASE_URL__) || '';
  const selected = (runtime || buildEnv).replace(/\/$/, '');

  if (selected) {
    return {
      v1: `${selected}/api/v1/`,
      v0: `${selected}/api`
    };
  }

  // Heuristic: if running on vercel or any non-local host, use cloud backend
  const isLocal = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)/.test(window.location.hostname);
  const cloudBase = 'https://bootcamp-backend-oq0i.onrender.com';
  const localBase = 'http://localhost:8081';
  const base = isLocal ? localBase : cloudBase;
  return {
    v1: `${base}/api/v1/`,
    v0: `${base}/api`
  };
};

const inferred = inferBase();

export const API_BASE_V1 = inferred.v1; // e.g. .../api/v1/
export const API_BASE = inferred.v0;    // e.g. .../api


