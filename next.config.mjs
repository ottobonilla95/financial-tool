/** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:lang",
        destination: "/:lang/landing-page",
        permanent: false, // Set to true if this is a permanent redirect (301), false for temporary (307)
      },
    ];
  },
};
export default nextConfig;
