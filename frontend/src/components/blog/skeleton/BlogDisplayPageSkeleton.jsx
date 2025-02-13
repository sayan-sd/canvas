import React from "react";

const BlogDisplayPageSkeleton = () => {
    return (
        <div className="animate-pulse min-h-screen">
            <div className="max-w-5xl mx-auto py-12 px-6 pt-16">
                {/* Title & Description */}
                <div className="mb-8 text-center">
                    <div className="h-8 bg-gray-300 rounded w-2/3 mx-auto mb-7"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/5 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/5 mx-auto"></div>
                </div>

                {/* Banner Image */}
                <div className="w-full h-[400px] bg-gray-300 rounded-lg mb-8"></div>

                {/* Author & Publication Details */}
                <div className="flex max-sm:flex-col justify-between my-10">
                    <div className="flex gap-5 items-center">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div>
                            <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-16"></div>
                        </div>
                    </div>
                    <div className="h-3 bg-gray-300 rounded w-32 max-sm:mt-6"></div>
                </div>

                {/* Blog Interaction (Top) */}
                <div className="h-10 bg-gray-300 rounded w-full mb-10"></div>

                {/* Blog Content */}
                <div className="space-y-4 mb-8">
                    <div className="h-6 bg-gray-300 rounded w-full"></div>
                    <div className="h-6 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="h-6 bg-gray-300 rounded w-full"></div>
                    <div className="h-6 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                </div>

                <div className="space-y-4">
                    <div className="h-6 bg-gray-300 rounded w-full"></div>
                    <div className="h-6 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                </div>

                {/* Blog Interaction (Bottom) */}
                <div className="h-10 bg-gray-300 rounded w-full my-10"></div>
            </div>
        </div>
    );
};

export default BlogDisplayPageSkeleton;