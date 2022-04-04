export const STORAGE_KEY = 'users'

// for testing
if (navigator.webdriver) {
  window.localStorage.clear()
}

export const mutations = {
  /**
   * Sets users date
   * @param state
   * @param data
   * @constructor
   */
  SET_USERS(state, data) {
    localStorage.setItem('users', JSON.stringify(data));
    state.users = data;
  },

  FILTER_BY_NAME(state, keyword){
    // console.log("state => " , state);
    // console.log("keyword => " , keyword);
    const search = keyword.trim().toLowerCase();
    if (!search.length) return state.users
    return state.users = state.users.filter(user => (user.name.first.toLowerCase() + user.name.last.toLowerCase()).indexOf(search) > -1)
  },
  FILTER_BY_GENDER(state, users, gender){
    if(!gender.length) return users
    return users.filter(user => user.gender === gender)
  }
}
