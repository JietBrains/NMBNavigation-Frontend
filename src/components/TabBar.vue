<template>
    <nut-tabbar v-model="active" @tab-switch="switchTab" bottom safe-area-inset-bottom placeholder>
        <nut-tabbar-item tab-title="首页" name="index" @click="goIndex">
            <template #icon>
                <Home></Home>
            </template>
        </nut-tabbar-item>

        <nut-tabbar-item tab-title="搜索" name="recode" @click="goSearch">
            <template #icon>
                <Search></Search>
            </template>
        </nut-tabbar-item>

        <nut-tabbar-item tab-title="我的" name="my" @click="goMy">
            <template #icon>
                <My></My>
            </template>
        </nut-tabbar-item>
    </nut-tabbar>
</template>

<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { Home, My, Search } from '@nutui/icons-vue-taro'
import { useTabbarStore } from 'src/stores/tabbar';

const store = useTabbarStore()
const active = store.getTabbarSelectedName

const switchTab = (item: Record<string, unknown>) => {
    store.setTabbarSelectedName(item.name)
}

const goIndex = () => {
    Taro.redirectTo({ url: '/pages/home/index' })
}
const goMy = () => {
    Taro.redirectTo({ url: '/pages/profile/index' })
}

const goSearch = () => {
    Taro.redirectTo({ url: '/pages/search/index' })
}
</script>

<style scoped>
.tab-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: #fff;
    border-top: 1px solid #eaeaea;
}

.tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #666;
}

.tab-item.active {
    color: #1aad19;
}
</style>