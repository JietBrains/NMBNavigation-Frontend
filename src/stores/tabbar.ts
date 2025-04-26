import { defineStore } from 'pinia'

const useTabbarStore = defineStore('tabbar', {
    state: () => ({
        index: 0,
    }),
    actions: {
        setIndex(index:number) {
            this.index = index
        }
    },
    getters: {
        getIndex() {
            return this.index
        }
    }
}
)

export { useTabbarStore }
