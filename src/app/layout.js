'use client';
import {useState, useEffect} from 'react';
import Layout from '@/components/layout/index.js';
import './globals.css';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';
import {RouteProvider} from '@/context/route';

export default function RootLayout({children}) {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hasLoaded = sessionStorage.getItem('hasLoaded');
            if (!hasLoaded) {
                const timer = setTimeout(() => {
                    sessionStorage.setItem('hasLoaded', 'true');
                }, 1000);

                return () => clearTimeout(timer);
            }
        }
    }, []);
    return (
        <html lang="en">
            <body>
                <RouteProvider>
                    <AppRouterCacheProvider>
                        <Layout>{children}</Layout>
                    </AppRouterCacheProvider>
                </RouteProvider>
            </body>
        </html>
    );
}
