'use client';
import {createContext, useContext, useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';

const RouteContext = createContext();

export function RouteProvider({children}) {
    const pathname = usePathname();

    const [prevRoute, setPrevRoute] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('prevRoute') || '';
        }
        return '';
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            sessionStorage.setItem('prevRoute', pathname);
            setPrevRoute(pathname);
        }, 50);

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <RouteContext.Provider value={{prevRoute}}>
            {children}
        </RouteContext.Provider>
    );
}

export function useRoute() {
    return useContext(RouteContext);
}
