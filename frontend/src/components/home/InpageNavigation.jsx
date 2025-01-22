import React, { useEffect, useRef, useState } from "react";

export let activeTabLineRef;
export let activeTabRef;

const InpageNavigation = ({
    routes,
    defaultHidden = [],
    defaultActiveIndex = 0,
    children
}) => {
    const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);
    const [width, setWidth] = useState(window.innerWidth);
    const [isResizeEventAdded, setIsResizeEventAdded] = useState(false);

    activeTabLineRef = useRef();
    activeTabRef = useRef();

    // button navigation - <hr/>
    const changePageState = (btn, i) => {
        let { offsetWidth, offsetLeft } = btn;

        activeTabLineRef.current.style.width = offsetWidth + "px";
        activeTabLineRef.current.style.left = offsetLeft + "px";

        setInPageNavIndex(i);
    };

    // render active button first time
    useEffect(() => {
        if (width > 767 && setInPageNavIndex != defaultActiveIndex) {
            changePageState(activeTabRef.current, defaultActiveIndex);
        }

        // Resize event listener
        if (!isResizeEventAdded) {
            window.addEventListener("resize", () => {
                if (!isResizeEventAdded) {
                    setIsResizeEventAdded(true);
                }
                setWidth(window.innerWidth);
            })
        }
    }, [width]);

    return (
        <>
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                {/* Nav buttons */}
                {routes.map((route, i) => {
                    return (
                        <button
                            ref={i == defaultActiveIndex ? activeTabRef : null}
                            key={i}
                            className={`p-4 px-5 capitalize ${
                                inPageNavIndex == i
                                    ? "text-black "
                                    : "text-dark-grey "
                            } ${
                                defaultHidden.includes(route) ? "md:hidden" : ""
                            }`}
                            onClick={(e) => {
                                changePageState(e.target, i);
                            }}
                        >
                            {route}
                        </button>
                    );
                })}

                {/* Active tab line */}
                <hr
                    ref={activeTabLineRef}
                    className="absolute bottom-0 duration-300 border-dark-grey"
                />
            </div>

            {Array.isArray(children) ? children[inPageNavIndex] : children}
        </>
    );
};

export default InpageNavigation;
