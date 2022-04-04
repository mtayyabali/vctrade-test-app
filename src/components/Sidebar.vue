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
            <input :id="gender.id" name="notification-method" type="radio" :checked="gender.id === 0"
                   class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" :value="gender.name" v-model="genderFilter" @change="searchName"/>
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
            <li v-for="user in usersChunk" class="bg-white" @click="selectUser(user)">
              <div
                  class="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                <div class="flex-shrink-0">
                  <img class="h-10 w-10 rounded-full" :src="user && user.picture ? user.picture.medium : ''" alt=""/>
                </div>
                <div class="flex-1 min-w-0">
                  <a href="#" class="focus:outline-none">
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
              <a href="#" @click="requestMoreUsers"
                 class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >More
                Results...</a>
            </li>
            <VueEternalLoading :load="load"
                               v-if="searchResults.length > 25"></VueEternalLoading>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import {ref, Ref, watch} from "vue";
import {VueEternalLoading, LoadAction} from '@ts-pro/vue-eternal-loading';


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
    // Initialize variables
    const genders: Ref = ref([
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
    const genderFilter:Ref = ref('Both');
    const usersChunk: Ref = ref([]);
    const limit: Ref = ref(25);
    const offset: Ref = ref(0);
    const keyword: Ref = ref('');
    const searchResults: Ref = ref([]);
    const chunks: Ref = ref([]);

    // Function to make chunks of Users data
    const getUsersChunk = (users: Array<any>, limit: number, offset: number) => {
      chunks.value = [];
      if (users.length > 0) {
        for (let i = offset; i < limit && i < users.length; i++) {
          chunks.value.push(users[i]);
        }
      }
      return chunks.value;
    }

    async function load({loaded}: LoadAction): Promise<void> {
      offset.value = offset.value + 25;
      limit.value = limit.value + 25;
      const loadedUsers = getUsersChunk(searchResults.value, limit.value, offset.value);
      usersChunk.value.push(...loadedUsers);
      loaded(loadedUsers.length);
    }

    // Initialize users chunk data
    usersChunk.value = getUsersChunk(props.users, limit.value, offset.value);

    // Function for event More Results
    const requestMoreUsers = () => {
      if (offset.value !== props.users.length) {
        offset.value = offset.value + 25;
        limit.value = limit.value + 25;
        usersChunk.value.push(...getUsersChunk(props.users, limit.value, offset.value));
      }
    }

    // Watchers
    watch(() => props.users, (newValue, oldValue) => {
      console.log('old value: ', oldValue)
      console.log('new Value: ', newValue);
      usersChunk.value = getUsersChunk(props.users, limit.value, offset.value);

    });

    // Helper function to capitalize name
    const capitalizeFirstLetter = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Helper function to get Full name with title
    const getName = (user) => {
      return user.name.title + ' ' + capitalizeFirstLetter(user.name.first) + ' ' + capitalizeFirstLetter(user.name.last);
    }

    // Function to emit select user event
    const selectUser = (user) => {
      emit('selectUser', user);
    }

    // Function to filter users based on keyword and/or gender
    const searchName = () => {
      // Reset search condition
      searchResults.value = [];
      if (keyword.value.length === 0 && genderFilter.value === 'Both') {
        usersChunk.value = getUsersChunk(props.users, limit.value, offset.value);
        return;
      }

      for (const user of props.users) {
        let name = user.name.first + user.name.last;
        // For keyword and gender filter
        if (keyword.value.length > 0 && genderFilter.value !== 'Both') {
          // console.log('first condition');
          if ((name.trim().toLowerCase().includes(keyword.value.trim().toLowerCase())) && (user.gender == genderFilter.value)) {
            searchResults.value.push(user)
          }

          // For Keyword filter
        } else if (keyword.value.length > 0) {
          if (name.trim().toLowerCase().includes(keyword.value.trim().toLowerCase())) {
            searchResults.value.push(user)
          }

          // For Gender filter
        } else if (genderFilter.value !== 'Both') {
          if (genderFilter.value === user.gender) {
            searchResults.value.push(user)
          }
        }
      }
      limit.value = 25;
      offset.value = 0;
      if (searchResults.value.length > 0) {
        usersChunk.value = [];
        usersChunk.value = getUsersChunk(searchResults.value, limit.value, offset.value)
      } else {
        usersChunk.value = [];
      }
    }
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
      genderFilter
    }
  }
}
</script>

<style scoped>

</style>