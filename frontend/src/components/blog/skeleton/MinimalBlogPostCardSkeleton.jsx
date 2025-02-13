import React from "react";

const MinimalBlogPostCardSkeleton = () => {
    return (
        <div className="flex gap-5 mb-8 animate-pulse">
            <div>
                {/* Username + Published At Skeleton */}
                <div className="flex gap-2 items-center mb-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <div className="h-4 w-24 bg-gray-300 rounded-md"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded-md"></div>
                </div>

                {/* Blog title skeleton */}
                <div className="h-6 w-3/4 bg-gray-300 rounded-md"></div>
            </div>
        </div>
    );
};

export default MinimalBlogPostCardSkeleton;
