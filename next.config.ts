import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gkpotoixqcjijozesfee.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  webpack: (config, { dev }) => {
    // Ignore critical dependency warnings from Supabase realtime
    config.ignoreWarnings = [
      {
        module: /node_modules\/@supabase\/realtime-js/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ];

    // Optimize webpack cache for production builds
    if (!dev) {
      config.cache = {
        type: 'filesystem',
        maxMemoryGenerations: 0,
      };
    }

    return config;
  },

  turbopack: {
    // Example: adding an alias and custom file extension
    resolveAlias: {
      underscore: 'lodash',
    },
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },

  experimental: {
    // Reduce memory usage during build
    webpackBuildWorker: true,
  },
};

export default nextConfig;
