import React from "react";

const BlogPostCardSkeleton = () => {
    return (
        <div className="flex gap-8 items-center border-b border-grey pb-5 mb-4 animate-pulse">
            {/* Skeleton for blog content */}
            <div className="w-full">
                {/* Skeleton for username + published at */}
                <div className="flex gap-2 items-center mb-7">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <div className="h-4 w-32 bg-gray-300 rounded-md"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded-md"></div>
                </div>

                {/* Skeleton for title */}
                <div className="h-6 w-3/4 bg-gray-300 rounded-md mb-3"></div>

                {/* Skeleton for blog description */}
                <div className="h-4 w-full bg-gray-300 rounded-md mb-2"></div>
                <div className="h-4 w-5/6 bg-gray-300 rounded-md"></div>

                {/* Skeleton for tag & like count */}
                <div className="flex gap-4 mt-7">
                    <div className="h-6 w-16 bg-gray-300 rounded-md"></div>
                    <div className="h-5 w-10 bg-gray-300 rounded-md"></div>
                </div>
            </div>

            {/* Skeleton for blog banner */}
            <div className="h-28 aspect-square bg-gray-300 rounded-md"></div>
        </div>
    );
};

export default BlogPostCardSkeleton;
