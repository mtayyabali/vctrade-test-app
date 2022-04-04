import {api} from "@/modules/api";

export default {
  getUsers({commit}){
    let oldData = JSON.parse(window.localStorage.getItem('users') || '[]');
    console.log('old data in get users: ', oldData);

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
