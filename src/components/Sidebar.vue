<template>
  <div class="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-gray-100">
    <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <div class="flex items-center flex-shrink-0 px-4">
        <input type="text" name="searchInput" id="searchInput"
               class="block pl-3 py-3 text-base rounded-md placeholder-gray-500 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:flex-1 border-gray-300"
               placeholder="Search"/>
      </div>
      <ul>
        <li>1</li>
        <li>1</li>
        <li>1</li>
      </ul>
    </div>

    <!-- Footer of sidebar-->
    <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
      <a href="#" class="flex-shrink-0 w-full group block">
        <div class="flex items-center">
          <div>
            <img class="inline-block h-9 w-9 rounded-full"
                 src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
                 alt=""/>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-700 group-hover:text-gray-900">Tayyab Ali</p>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import useStore from "vuex";

export default {
  name: "Sidebar",
  props: {
    users: Array
  },
  setup() {
    // const store = useStore();

    return {
      // getUsers,
    }
  }
}
</script>

<style scoped>

</style>