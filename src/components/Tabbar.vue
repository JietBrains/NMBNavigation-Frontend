<template>
    <nut-tabbar v-model="active" unactive-color="#7d7e80" active-color="#1989fa" bottom safe-area-inset-bottom placeholder
        @tab-switch="tabSwitch">
        <nut-tabbar-item tab-title="地图" :value="11">
            <template #icon>
                <Home></Home>
            </template>
        </nut-tabbar-item>
        <nut-tabbar-item tab-title="找设施" :value="110">
            <template #icon>
                <Find></Find>
            </template>
        </nut-tabbar-item>
        <nut-tabbar-item tab-title="收藏" :dot="true">
            <template #icon>
                <Category></Category>
            </template>
        </nut-tabbar-item>
        <nut-tabbar-item tab-title="关于" :dot="true">
            <template #icon>
                <My></My>
            </template>
        </nut-tabbar-item>
    </nut-tabbar>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Home, Category, Find, My } from '@nutui/icons-vue-taro'

const active = ref(0)

const tabSwitch = (item: Record<string, unknown>, index: number) => {
    console.log(item, index)
}

</script>