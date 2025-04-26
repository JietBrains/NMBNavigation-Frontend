<template>
    <nut-tabbar v-model="active" unactive-color="#7d7e80" active-color="#1989fa" bottom safe-area-inset-bottom placeholder
        @tab-switch="tabSwitch">
        <nut-tabbar-item tab-title="地图" >
            <template #icon>
                <Home></Home>
            </template>
        </nut-tabbar-item>
        <nut-tabbar-item tab-title="找设施" >
            <template #icon>
                <Find></Find>
            </template>
        </nut-tabbar-item>
        <nut-tabbar-item tab-title="收藏" :dot="false">
            <template #icon>
                <Category></Category>
            </template>
        </nut-tabbar-item>
        <nut-tabbar-item tab-title="关于" :dot="false">
            <template #icon>
                <My></My>
            </template>
        </nut-tabbar-item>
    </nut-tabbar>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { Home, Category, Find, My } from '@nutui/icons-vue-taro'

const active = ref(0)

const tabSwitch = (item: Record<string, unknown>, index: number) => {
    console.log(item, index)
    if (index == 0) { // 地图
        Taro.navigateTo({ url: '/pages/place/index/index' })
    } else if (index == 1) {
        Taro.navigateTo({ url: '/pages/find/index/index' })
    } else if (index == 2) {
        console.log('收藏')
        Taro.navigateTo({ url: '/pages/collect/index/index' })
    } else if (index == 3) {
        Taro.navigateTo({ url: '/pages/about/index/index' })
    }
}

</script>