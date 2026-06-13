import { EnvironmentConfig } from '@/types';

/**
 * Parses the TARGET_ENVIRONMENTS environment variable string into an array of EnvironmentConfig objects.
 *
 * Expected format: "ENV_NAME|URL,ENV_NAME|URL,..."
 * Example: "DEV|https://dev.api.example.com/health,PROD|https://api.example.com/health"
 *
 * @param envString - The raw string from process.env.TARGET_ENVIRONMENTS
 * @returns Array of EnvironmentConfig objects with name and url properties
 * @throws Error if the environment string is empty or improperly formatted
 */
export function parseTargetEnvironments(envString: string): EnvironmentConfig[] {
  if (!envString || envString.trim().length === 0) {
    throw new Error('TARGET_ENVIRONMENTS is not configured or empty.');
  }

  const entries = envString
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  if (entries.length === 0) {
    throw new Error('No valid environment entries found in TARGET_ENVIRONMENTS.');
  }

  const configs: EnvironmentConfig[] = entries.map((entry) => {
    const parts = entry.split('|');
    if (parts.length !== 2 || parts[0].trim().length === 0 || parts[1].trim().length === 0) {
      throw new Error(
        `Invalid environment entry format: "${entry}". Expected format: ENV_NAME|URL`
      );
    }
    return {
      name: parts[0].trim(),
      url: parts[1].trim(),
    };
  });

  return configs;
}

/**
 * Determines the health status based on HTTP status code and latency.
 *
 * @param statusCode - HTTP response status code (e.g., 200, 404, 500)
 * @param latencyMs - Response time in milliseconds
 * @returns HealthStatus: 'healthy' (200 OK), 'degraded' (>2s latency), or 'down' (error/non-2xx)
 */
export function determineStatus(
  statusCode: number | null,
  latencyMs: number
): 'healthy' | 'degraded' | 'down' {
  // If no status code or non-2xx, it's down
  if (statusCode === null || statusCode < 200 || statusCode >= 300) {
    return 'down';
  }

  // 200 OK but high latency (>2000ms) is degraded
  if (latencyMs > 2000) {
    return 'degraded';
  }

  return 'healthy';
}
