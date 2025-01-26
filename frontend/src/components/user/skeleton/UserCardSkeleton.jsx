import React from "react";

const UserCardSkeleton = () => {
    return (
        <div className="flex gap-5 items-center mb-5 animate-pulse">
            <div className="w-14 h-14 rounded-full bg-gray-300" />
            
            <div className="flex flex-col gap-2">
                <div className="w-32 h-5 bg-gray-300 rounded" />
                <div className="w-24 h-4 bg-gray-300 rounded" />
            </div>
        </div>
    );
};

export default UserCardSkeleton;
