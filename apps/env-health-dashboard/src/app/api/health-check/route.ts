import { NextRequest, NextResponse } from 'next/server';
import { parseTargetEnvironments, determineStatus } from '@/utils';
import { logHealthCheckResults } from '@/lib/supabase';
import { HealthCheckResult, HealthCheckApiResponse } from '@/types';

/**
 * GET handler for /api/health-check
 *
 * This API route:
 * 1. Reads TARGET_ENVIRONMENTS from .env
 * 2. Pings each configured URL and measures latency
 * 3. Determines status (healthy/degraded/down)
 * 4. Logs results to Supabase asynchronously
 * 5. Returns results to the client
 */
export async function GET(request: NextRequest) {
  try {
    const targetEnvString = process.env.TARGET_ENVIRONMENTS;
    if (!targetEnvString) {
      return NextResponse.json(
        {
          success: false,
          results: [],
          error: 'TARGET_ENVIRONMENTS is not configured in environment variables.',
        } as HealthCheckApiResponse,
        { status: 500 }
      );
    }

    // Parse environments
    let environments;
    try {
      environments = parseTargetEnvironments(targetEnvString);
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          results: [],
          error: err instanceof Error ? err.message : 'Failed to parse environments.',
        } as HealthCheckApiResponse,
        { status: 400 }
      );
    }

    // Perform health checks in parallel
    const healthCheckPromises = environments.map(async (env): Promise<HealthCheckResult> => {
      const startTime = Date.now();
      let statusCode: number | null = null;
      let error: string | undefined;

      try {
        // Use fetch with a timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(env.url, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'User-Agent': 'ServerHealthDashboard/1.0',
          },
          // Disable caching to get fresh results
          cache: 'no-store',
        });

        clearTimeout(timeoutId);
        statusCode = response.status;
      } catch (err) {
        error = err instanceof Error ? err.message : 'Unknown error occurred';
      }

      const latencyMs = Date.now() - startTime;
      const status = determineStatus(statusCode, latencyMs);

      return {
        envName: env.name,
        url: env.url,
        status,
        latencyMs,
        timestamp: new Date().toISOString(),
        error,
      };
    });

    const results = await Promise.all(healthCheckPromises);

    // Log to Supabase asynchronously (don't await - fire and forget)
    logHealthCheckResults(results).catch((err) => {
      console.error('Background logging failed:', err);
    });

    // Return results
    return NextResponse.json({
      success: true,
      results,
    } as HealthCheckApiResponse);
  } catch (err) {
    console.error('Health check API error:', err);
    return NextResponse.json(
      {
        success: false,
        results: [],
        error: 'Internal server error during health check.',
      } as HealthCheckApiResponse,
      { status: 500 }
    );
  }
}
