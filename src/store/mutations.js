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
}
