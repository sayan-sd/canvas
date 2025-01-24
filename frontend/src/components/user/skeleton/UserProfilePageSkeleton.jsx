import React from "react";

const UserProfilePageSkeleton = () => {
    return (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12 animate-pulse">
            {/* Profile Info Skeleton */}
            <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
                <div className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"></div>

                <div className="w-32 h-6 bg-grey rounded-md"></div>
                <div className="w-24 h-5 bg-grey rounded-md"></div>

                <div className="w-40 h-5 bg-grey rounded-md"></div>

                {/* Edit Profile Button Skeleton */}
                <div className="w-32 h-10 bg-grey rounded-md"></div>

                {/* About User Skeleton */}
                <div className="max-md:hidden flex flex-col gap-3 mt-5">
                    <div className="w-full h-4 bg-grey rounded-md"></div>
                    <div className="w-3/4 h-4 bg-grey rounded-md"></div>
                    <div className="w-1/2 h-4 bg-grey rounded-md"></div>
                </div>
            </div>

            {/* Blog Posts Skeleton */}
            <div className="max-md:mt-12 w-full">
                <div className="w-40 h-6 bg-grey rounded-md mb-4"></div>

                {/* Blog Cards Skeleton */}
                {/* {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-full h-32 bg-grey rounded-lg mb-4"></div>
                ))} */}

                {/* Load More Button Skeleton */}
                <div className="w-40 h-10 bg-grey rounded-md mx-auto"></div>
            </div>
        </section>
    );
};

export default UserProfilePageSkeleton;
