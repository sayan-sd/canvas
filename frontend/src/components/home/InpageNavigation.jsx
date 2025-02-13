import React, { useEffect, useRef, useState } from "react";

export let activeTabLineRef;
export let activeTabRef;

const InpageNavigation = ({
    routes,
    icons = [],
    defaultHidden = [],
    defaultActiveIndex = 0,
    children,
}) => {
    const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);
    const [width, setWidth] = useState(window.innerWidth);
    const [isResizeEventAdded, setIsResizeEventAdded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    let lastScrollY = window.scrollY;

    activeTabLineRef = useRef();
    activeTabRef = useRef();
    const navRef = useRef();

    // button navigation - <hr/>
    const changePageState = (btn, i) => {
        let { offsetWidth, offsetLeft } = btn;
        activeTabLineRef.current.style.width = offsetWidth + "px";
        activeTabLineRef.current.style.left = offsetLeft + "px";
        setInPageNavIndex(i);
    };

    // Handle scroll behavior
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY = window.scrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // render active button first time
    useEffect(() => {
        if (width > 767 && setInPageNavIndex != defaultActiveIndex) {
            changePageState(activeTabRef.current, defaultActiveIndex);
        }

        if (!isResizeEventAdded) {
            window.addEventListener("resize", () => {
                if (!isResizeEventAdded) {
                    setIsResizeEventAdded(true);
                }
                setWidth(window.innerWidth);
            });
        }
        activeTabRef.current?.click();
    }, [width]);

    return (
        <>
            {width > 767 ? (
                <div
                    className={`relative mb-8 bg-white border-b border-grey flex-nowrap overflow-x-auto ${
                        defaultHidden.length > 0 ? "hidden" : "flex"
                    }`}
                >
                    {routes.map((route, i) => (
                        <button
                            ref={i == defaultActiveIndex ? activeTabRef : null}
                            key={i}
                            className={`p-4 px-5 capitalize ${
                                defaultHidden.includes(route) ? "md:hidden" : ""
                            }`}
                            onClick={(e) => changePageState(e.target, i)}
                        >
                            {route}
                        </button>
                    ))}
                    <hr
                        ref={activeTabLineRef}
                        className="absolute bottom-0 duration-300 border-dark-grey"
                    />
                </div>
            ) : (
                <div
                    ref={navRef}
                    className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-grey shadow-lg flex justify-around border border-grey rounded-full z-30 transition-all duration-300 ${
                        isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    {routes.map((route, i) => (
                        <button
                            ref={i == defaultActiveIndex ? activeTabRef : null}
                            key={i}
                            className={`flex flex-col items-center justify-center capitalize px-4 py-3 ${
                                i == 0 ? "rounded-l-full pl-6" : "rounded-r-full pr-6"
                            } transition-all duration-300 w-1/2 ${
                                inPageNavIndex == i
                                    ? "bg-yellow text-[#555]"
                                    : "text-dark-grey/50"
                            }`}
                            onClick={(e) => changePageState(e.target, i)}
                        >
                            <i className={`fi ${icons[i]} font-bold text-xl flex`}></i>
                            <span className="text-[0.75rem] mt-1 font-medium">
                                {route.split(" ")[0]}
                            </span>
                        </button>
                    ))}

                    <hr
                        ref={activeTabLineRef}
                        className="absolute bottom-0 duration-300 border-transparent"
                    />
                </div>
            )}
            {Array.isArray(children) ? children[inPageNavIndex] : children}
        </>
    );
};

export default InpageNavigation;
