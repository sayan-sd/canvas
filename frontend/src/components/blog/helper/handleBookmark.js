import axios from "axios";
import toast from "react-hot-toast";

export const handleBookmark = async (
    access_token,
    blog_id,
    isBookmarked,
    setIsBookmarked,
    userAuth,
    setUserAuth
) => {
    // console.log("access token: " + access_token)
    if (!access_token) {
        toast.error("Please login first");
        return;
    }

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_SERVER_DOMAIN}/users/toggle-bookmark`,
            { blog_id },
            { headers: { Authorization: `Bearer ${access_token}` } }
        );

        // Update bookmarkIds in userAuth
        const updatedBookmarkIds = isBookmarked
            ? userAuth.bookmarkIds.filter((id) => id !== blog_id)
            : [...(userAuth.bookmarkIds || []), blog_id];

        const updatedUser = {
            ...userAuth,
            bookmarkIds: updatedBookmarkIds,
        };
        setUserAuth(updatedUser);
        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        setIsBookmarked(!isBookmarked);
        toast.success(response.data.message);
    } catch (error) {
        console.error("Bookmark error:", error);
        toast.error(
            error.response?.data?.message || "Failed to update bookmark"
        );
    }
};
