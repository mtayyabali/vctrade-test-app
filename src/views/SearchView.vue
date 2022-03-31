<template>
  <div class="searchView h-full overflow-hidden">
    <div class="h-full flex">

      <!-- Static sidebar for desktop -->
      <div class="hidden lg:flex lg:flex-shrink-0">
        <div class="flex flex-col w-64">
          <!-- Sidebar component, swap this element with another sidebar if you like -->
          <Sidebar :users="users"></Sidebar>
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

        <div class="flex-1 relative z-0 flex overflow-hidden">
          <main class="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
            <!-- Start main area-->
            <div class="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
              <div class="h-full border-2 border-gray-200 border-dashed rounded-lg"/>
            </div>
            <!-- End main area -->
          </main>
          <aside
              class="hidden relative xl:order-first xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200 overflow-y-auto">
            <!-- Start secondary column (hidden on smaller screens) -->
            <div class="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
              <div class="h-full border-2 border-gray-200 border-dashed rounded-lg"/>
            </div>
            <!-- End secondary column -->
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import '../styles/searchView.scss';
import {ref} from 'vue'
import {Dialog, DialogOverlay, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {
  MenuIcon,
  XIcon,
} from '@heroicons/vue/outline';
import Sidebar from "@/components/Sidebar.vue";
import {api} from '@/modules/api.js';

// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'SearchView',
  components: {
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
    const sidebarOpen = ref(false)
    const users = ref([]);
    console.log('setup called');

    const getUsers = () => {
      return new Promise((resolve, reject) => {
            api.get('https://randomuser.me/api/', {
              params: {
                results: '500'
              }
            }).then((response: any) => {
              console.log(response.data);
              users.value = response.data.results;
            })
          }
      )
    }
    getUsers();
    return {
      users,
      sidebarOpen,
      getUsers
    }
  },
});
</script>
