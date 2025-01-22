import React from "react";

const MinimalBlogPostCardSkeleton = () => {
    return (
        <div className="flex gap-5 mb-8 animate-pulse">
            {/* Numeric index skeleton */}
            <div className="w-8 h-8 bg-gray-300 rounded-md"></div>

            <div className="w-full">
                {/* Username + Published At Skeleton */}
                <div className="flex gap-2 items-center mb-7">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <div className="h-4 w-32 bg-gray-300 rounded-md"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded-md"></div>
                </div>

                {/* Blog title skeleton */}
                <div className="h-6 w-3/4 bg-gray-300 rounded-md"></div>
            </div>
        </div>
    );
};

export default MinimalBlogPostCardSkeleton;
