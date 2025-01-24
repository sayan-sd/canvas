import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollRestoration = () => {
    const location = useLocation();

    useEffect(() => {
        // Restore scroll position when returning to the home page
        const savedPosition = sessionStorage.getItem("scrollPosition");
        if (location.pathname === "/" && savedPosition) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedPosition, 10));
            }, 300); // Small delay to ensure content loads first
        }

        // Save scroll position before navigating away
        const handleScroll = () => {
            sessionStorage.setItem("scrollPosition", window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    return null;
};

export default ScrollRestoration;
