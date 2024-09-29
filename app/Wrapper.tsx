// app/components/Wrapper.tsx
"use client"; // Ensure this is marked as a client component

import { usePathname } from 'next/navigation';
import Header from './components/Header';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const pathname = usePathname();

    // Define the paths where the header should be hidden
    const hideHeaderRoutes = ['/community/[slug]', '/community/[slug]/[level]'];

    // Check if the current path matches any of the hideHeaderRoutes
    const shouldHideHeader = hideHeaderRoutes.some(route =>
        pathname.match(new RegExp(route.replace(/\[.*?\]/, '.*')))
    );

    return (
        <div>
            {!shouldHideHeader && <Header />}
            {children}
        </div>
    );
};

export default Wrapper;
