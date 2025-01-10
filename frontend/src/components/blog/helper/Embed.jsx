import React, { useEffect, useRef, useState } from "react";

const Embed = ({ url, caption, wt }) => {
    const iframeRef = useRef(null);
    const [height, setHeight] = useState("400px");

    useEffect(() => {
        const handleResize = () => {
            if (iframeRef.current) {
                try {
                    const ratio = 16 / 9; // Default aspect ratio
                    const width = iframeRef.current.offsetWidth;
                    const calculatedHeight = width / ratio;
                    setHeight(`${calculatedHeight}px`);
                } catch (error) {
                    console.error("Error adjusting iframe height:", error);
                }
            }
        };

        // Initial size calculation
        handleResize();

        // Add event listener for window resize
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [url]); // Re-run when URL changes

    return (
        <div className="w-full">
            <iframe
                ref={iframeRef}
                src={url}
                className="mx-auto w-[96%]"
                style={{ height }}
                frameBorder="0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
            {caption.length ? (
                <p className="w-[96%] text-center my-3 md:mb-12 text-base text-dark-grey">
                    {caption}
                </p>
            ) : (
                ""
            )}
        </div>
    );
};

export default Embed;
