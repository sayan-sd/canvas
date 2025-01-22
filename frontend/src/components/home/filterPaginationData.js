import axios from "axios";

export const filterPaginationData = async ({
    create_new_arr = false,
    state,
    data,
    page,
    countRoute,
    data_to_send = {},
    user,
}) => {
    let obj;

    let headers = {};

    if (user) {
        headers.headers = {'Authorization': 'Bearer ' + user};
    }

    // arr already exists
    if (state != null && !create_new_arr) {
        obj = { ...state, results: [...state.results, ...data], page: page };
    } else {
        // create new arr - 1st render
        await axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, data_to_send, headers)
            .then(({ data: { totalDocs } }) => {
                obj = { results: data, page: 1, totalDocs };
            })
            .catch((err) => {
                console.error(err);
            });
    }

    return obj;
};
