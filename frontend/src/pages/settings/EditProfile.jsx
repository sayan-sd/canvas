import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../App";
import axios from "axios";
import { profileDataStructure } from "../UserProfilePage";
import PageAnimationWrapper from "../../components/common/PageAnimation";
import Loader from "../../components/common/Loader";
import InputBox from "../../components/auth/InputBox";
import toast from "react-hot-toast";
import { uploadImage } from "../../utils/uploadImage";
import { storeInSession } from "../../components/common/session";

const EditProfile = () => {
    const bioLimit = 200;
    const { userAuth, setUserAuth } = useContext(UserContext);
    let access_token;
    if (userAuth != null) {
        access_token = userAuth.access_token;
    }

    const [profile, setProfile] = useState(profileDataStructure);
    const [loading, setLoading] = useState(true);
    const [charactersLeft, setCharactersLeft] = useState(bioLimit);
    const [updatedProfileImg, setUpdatedProfileImg] = useState(null);

    let profileImgEle = useRef();
    let editProfileForm = useRef();

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

    const handleImagePreview = (e) => {
        let img = e.target.files[0];
        profileImgEle.current.src = URL.createObjectURL(img);
        setUpdatedProfileImg(img);
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();

        // validate data
        if (updatedProfileImg) {
            let loadingToast = toast.loading("Uploading Image...");
            e.target.setAttribute("disabled", true);

            // send data to server
            const result = await uploadImage(updatedProfileImg);
            if (result.success) {
                // toast.dismiss(loadingToast);
                // setBlog({ ...blog, banner: result.url });
                // toast.success("Uploaded 👍");
                let url = result.url;
                axios
                    .post(
                        import.meta.env.VITE_SERVER_DOMAIN +
                            "/users/update-profile-img",
                        { url },
                        {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                            },
                        }
                    )
                    .then(({ data }) => {
                        let newUserAuth = {
                            ...userAuth,
                            profile_img: data.profile_img,
                        };
                        storeInSession("user", JSON.stringify(newUserAuth));
                        setUserAuth(newUserAuth);

                        setUpdatedProfileImg(null);
                        toast.dismiss(loadingToast);
                        e.target.removeAttribute("disabled");
                        toast.success("Profile image updated 👍");
                    })
                    .catch(({ response }) => {
                        toast.dismiss(loadingToast);
                        e.target.removeAttribute("disabled");
                        toast.error(response.data.message);
                    });
            } else {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                return toast.error("Error uploading Image");
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let form = new FormData(editProfileForm.current);
        let formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let {
            fullname,
            username,
            bio,
            linkedin,
            facebook,
            x,
            github,
            instagram,
            website,
        } = formData;

        // validate data
        if (fullname.length < 3) {
            return toast.error("Fullname should be at least 3 characters long");
        }
        if (username.length < 3) {
            return toast.error("Username should be at least 3 characters long");
        }
        if (bio.length > bioLimit) {
            return toast.error(`Bio should not exceed ${bioLimit} characters`);
        }

        let loadingToast = toast.loading("Updating...");
        e.target.setAttribute("disabled", true);

        // send data to server
        axios
            .post(
                import.meta.env.VITE_SERVER_DOMAIN + "/users/update-profile",
                {
                    fullname,
                    username,
                    bio,
                    social_links: {
                        linkedin,
                        facebook,
                        x,
                        github,
                        instagram,
                        website,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            )
            .then(({ data }) => {
                // username changed
                if (userAuth.username != data.username) {
                    let newUserAuth = { ...userAuth, username: data.username };
                    storeInSession("user", JSON.stringify(newUserAuth));
                    setUserAuth(newUserAuth);
                }

                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                toast.success("Profile updated successfully");
            })
            .catch(({ response }) => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                toast.error(response.data.message);
            });
    };

    return (
        <PageAnimationWrapper>
            {loading ? (
                <Loader />
            ) : (
                <form ref={editProfileForm}>
                    <h1 className="max-md:hidden">Edit Profile</h1>

                    <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
                        {/* profile image */}
                        <div className="max-lg:center mb-5">
                            <label
                                htmlFor="uploadImg"
                                className=" relative block w-48 h-48 bg-grey rounded-full overflow-hidden"
                            >
                                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/40  cursor-pointer">
                                    Upload Image
                                </div>
                                <img
                                    src={profile_img}
                                    alt="Profile Image"
                                    ref={profileImgEle}
                                />
                            </label>
                            <input
                                type="file"
                                id="uploadImg"
                                accept=".jpeg, .png, .jpg"
                                hidden
                                onChange={handleImagePreview}
                            />

                            <button
                                className="btn-light mt-5 max-lg:center lg:w-full px-10"
                                onClick={handleImageUpload}
                            >
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
                                                key == 'x' ? ' fi-brands-twitter-alt' :
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
                                onClick={handleSubmit}
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
