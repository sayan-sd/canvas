import React from "react";
import PageAnimationWrapper from "../../common/PageAnimation";

const BlogDisplayPageSkeleton = () => {
    return (
        <div className="max-w-[900px] center py-10 max-lg:px-[5vw] animate-pulse">
            <div className="w-full aspect-video bg-gray-300 rounded-md" />

            <div className="mt-12">
                <div className="h-8 w-3/4 bg-gray-300 rounded-md mb-4" />
                <div className="flex gap-5 items-start my-8">
                    <div className="w-12 h-12 bg-gray-300 rounded-full" />
                    <div>
                        <div className="w-32 h-6 bg-gray-300 rounded-md" />
                        <div className="w-20 h-4 bg-gray-300 rounded-md mt-2" />
                    </div>
                </div>
                <div className="w-48 h-4 bg-gray-300 rounded-md" />
            </div>

            <div className="my-12">
                <div className="w-full h-6 bg-gray-300 rounded-md mb-4" />
                <div className="w-full h-6 bg-gray-300 rounded-md mb-4" />
                <div className="w-full h-6 bg-gray-300 rounded-md" />
            </div>

            <div className="w-full h-8 bg-gray-300 rounded-md my-8" />
        </div>
    );
};

export default BlogDisplayPageSkeleton;