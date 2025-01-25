import React from "react";
import PageAnimationWrapper from "../../common/PageAnimation";

const BlogDisplayPageSkeleton = () => {
    return (
        <div className="max-w-[900px] center py-10 max-lg:px-[5vw] animate-pulse">
            {/* banner */}
            <div className="w-full aspect-video bg-gray-300 rounded-md" />

            {/* title + user details */}
            <div className="mt-12">
                {/* title */}
                <div className="h-12 w-full bg-gray-300 rounded-md mb-4" />
                <div className="h-12 w-3/4 bg-gray-300 rounded-md mb-4" />

                {/* user details */}
                <div className="flex gap-5 items-start my-8">
                    <div className="w-12 h-12 bg-gray-300 rounded-full" />
                    <div>
                        <div className="w-32 h-6 bg-gray-300 rounded-md" />
                        <div className="w-20 h-4 bg-gray-300 rounded-md mt-2" />
                    </div>

                </div>
                {/* published - sm */}
                <div className="w-2/5 max-sm:h-4 bg-gray-300 rounded-md ml-16 mb-10"/>

                {/* interaction */}
                <div className="w-full h-10 md:h16 bg-gray-300 rounded-md" />
            </div>

            {/* content */}
            <div className="my-12 mb-20">
                <div className="w-full h-6 bg-gray-300 rounded-md mb-4" />
                <div className="w-full h-6 bg-gray-300 rounded-md mb-4" />
                <div className="w-3/4 h-6 bg-gray-300 rounded-md mb-12" />

                <div className="w-3/4 lg:w-1/2 h-10 bg-gray-300 rounded-md mb-6" />
                <div className="w-full h-6 bg-gray-300 rounded-md mb-4" />
                <div className="w-full h-6 bg-gray-300 rounded-md mb-4" />
                <div className="w-full h-6 bg-gray-300 rounded-md mb-4" />
                <div className="w-5/6 h-6 bg-gray-300 rounded-md mb-4" />

                {/* image */}
                <div className="w-[96%] h-80 bg-gray-300 rounded-md mt-12 mx-auto" />
                <div className="w-36 h-4 bg-gray-300 rounded-md my-4 mx-auto mb-12" />

                <div className="w-full h-6 bg-gray-300 rounded-md mb-4" />
                <div className="w-full h-6 bg-gray-300 rounded-md mb-4" />
                <div className="w-2/3 h-6 bg-gray-300 rounded-md mb-4" />
            </div>

            {/* intraction */}
            <div className="w-full h-10 md:h-16 bg-gray-300 rounded-md my-8" />
        </div>
    );
};

export default BlogDisplayPageSkeleton;
