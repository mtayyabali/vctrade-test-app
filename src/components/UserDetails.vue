<template>
  <div>
    <div class="">
      <main class="h-full focus:outline-none overflow-y-auto">
        <!-- User Details-->
        <div class="relative px-4 py-5 sm:px-6 ">
            <!-- User Picture-->
            <div class="flex justify-center">
              <img class="h-30 w-30 rounded-full" :src="user ? user.picture.large : ''" alt=""/>
            </div>
          <dl class="grid grid-cols-2 mt-5 gap-y-8 sm:grid-cols-1 ">


            <!-- User Basic Info-->
            <div class="sm:col-span-2">
              <!-- User Name-->
              <span class="text-sm font-medium text-gray-500">Full Name:
                <span class="mt-1 text-sm text-gray-900">{{ getName(user) }}</span>
              </span>
              <!-- User Email-->
              <div class="sm:col-span-1 pt-1">
                <span class="text-sm font-medium text-gray-500">Email:
                  <span class="mt-1 text-sm text-gray-900">{{ user.email }}</span>
                </span>
              </div>
              <!-- User ID-->
              <div class="sm:col-span-1 pt-1">
                  <span class="text-sm font-medium text-gray-500">ID:
                    <span class="mt-1 text-sm text-gray-900">{{ user.id.value }}</span>
                  </span>
              </div>
            </div>

            <!-- User's Location-->
            <div class="sm:col-span-2 pt-1">
              <span class="text-xl font-bold text-gray-500">Location</span>
              <!-- User's Country-->
              <div class="sm:col-span-2 pt-1">
                <span class="text-sm font-medium text-gray-500">Country:
                  <span class="mt-1 text-sm text-gray-900">{{ user.location.country }}</span>
                </span>
              </div>
              <!-- User's City-->
              <div class="sm:col-span-1 pt-1">
                <span class="text-sm font-medium text-gray-500">City:
                  <span class="mt-1 text-sm text-gray-900">{{ user.location.city }}</span>
                </span>
              </div>
              <div class="sm:col-span-1 pt-1">
                <span class="text-sm font-medium text-gray-500">Postcode:
                  <span class="mt-1 text-sm text-gray-900">{{ user.location.postcode }}</span>
                </span>
              </div>
              <div class="sm:col-span-1">
                <span class="text-sm font-medium text-gray-500">Street:
                  <span class="mt-1 text-sm text-gray-900">{{
                      user.location.street.name + ' ' + user.location.street.number
                    }}</span>
                </span>
              </div>
            </div>

            <!-- User's Coordinates-->
            <div class="sm:col-span-2 pt-1">
              <span class="text-m font-medium text-center text-gray-500">Coordinates</span>
              <!-- Longitude-->
              <div class="sm:col-span-1 pt-1">
                <div class="sm:col-span-1 text-sm font-medium text-gray-500">
                  <span class="text-sm font-medium text-gray-500">Longitude:
                    <span class="mt-1 text-sm text-gray-900">{{
                        user.location.coordinates.longitude
                      }}</span>
                    </span>
                </div>
              </div>
              <!-- Latitude-->
              <div class="sm:col-span-1 pt-1">
                <div class="sm:col-span-1 text-sm font-medium text-gray-500">
                  <span class="text-sm font-medium text-gray-500">Latitude:
                    <span class="mt-1 text-sm text-gray-900">{{
                        user.location.coordinates.latitude
                      }}</span>
                    </span>
                </div>
              </div>
            </div>

            <div class="sm:col-span-1">
            <span class="text-sm font-medium text-gray-500">Phone:
              <span class="mt-1 text-sm text-gray-900">{{ user.phone }}</span>
            </span>
            </div>
          </dl>
        </div>

        <!-- End main area -->
      </main>

    </div>

  </div>
</template>

<script lang="ts">
import {User} from '@/modules/user';

export default {
  name: "UserDetails",
  props: {
    user: Object
  },
  setup() {
    /**
     * Helper function to capitalize first letter
     * @param str
     */
    const capitalizeFirstLetter = (str: string): string => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Helper function to capitalize name of the user
     * @param user
     */
    const getName = (user: User): string => {
      return user.name.title + ' ' + capitalizeFirstLetter(user.name.first) + ' ' + capitalizeFirstLetter(user.name.last);
    }

    return {
      getName,
    }
  }
}
</script>

<style scoped>

</style>