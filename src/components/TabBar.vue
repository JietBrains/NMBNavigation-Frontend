<template>
    <view class="tab-bar">
        <view v-for="(item, index) in tabs" :key="index" class="tab-item" :class="{ active: current == index }"
            @tap="switchTab(index)">
            <nut-icon :name="item.icon" size="24" />
            <text>{{ item.text }}</text>
        </view>
    </view>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue';
import Taro from '@tarojs/taro';

const tabs = [
    { text: '首页', icon: 'home', path: '/pages/index/index' },
    { text: '我的', icon: 'my', path: '/pages/profile/index' },
    { text: '设置', icon: 'setting', path: '/pages/settings/index' },
];

const current = ref(0);

function switchTab(index: number) {
    current.value = index;
    Taro.navigateTo({ url: tabs[index].path });
    console.log(current.value)
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