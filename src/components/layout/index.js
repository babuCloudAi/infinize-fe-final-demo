'use client';
import {useState, useEffect} from 'react';
import {Box, CssBaseline} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import {theme} from '@/config';
import {LicenseInfo} from '@mui/x-license';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SideBar from '@/components/sideBar';
import InfinizeLogo from '../common/infinizeLogo';

LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_PRO_KEY);

export default function Layout({children}) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set loading to true initially when the component mounts (client-side)
        setIsLoading(true);

        // Simulate a delay ( to show a loading spinner)
        const timer = setTimeout(() => {
            setIsLoading(false); // Turn off loading after 1 second
        }, 1000);

        // Cleanup the timer when the component unmounts or effect re-runs
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {isLoading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100vh"
                >
                    <InfinizeLogo />
                </Box>
            ) : (
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <div className="layout-container">
                        <Header />
                        <Box sx={{display: 'flex'}}>
                            <SideBar />
                            {children}
                        </Box>
                        <Footer />
                    </div>
                </ThemeProvider>
            )}
        </>
    );
}
