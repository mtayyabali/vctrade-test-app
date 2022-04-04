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
    // filteredByAll() {
    //     return getByCountry(getByState(getByType(getByCategory(getByKeyword(state.list, state.keyword), state.category), state.type), state.state), state.country)
    // },
    filteredByKeyword({state, commit}, keyword) {
        if (keyword.length === 0) {
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
        } else {
            return commit('FILTER_BY_NAME', keyword);
        }
    },
}
