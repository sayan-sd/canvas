import React from "react";
import { Link } from "react-router-dom";
import { getMonYear } from "../../utils/DateFormatter";

const AboutUser = ({ className, bio, social_links, joindAt }) => {
    return (
        <div className={"md:w-[90%] md:mt-7 " + className}>
            <p className="text-xl leading-7">{bio.length ? bio : ""}</p>

            {/* social links */}
            <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
                {Object.keys(social_links).map((key) => {
                    let link = social_links[key];

                    return link ? (
                        <Link to={link} key={key} target="_blank">
                            {
                                <i
                                    className={
                                        "text-2xl hover:text-black fi " +
                                        (key == 'x' ? "fi-brands-twitter-alt" : key != "website"
                                            ? "fi-brands-" + key
                                            : "fi-rr-globe")
                                    }
                                ></i>
                            }
                        </Link>
                    ) : (
                        ""
                    );
                })}
            </div>

            <p className="text-xl leading-7 text-dark-grey">Joined in { getMonYear(joindAt) }</p>
        </div>
    );
};

export default AboutUser;
