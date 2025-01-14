import React, { useContext, useRef } from "react";
import PageAnimationWrapper from "../../components/common/PageAnimation";
import InputBox from "../../components/auth/InputBox";
import toast from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../../App";

const ChangePassword = () => {
    const changePasswordForm = useRef();
    let { userAuth } = useContext(UserContext);
    let access_token;
    if (userAuth != null) {
        access_token = userAuth.access_token;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        let form = new FormData(changePasswordForm.current);
        let formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { currentPassword, newPassword } = formData;

        // validate data
        if (!currentPassword.length || !newPassword.length) {
            return toast.error("All fields are required");
        }
        if (!passwordRegex.test(newPassword)) {
            return toast.error(
                "New password must contain at least 6 characters, including one uppercase letter, one lowercase letter, and one number"
            );
        }

        // disable button & loading
        e.target.setAttribute("disabled", true);
        let loadingToast = toast.loading("Updating password...");

        // api call
        axios
            .post(
                import.meta.env.VITE_SERVER_DOMAIN + "/users/change-password",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            )
            .then(() => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                return toast.success("Password updated successfully");
            })
            .catch(({ response }) => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                return toast.error(response.data.message);
            });
    };

    return (
        <PageAnimationWrapper>
            <form ref={changePasswordForm}>
                <h1 className="max-md:hidden">Change Password</h1>

                <div className="py-10 w-full md:max-w-[400px]">
                    <InputBox
                        name={"currentPassword"}
                        type={"password"}
                        className={"profile-edit-input"}
                        placeholder={"Current Password"}
                        icon={"unlock"}
                    />

                    <InputBox
                        name={"newPassword"}
                        type={"password"}
                        className={"profile-edit-input"}
                        placeholder={"New Password"}
                        icon={"unlock"}
                    />

                    <button
                        onClick={handleSubmit}
                        className="btn-dark px-10"
                        type="submit"
                    >
                        Change Password
                    </button>
                </div>
            </form>
        </PageAnimationWrapper>
    );
};

export default ChangePassword;
