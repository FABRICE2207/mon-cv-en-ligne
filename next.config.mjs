// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//     domains: ['localhost'],
//   },
// }

// export default nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { 
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_API_URL // Backend spécifique
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS' // Méthodes autorisées
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization' // En-têtes autorisés
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true' // Important si vous utilisez des cookies
          }
        ],
      },
    ];
  },

  // 🌐 Origines autorisées en développement
  allowedDevOrigins: [
    process.env.NEXT_PUBLIC_API_URL, // Backend
    'http://192.168.1.3:3000', // Frontend
  ],

  // ⚙️ Configuration de développement
  eslint: {
    ignoreDuringBuilds: true, // Désactive ESLint pendant le build
  },
  typescript: {
    ignoreBuildErrors: true, // À n'utiliser qu'en développement
  },

  // 🖼 Configuration des images
  images: {
    unoptimized: true, // Désactive l'optimisation pour le dev
    domains: [
      'localhost',
      '127.0.0.1',
      '192.168.1.3',
      // Ajoutez ici d'autres domaines si nécessaire
    ],
  },

  // 🔄 Rewrites pour le proxy API (optionnel mais recommandé)
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'http://192.168.1.3:5000/:path*', // Proxy vers votre backend
      },
    ];
  }
};

export default nextConfig;
