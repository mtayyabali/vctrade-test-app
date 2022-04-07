<template>
  <div class="searchView h-full overflow-hidden">
    <div class="h-full flex">
      <!-- Static sidebar for desktop -->
      <div class=" lg:flex lg:flex-shrink-0">
        <div class="flex flex-col w-64">
          <!-- Sidebar component, swap this element with another sidebar if you like -->
          <Sidebar :users="users" @selectUser="selectUser"></Sidebar>
        </div>
      </div>
      <div class="flex flex-col min-w-0 flex-1 overflow-hidden">
        <UserDetails :user="selectedUser" v-if="selectedUser.name !== undefined"></UserDetails>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, Ref} from 'vue';
import '../styles/searchView.scss';
import {ref} from 'vue'
import {
  MenuIcon,
  XIcon,
} from '@heroicons/vue/outline';
import Sidebar from "@/components/Sidebar.vue";
import {Store, useStore} from 'vuex';
import UserDetails from "@/components/UserDetails.vue";
import {User} from "@/modules/user";

export default defineComponent({
  name: 'SearchView',
  components: {
    UserDetails,
    Sidebar,
    MenuIcon,
    XIcon,
  },
  mounted() {
    document.body.classList.add('h-full', 'overflow-hidden')
  },
  setup() {
    // Initialize variables
    const store: Store<any> = useStore(); // For Vuex
    let selectedUser: Ref = ref({}); // For selected user from the list

    // Read from state
    let users: Ref = computed(() => store.state.users);
    if (users.value.length === 0) {
      // Fetch from API
      store.dispatch('getUsers');
    }

    /**
     * Function to set selected user value and store in local storage
     * @param user
     */
    const selectUser: Function = (user: User): void => {
      selectedUser.value = user;
      localStorage.setItem('selectedUser', JSON.stringify(user));
    }

    // Read Selected user from storage
    let userStr: string | null = localStorage.getItem('selectedUser');
    if (userStr) {
      let user: User = JSON.parse(userStr);
      selectUser(user);
    }

    return {
      users,
      selectedUser,
      selectUser
    }
  },
});
</script>
