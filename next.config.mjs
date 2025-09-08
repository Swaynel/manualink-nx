// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com"],
  },
  // Fix for Leaflet marker icons
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg)$/,
      type: "asset/resource", // replaces url-loader in Webpack 5
    });
    return config;
  },
};

export default nextConfig;
