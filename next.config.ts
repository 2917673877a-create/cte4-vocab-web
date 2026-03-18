import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    const { NormalModuleReplacementPlugin } = require("webpack");

    config.plugins.push(
      new NormalModuleReplacementPlugin(
        /\.\.\/utils\/encrypt$/,
        path.resolve(__dirname, "lib/empty-module.js"),
      ),
    );

    return config;
  },
};

export default nextConfig;
