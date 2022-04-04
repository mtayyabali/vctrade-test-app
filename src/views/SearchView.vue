<template>
  <div class="searchView h-full overflow-hidden" v-if="users && users.length > 0">
    <div class="h-full flex">

      <!-- Static sidebar for desktop -->
      <div class="hidden lg:flex lg:flex-shrink-0">
        <div class="flex flex-col w-64">
          <!-- Sidebar component, swap this element with another sidebar if you like -->
          <Sidebar :users="users" @selectUser="selectUser"></Sidebar>
        </div>
      </div>
      <div class="flex flex-col min-w-0 flex-1 overflow-hidden">
        <!--        Collapse button-->
        <div class="lg:hidden">
          <div class="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-1.5">
            <div>
              <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                   alt="Workflow"/>
            </div>
            <div>
              <button type="button"
                      class="-mr-3 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
                      @click="sidebarOpen = true">
                <span class="sr-only">Open sidebar</span>
                <MenuIcon class="h-6 w-6" aria-hidden="true"/>
              </button>
            </div>
          </div>
        </div>

        <UserDetails :user="selectedUser" v-if="selectedUser.name !== undefined"></UserDetails>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, Ref} from 'vue';
import '../styles/searchView.scss';
import {ref} from 'vue'
// import {Dialog, DialogOverlay, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {
  MenuIcon,
  XIcon,
} from '@heroicons/vue/outline';
import Sidebar from "@/components/Sidebar.vue";
import {useStore} from 'vuex';
import UserDetails from "@/components/UserDetails.vue";

export default defineComponent({
  name: 'SearchView',
  components: {
    UserDetails,
    Sidebar,
    // Dialog,
    // DialogOverlay,
    // TransitionChild,
    // TransitionRoot,
    MenuIcon,
    XIcon,
  },
  mounted() {
    document.body.classList.add('h-full', 'overflow-hidden')
  },
  setup() {
    const store = useStore();
    const sidebarOpen: Ref = ref(false)
    let selectedUser = ref({});
    // Read from state
    let users: Ref = computed(() => store.state.users);
    if (users.value.length === 0) {
      // Fetch from API
      store.dispatch('getUsers');
    }
    const selectUser = (user)=> {
      console.log(user);
      selectedUser.value = user;
    }
    return {
      users,
      sidebarOpen,
      selectedUser,
      selectUser
    }
  },
});
</script>
