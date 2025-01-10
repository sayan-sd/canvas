import React from "react";

const Quote = ({ quote, caption }) => {
    return (
        <div className="bg-purple/10 p-3 pl-5 border-l-4 border-purple">
            <p className="text-xl leading-10 md:text-2xl">{quote}</p>
            {caption.length ? (
                <p className="w-full text-purple text-base">{caption}</p>
            ) : (
                ""
            )}
        </div>
    );
};

export default Quote;
