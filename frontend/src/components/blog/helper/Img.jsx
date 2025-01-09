import React from "react";

const Img = ({ url, caption }) => {
    return (
        <div>
            <img src={url} alt={caption.length ? caption : "Reference Image"} className="w-[96%] mx-auto" loading="lazy"/>
            {caption.length ? (
                <p className="w-[96%] text-center my-3 md:mb-12 text-base text-dark-grey">
                    {caption}
                </p>
            ) : (
                ""
            )}
        </div>
    );
};

export default Img;
