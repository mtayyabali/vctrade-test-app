<template>
  <div class="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-gray-100" style="text-align: center;
">
    <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <!-- Search-->
      <div class="flex items-center flex-shrink-0 px-4">
        <input type="text" name="searchInput" id="searchInput"
               class="block pl-3 py-3 text-base rounded-md placeholder-gray-500 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:flex-1 border-gray-300"
               placeholder="Search" @keyup="searchName" v-model="keyword"/>
      </div>

      <!-- Gender Filter-->
      <div class="pt-4">
        <span class="items-center">Gender: </span>
        <div class="space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-2">
          <div v-for="gender in genders" :key="gender.id" class="flex items-center" :class="{'ml-2': gender.id !== 0}">
            <input :id="gender.id" name="notification-method" type="radio"
                   :checked="genderFilter.length > 0 ? gender.name === genderFilter: gender.id === 0"
                   class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" :value="gender.name"
                   v-model="genderFilter" @change="searchName"/>
            <label :for="gender.id" class="ml-3 block text-sm font-medium text-gray-700">
              {{ gender.name }}
            </label>
          </div>
        </div>
      </div>
      <!-- User's List-->
      <nav class="h-full overflow-y-auto pt-4" aria-label="Users">
        <div class="relative">
          <ul role="list" class="relative z-0 divide-y divide-gray-200" v-if="users.length > 0">
            <li v-for="user in usersChunk" class="bg-white" :class="{'bg-gray-200': selectedUser === user}" @click="selectUser(user)" style="cursor: pointer">
              <div
                  class="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                <div class="flex-shrink-0">
                  <img class="h-10 w-10 rounded-full" :src="user && user.picture ? user.picture.medium : ''" alt=""/>
                </div>
                <div class="flex-1 min-w-0">
                  <a class="focus:outline-none">
                    <!-- Extend touch target to entire panel -->
                    <span class="absolute inset-0" aria-hidden="true"/>
                    <p class="text-sm font-medium text-gray-900">
                      {{ user && user.name ? getName(user) : '' }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                      {{ user ? user.email : '' }}
                    </p>
                  </a>
                </div>
              </div>
            </li>
            <li :class="{'hidden' : keyword.length !== 0 || genderFilter !== 'Both' || usersChunk.length === 0}">
              <a @click="requestMoreUsers" style="cursor: pointer"
                 class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">More
                Results...</a>
            </li>

            <!--Infinite Scroll-->
            <VueEternalLoading :load="load" v-if="enableInfiniteScroll && searchResults.length > 25"></VueEternalLoading>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import {ref, Ref, watch} from "vue";
import {VueEternalLoading, LoadAction} from '@ts-pro/vue-eternal-loading';
import {User} from "@/modules/user";
import {useRouter, useRoute} from 'vue-router'


export default {
  name: "Sidebar",
  components: {
    VueEternalLoading,
  },
  props: {
    users: Array
  },
  emits: ['selectUser'],
  setup(props, {emit}) {

    /**
     * Initialize variables
     */
    const genders: Ref = ref([ // For Radio Buttons
      {
        id: 0,
        name: 'Both'
      },
      {
        id: 1,
        name: 'male'
      },
      {
        id: 2,
        name: 'female'
      }
    ])
    const genderFilter: Ref = ref('Both'); // For selected gender filter
    const usersChunk: Ref = ref([]); // For users chunk
    const limit: Ref = ref(25); // For limit on list to display
    const offset: Ref = ref(0); // For offset of users chunk
    const keyword: Ref = ref(''); // For search keyword input
    const searchResults: Ref = ref([]); // For search results list
    const router = useRouter(); // For pushing url parameter to Url
    const route = useRoute(); // For accessing url parameter from vue router
    const enableInfiniteScroll: Ref = ref(false) // For enabling infinite-scroll only for search
    const selectedUser: Ref = ref({});
    /**
     * Function to push query
     * @param query
     */
    function pushWithQuery(query) {
      router.push({
        name: 'search',
        query: {
          ...query,
        },
      })
    }

    /**
     * Function to make chunks of Users data
     * @param users
     * @param limit
     * @param offset
     */
    const getUsersChunk = (users: Array<User>, limit: number, offset: number): Array<User> => {
      let chunks: Array<User> = [];
      if (users.length > 0) {
        for (let i: number = offset; i < limit && i < users.length; i++) {
          chunks.push(users[i]);
        }
      }
      return chunks;
    }

    /**
     * Read from storage search results
     */
    let oldSearch: string | null = localStorage.getItem('searchResult');
    if (oldSearch) {
      searchResults.value = JSON.parse(oldSearch);
      enableInfiniteScroll.value = false;
      usersChunk.value = getUsersChunk(searchResults.value, limit.value, offset.value)
    }

    // Initialize users chunk data
    usersChunk.value = getUsersChunk(props.users, limit.value, offset.value);

    /**
     * Function for infinite scroll
     * @param loaded
     */
    async function load({loaded}: LoadAction): Promise<void> {
      offset.value = offset.value + 25;
      limit.value = limit.value + 25;
      const loadedUsers: Array<User> = getUsersChunk(searchResults.value, limit.value, offset.value);
      usersChunk.value.push(...loadedUsers);
      loaded(loadedUsers.length);
    }

    /**
     * Function for event More Results
     */
    const requestMoreUsers = (): void => {
      if (offset.value !== props.users.length) {
        offset.value = offset.value + 25;
        limit.value = limit.value + 25;
        usersChunk.value.push(...getUsersChunk(props.users, limit.value, offset.value));
      }
    }

    /**
     * Helper function to capitalize name
     * @param str
     */
    const capitalizeFirstLetter = (str: string): string => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Helper function to get Full name with title
     * @param user
     */
    const getName = (user: User): string => {
      return user.name.title + ' ' +
          capitalizeFirstLetter(user.name.first) + ' ' +
          capitalizeFirstLetter(user.name.last);
    }

    /**
     * Function to emit select user event
     * @param user
     */
    const selectUser = (user: User): void => {
      selectedUser.value = user;
      emit('selectUser', user);
    }

    /**
     * Function to filter users based on keyword and/or gender
     */
    const searchName = (): void => {
      let hasSetUrlParams: boolean = false;
      enableInfiniteScroll.value = true;
      // Reset search condition
      searchResults.value = [];
      if (keyword.value.length === 0 && (genderFilter.value === 'Both' || genderFilter.value === '')) {
        router.push({
          name: 'search',
          query: {},
        })
        usersChunk.value = getUsersChunk(props.users, limit.value, offset.value);
        return;
      }

      for (const user of props.users) {
        // Combine first name and last name for matching
        let name: string = user.name.first + user.name.last;

        // For keyword and gender filter
        if (keyword.value.length > 0 && (genderFilter.value === 'male' || genderFilter.value === 'female')) {
          if ((name.trim().toLowerCase().includes(keyword.value.trim().toLowerCase())) && (user.gender == genderFilter.value)) {

            // For setting search parameters in URL
            if (!hasSetUrlParams) {
              let query: Object = {
                keyword: keyword.value,
                gender: genderFilter.value
              }
              pushWithQuery(query);
              hasSetUrlParams = true;
            }

            // Push matching user to search results
            searchResults.value.push(user)
          }

          // For Keyword filter
        } else if (keyword.value.length > 0) {
          if (name.trim().toLowerCase().includes(keyword.value.trim().toLowerCase())) {

            // For setting search parameters in URL
            if (!hasSetUrlParams) {
              let query = {
                keyword: keyword.value
              }
              pushWithQuery(query);
              hasSetUrlParams = true;
            }

            // Push matching user to search results
            searchResults.value.push(user)
          }

          // For Gender filter
        } else if ((genderFilter.value !== 'Both' || genderFilter.value === '')) {

          // For setting search parameters in URL
          if (genderFilter.value === user.gender) {
            if (!hasSetUrlParams) {
              let query = {
                gender: genderFilter.value
              }
              pushWithQuery(query);
              hasSetUrlParams = true;
            }

            // Push matching user to search results
            searchResults.value.push(user)
          }
        }
      }

      // Reset limit and offset for chunking results
      limit.value = 25;
      offset.value = 0;

      // If results are found
      if (searchResults.value.length > 0) {
        usersChunk.value = [];

        // Store search result in local storage
        localStorage.setItem('searchResult', JSON.stringify(searchResults.value));

        // Chunk the search results to show initially
        usersChunk.value = getUsersChunk(searchResults.value, limit.value, offset.value)
      } else { // No results found!
        usersChunk.value = [];
        router.push({
          name: 'search',
          query: {},
        })
      }
    }

    // Read from URL Parameters
    if (route.query.gender) {
      genderFilter.value = route.query.gender;
      if (genderFilter.value !== 'Both') {
        searchName();
      }
    }
    if (route.query.keyword) {
      keyword.value = route.query.keyword;
      searchName();
    }

    // Watchers
    watch(() => props.users, (newValue, oldValue) => {
      usersChunk.value = getUsersChunk(props.users, limit.value, offset.value);
    });
    return {
      capitalizeFirstLetter,
      usersChunk,
      getName,
      requestMoreUsers,
      selectUser,
      searchName,
      keyword,
      load,
      searchResults,
      genders,
      genderFilter,
      enableInfiniteScroll,
      selectedUser
    }
  }
}
</script>