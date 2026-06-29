import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    typescript: {
        // Esto ignorará los errores de TypeScript durante el deploy en Vercel
        ignoreBuildErrors: true,
    },
};

export default nextConfig;