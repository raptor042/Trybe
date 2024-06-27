/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'moccasin-petite-piranha-265.mypinata.cloud',
            port: '',
            pathname: '/ipfs/**',
          },
        ],
    },
};

export default nextConfig;
