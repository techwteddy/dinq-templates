/**
 * Type definitions for the Server Environment Health Dashboard.
 */

/**
 * Represents the status of a health check.
 */
export type HealthStatus = 'healthy' | 'degraded' | 'down' | 'unknown';

/**
 * Configuration for a target environment to monitor.
 */
export interface EnvironmentConfig {
  /** Environment name (e.g., 'DEV', 'SIT', 'PROD') */
  name: string;
  /** URL endpoint to health check */
  url: string;
}

/**
 * Result of a single health check for an environment.
 */
export interface HealthCheckResult {
  /** Environment name */
  envName: string;
  /** URL that was checked */
  url: string;
  /** Health status: healthy, degraded, down, or unknown */
  status: HealthStatus;
  /** Latency in milliseconds */
  latencyMs: number;
  /** Timestamp of the check (ISO 8601 format) */
  timestamp: string;
  /** Error message if the check failed */
  error?: string;
}

/**
 * Represents a log entry from the Supabase health_logs table.
 */
export interface HealthLog {
  /** Unique identifier (UUID) */
  id: string;
  /** Environment name */
  env_name: string;
  /** URL endpoint */
  url: string;
  /** Health status */
  status: HealthStatus;
  /** Latency in milliseconds */
  latency_ms: number;
  /** Creation timestamp */
  created_at: string;
}

/**
 * Response from the /api/health-check endpoint.
 */
export interface HealthCheckApiResponse {
  /** Array of health check results for each environment */
  results: HealthCheckResult[];
  /** Whether the check completed successfully */
  success: boolean;
  /** Error message if the check failed */
  error?: string;
}
