// Simple in-memory cache for curriculum documents
const curriculumCache = new Map<string, { data: string; timestamp: number }>();

// Cache timeout - 1 hour in milliseconds
const CACHE_TIMEOUT = 60 * 60 * 1000;

export async function getCachedCurriculum(orgId: string, fetchFunction: () => Promise<string>): Promise<string> {
  // Check if we have cached data that's still valid
  const cached = curriculumCache.get(orgId);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < CACHE_TIMEOUT) {
    console.log(`Returning cached curriculum for org ${orgId}`);
    return cached.data;
  }
  
  // If no valid cache, fetch fresh data
  console.log(`Fetching fresh curriculum for org ${orgId}`);
  const freshData = await fetchFunction();
  
  // Cache the fresh data
  curriculumCache.set(orgId, {
    data: freshData,
    timestamp: now
  });
  
  return freshData;
}

export function clearCurriculumCache(orgId: string) {
  curriculumCache.delete(orgId);
}

export function clearAllCurriculumCache() {
  curriculumCache.clear();
}