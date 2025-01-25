import React from "react";
import BlogPostCardSkeleton from "../../blog/skeleton/BlogPostCardSkeleton";

const UserProfilePageSkeleton = () => {
    return (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12 animate-pulse">
            {/* Profile Info Skeleton */}
            <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
                {/* profile image */}
                <div className="w-48 h-48 bg-gray-300 rounded-full md:w-32 md:h-32"></div>

                {/* username */}
                <div className="w-32 h-7 bg-gray-300 rounded-md my-2"></div>
                <div className="w-24 h-5 bg-gray-300 rounded-md"></div>

                <div className="w-40 h-5 bg-gray-300 rounded-md mb-10"></div>

                {/* About User Skeleton */}
                <div className="max-md:hidden flex flex-col gap-3 mt-5">
                    <div className="w-full h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-1/2 h-4 bg-gray-300 rounded-md mt-12"></div>
                </div>
            </div>

            {/* Blog Posts Skeleton */}
            <div className="max-md:mt-12 w-full">
                <div className="w-40 h-6 bg-gray-300 rounded-md my-5 mb-11"></div>

                {/* Blog Cards Skeleton */}
                {[...Array(2)].map((_, i) => (
                    <BlogPostCardSkeleton key={i} />
                ))}
            </div>
        </section>
    );
};

export default UserProfilePageSkeleton;
