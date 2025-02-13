import React from "react";

const BlogPostCardSkeleton = () => {
    return (
        <div className="block rounded-lg bg-white shadow-md overflow-hidden mb-6 animate-pulse">
            <div className="flex flex-row max-sm:flex-col md:max-[1100px]:flex-col">
                {/* Skeleton for Blog Banner */}
                <div className="w-1/3 max-sm:w-full md:max-[1100px]:w-full">
                    <div className="relative h-full max-sm:h-48 md:max-[1100px]:h-48 bg-gray-300"></div>
                </div>

                {/* Skeleton for Blog Content */}
                <div className="w-2/3 max-sm:w-full md:max-[1100px]:w-full p-4 sm:py-4 sm:px-6">
                    {/* Skeleton for Author Info & Date */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-4 w-24 bg-gray-300 rounded-md mb-1"></div>
                            <div className="h-3 w-16 bg-gray-300 rounded-md"></div>
                        </div>
                    </div>

                    {/* Skeleton for Title */}
                    <div className="h-6 w-3/4 bg-gray-300 rounded-md mb-6"></div>

                    {/* Skeleton for Description */}
                    <div className="h-4 w-full bg-gray-300 rounded-md mb-2"></div>
                    <div className="h-4 w-5/6 bg-gray-300 rounded-md"></div>

                    {/* Skeleton for Engagement Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-dark-grey mt-4">
                        <div className="flex items-center gap-5">
                            <div className="h-5 w-10 bg-gray-300 rounded-md"></div>
                            <div className="h-5 w-10 bg-gray-300 rounded-md"></div>
                        </div>

                        <div className="h-5 w-5 bg-gray-300 rounded-md"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPostCardSkeleton;
