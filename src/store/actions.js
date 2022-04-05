import {api} from "@/modules/api";

export default {
    getUsers({commit}) {
        return new Promise((resolve, reject) => {
                api.get('https://randomuser.me/api/', {
                    params: {
                        results: '500'
                    }
                }).then((response) => {
                    commit('SET_USERS', response.data.results);
                    resolve(response.data.results);
                });
            }
        )
    },
}
