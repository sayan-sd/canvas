import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import axios from "axios";
import { profileDataStructure } from "../UserProfilePage";
import PageAnimationWrapper from "../../components/common/PageAnimation";
import Loader from "../../components/common/Loader";
import InputBox from "../../components/auth/InputBox";

const EditProfile = () => {
    const bioLimit = 200;
    const { userAuth } = useContext(UserContext);
    let access_token;
    if (userAuth != null) {
        access_token = userAuth.access_token;
    }

    const [profile, setProfile] = useState(profileDataStructure);
    const [loading, setLoading] = useState(true);
    const [charactersLeft, setCharactersLeft] = useState(bioLimit);

    let {
        personal_info: {
            fullname,
            username: profile_username,
            profile_img,
            email,
            bio,
        },
        social_links,
    } = profile;

    useEffect(() => {
        if (access_token.length > 0) {
            // fetch user data from server
            axios
                .post(
                    import.meta.env.VITE_SERVER_DOMAIN + "/users/get-profile",
                    { username: userAuth.username }
                )
                .then(({ data: { user } }) => {
                    setProfile(user);
                    setLoading(false);
                });
        }
    }, [access_token]);

    useEffect(() => {
        setCharactersLeft(bioLimit - bio.length);
    }, [profile]);

    return (
        <PageAnimationWrapper>
            {loading ? (
                <Loader />
            ) : (
                <form>
                    <h1 className="max-md:hidden">Edit Profile</h1>

                    <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
                        {/* profile image */}
                        <div className="max-lg:center mb-5">
                            <label
                                htmlFor="uploadImg"
                                className=" relative block w-48 h-48 bg-grey rounded-full overflow-hidden"
                            >
                                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/40 opacity-0 hover:opacity-100 cursor-pointer">
                                    Upload Image
                                </div>
                                <img src={profile_img} alt="Profile Image" />
                            </label>
                            <input
                                type="file"
                                id="uploadImg"
                                accept=".jpeg, .png, .jpg"
                                hidden
                            />

                            <button className="btn-light mt-5 max-lg:center lg:w-full px-10">
                                Upload
                            </button>
                        </div>

                        {/* User details */}
                        <div className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                                {/* full name */}
                                <div>
                                    <InputBox
                                        name={"fullname"}
                                        type={"text"}
                                        value={fullname}
                                        placeholder={"Full Name"}
                                        icon={"user"}
                                    />
                                </div>

                                {/* email */}
                                <div>
                                    <InputBox
                                        name={"email"}
                                        type={"email"}
                                        value={email}
                                        placeholder={"Email"}
                                        icon={"envelope"}
                                        disable={true}
                                    />
                                </div>
                            </div>

                            {/* username */}
                            <InputBox
                                name={"username"}
                                type={"text"}
                                value={profile_username}
                                placeholder={"Username"}
                                icon={"at"}
                            />
                            <p className="text-dark-grey -mt-3">
                                Usernames will be searchable by other users and
                                will be displayed publicly
                            </p>

                            {/* bio */}
                            <textarea
                                name={"bio"}
                                maxLength={bioLimit}
                                defaultValue={bio}
                                placeholder={"Write a something about you..."}
                                className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
                                onChange={(e) =>
                                    setCharactersLeft(
                                        bioLimit - e.target.value.length
                                    )
                                }
                            />
                            <p className="mt-1 text-dark-grey">
                                {charactersLeft} characters left
                            </p>

                            {/* social links */}
                            <p className="my-6 text-dark-grey">
                                Add your social handles below
                            </p>

                            <div className="md:grid md:grid-cols-2 gap-x-6">
                                {Object.keys(social_links).map((key) => {
                                    let link = social_links[key];
                                    return (
                                        <InputBox
                                            key={key}
                                            name={key}
                                            type={"text"}
                                            value={link}
                                            placeholder={"https://"}
                                            icon={
                                                key != "website"
                                                    ? " fi-brands-" + key
                                                    : "globe"
                                            }
                                        />
                                    );
                                })}
                            </div>

                            {/* save button */}
                            <button
                                className="btn-dark w-auto px-10 mt-5"
                                type="submit"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </PageAnimationWrapper>
    );
};

export default EditProfile;
