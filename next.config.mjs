/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    remotePatterns: [
      {
        hostname: "cdn.ticketswap.com",
      },
      {
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
