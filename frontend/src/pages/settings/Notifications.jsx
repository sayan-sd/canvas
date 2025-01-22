import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../App";
import { filterPaginationData } from "../../components/home/FilterPaginationData";
import Loader from "../../components/common/Loader";
import PageAnimationWrapper from "../../components/common/PageAnimation";
import NotificationCard from "../../components/settings/NotificationCard";
import NoDataMessage from "../../components/common/NoDataMessage";
import LoadMoreDataBtn from "../../components/common/LoadMoreDataBtn";

const Notifications = () => {
    const { userAuth, setUserAuth } = useContext(UserContext);
    let access_token, new_notification_available;
    if (userAuth != null) {
        access_token = userAuth.access_token;
        new_notification_available = userAuth.new_notification_available;
    }
    const filters = ["all", "like", "comment", "reply"];
    const [filter, setFilter] = useState("all");
    const [notifications, setNotifications] = useState(null);

    const fetchNotifications = ({ page, deletedDocCount = 0 }) => {
        axios
            .post(
                import.meta.env.VITE_SERVER_DOMAIN + "/users/notifications",
                { page, filter, deletedDocCount },
                { headers: { Authorization: "Bearer " + access_token } }
            )
            .then(async ({ data: { notifications: data } }) => {
                if (new_notification_available) {
                    setUserAuth({ ...userAuth, new_notification_available: false });
                }

                let formattedData = await filterPaginationData({
                    state: notifications,
                    data,
                    page,
                    countRoute: "/users/all-notifications-count",
                    data_to_send: { filter },
                    user: access_token,
                });

                setNotifications(formattedData);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (access_token) {
            fetchNotifications({ page: 1 });
        }
    }, [filter, access_token]);

    const handleFilter = (e) => {
        let btn = e.target;
        setFilter(btn.innerHTML);
        setNotifications(null);
    };

    return (
        <div>
            <h1 className="max-md:hidden">Recent Notifications</h1>

            <div className="my-8 flex gap-6">
                {filters.map((filterName, i) => {
                    return (
                        <button
                            key={i}
                            className={`py-2 ${
                                filterName == filter ? "btn-dark" : "btn-light"
                            }`}
                            onClick={handleFilter}
                        >
                            {filterName}
                        </button>
                    );
                })}
            </div>

            {/* notifications */}
            {notifications == null ? (
                <Loader />
            ) : (
                <>
                    {notifications.results.length ? (
                        notifications.results.map((notification, i) => {
                            return (
                                <PageAnimationWrapper
                                    key={i}
                                    transition={{ delay: i * 0.08 }}
                                >
                                    <NotificationCard
                                        data={notification}
                                        index={i}
                                        notificationState={ {
                                            notifications,
                                            setNotifications,
                                        } }
                                    />
                                </PageAnimationWrapper>
                            );
                        })
                    ) : (
                        <NoDataMessage message={"No Notifications"} />
                    )}

                    <LoadMoreDataBtn
                        state={notifications}
                        fetchDataFunc={fetchNotifications}
                        additionalParams={{
                            deletedDocCount: notifications.deletedDocCount,
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default Notifications;
