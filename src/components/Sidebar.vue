<template>
  <div class="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-gray-100" style="text-align: center;
">
    <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <!-- Search-->
      <div class="flex items-center flex-shrink-0 px-4">
        <input type="text" name="searchInput" id="searchInput"
               class="block pl-3 py-3 text-base rounded-md placeholder-gray-500 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:flex-1 border-gray-300"
               placeholder="Search"/>
      </div>

      <!-- User's List-->
      <nav class="h-full overflow-y-auto pt-4" aria-label="Users">
        <div class="relative">
          <ul role="list" class="relative z-0 divide-y divide-gray-200" v-if="users.length > 0">
            <li v-for="user in usersChunk" :key="user.id.value" class="bg-white" @click="selectUser(user)">
              <div
                  class="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                <div class="flex-shrink-0">
                  <img class="h-10 w-10 rounded-full" :src="user ? user.picture.medium : ''" alt=""/>
                </div>
                <div class="flex-1 min-w-0">
                  <a href="#" class="focus:outline-none">
                    <!-- Extend touch target to entire panel -->
                    <span class="absolute inset-0" aria-hidden="true"/>
                    <p class="text-sm font-medium text-gray-900">
                      {{ user ? getName(user) : '' }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                      {{ user ? user.email : '' }}
                    </p>
                  </a>
                </div>
              </div>
            </li>
            <li>
              <a href="#" @click="requestMoreUsers"
                 class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">More
                Results...</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <!-- Footer of sidebar-->
    <!--    <div class="flex-shrink-0 flex border-t border-gray-200 p-4">-->
    <!--      <a href="#" class="flex-shrink-0 w-full group block">-->
    <!--        <div class="flex items-center">-->
    <!--          <div>-->
    <!--            <img class="inline-block h-9 w-9 rounded-full"-->
    <!--                 src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"-->
    <!--                 alt=""/>-->
    <!--          </div>-->
    <!--          <div class="ml-3">-->
    <!--            <p class="text-sm font-medium text-gray-700 group-hover:text-gray-900">Tayyab Ali</p>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </a>-->
    <!--    </div>-->
  </div>
</template>

<script lang="ts">
import {ref, Ref, watch} from "vue";

export default {
  name: "Sidebar",
  props: {
    users: Array
  },
  emits: ['selectUser'],
  setup(props, {emit}) {
    let usersChunk: Ref = ref([]);
    let limit: Ref = ref(25);
    let offset: Ref = ref(0);
    // Function to make chunks of Users data
    const getUsersChunk = (users: Array<any>, limit: number, offset: number) => {
      if (users.length > 0) {

        console.log("offset => ", offset);
        console.log("limit => ", limit);

        for (let i = offset; i < limit; i++) {
          usersChunk.value.push(users[i]);
        }
      }
    }

    // Initialize users chunk data
    getUsersChunk(props.users, limit.value, offset.value);

    // Function for event More Results
    const requestMoreUsers = () => {
      console.log('received event');
      if (offset.value !== props.users.length) {
        offset.value = offset.value + 25;
        limit.value = limit.value + 25;
        getUsersChunk(props.users, limit.value, offset.value);
        console.log('changed users => ', usersChunk.value);
      }
    }
    console.log('props: ', props.users);
    watch(() => props.users, (newValue, oldValue) => {
      console.log('old value: ', oldValue)
      console.log('new Value: ', newValue);
      getUsersChunk(props.users, limit.value, offset.value);

    });
    const capitalizeFirstLetter = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const getName = (user) => {
      return user.name.title + ' ' + capitalizeFirstLetter(user.name.first) + ' ' + capitalizeFirstLetter(user.name.last);
    }

    const selectUser = (user) => {
      emit('selectUser', user);
    }

    return {
      capitalizeFirstLetter,
      usersChunk,
      getName,
      requestMoreUsers,
      selectUser
    }
  }
}
</script>

<style scoped>

</style>