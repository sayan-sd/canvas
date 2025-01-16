import React from "react";

const LoadMoreDataBtn = ({ state, fetchDataFunc, additionalParams }) => {
    if (state != null) {
        // console.log(state.totalDocs)
        // console.log(state.results.length)
        if (state != null && state.totalDocs > state.results.length) {
            return (
                <button
                    onClick={() =>
                        fetchDataFunc({
                            ...additionalParams,
                            page: state.page + 1,
                        })
                    }
                    className="text-dark-grey p-2 hover:bg-grey/30 rounded-md flex items-center gap-2"
                >
                    Load More
                </button>
            );
        }
    }
};

export default LoadMoreDataBtn;
