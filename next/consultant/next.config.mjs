/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://asset-tidycal.b-cdn.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://asset-tidycal.b-cdn.net; img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com https://asset-tidycal.b-cdn.net https://i.ytimg.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://tidycal.com; frame-src 'self' https://tidycal.com https://www.youtube-nocookie.com; frame-ancestors 'self'; upgrade-insecure-requests;",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

export default nextConfig;

class VeliteWebpackPlugin {
  static started = false;
  apply(compiler) {
    compiler.hooks.beforeCompile.tapPromise("VeliteWebpackPlugin", async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = compiler.options.mode === "development";
      const { build } = await import("velite");
      await build({ watch: dev, clean: !dev });
    });
  }
}
