import { shallowMount } from '@vue/test-utils'
import SearchView from "@/views/SearchView.vue";
import Sidebar from "@/components/Sidebar.vue";
const factory = (values = {}) => {
    return shallowMount(Sidebar, {
        data () {
            return {
                ...values
            }
        }
    })
}

describe('Users', () => {
    it('should show No Results', function () {
        const wrapper = shallowMount(Sidebar,{
            propsData: { users:[] }
        })
        expect(wrapper.find('.users-not-found').exists()).toBeTruthy()
    });
})