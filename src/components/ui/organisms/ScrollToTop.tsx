"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// when pathname change, scroll to the top of the page
const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
    // get the current pathname
    const pathname = usePathname();

    // use useRef to store value of current pathname. Don't use normal const to store pathname, because after a re-rendering, const value will be reassigned to new value, thus can't keep the original value to compare to pathname
    const pathnameRef = useRef(pathname);

    useEffect(() => {
        if (pathnameRef.current !== pathname) {
            window.scrollTo(0, 0);
            pathnameRef.current = pathname;
        }
    }, [pathname]);

    return <>{children}</>;
};

export { ScrollToTop };
