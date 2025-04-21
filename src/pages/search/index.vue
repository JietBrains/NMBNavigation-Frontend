<template>
    <view class="search-page">
        <!-- 搜索栏 -->
        <view class="search-bar">
            <nut-searchbar v-model="searchValue" placeholder="搜索地点或地址" @cancel="onCancel" />
        </view>

        <!-- 最近搜索 -->
        <view class="section">
            <view class="section-title">
                <text>最近搜索</text>
                <text class="more" @tap="onMore">更多</text>
            </view>
            <view class="recent-item" v-for="(item, index) in recentSearch" :key="index">
                <nut-icon name="search2" size="16" />
                <text class="text">{{ item }}</text>
            </view>
        </view>

        <!-- 附近搜索 -->
        <view class="section">
            <view class="section-title">
                <text>附近搜索</text>
            </view>
            <view class="nearby-list">
                <view class="nearby-item" v-for="(item, index) in nearbySearch" :key="index">
                    <nut-icon :name="item.icon" size="18" :color="item.color" />
                    <text class="text">{{ item.label }}</text>
                </view>
            </view>
        </view>
        <TabBar />
    </view>
</template>
  
<script lang="ts" setup>
import TabBar from "../../components/TabBar.vue";
import { ref } from 'vue'

const searchValue = ref('')

const recentSearch = ref([
    '北京市 · 中国',
    '宝庆中路 · 邵阳市',
])

const nearbySearch = ref([
    { label: '加油站', icon: 'location', color: '#4484f1' },
    { label: '美食', icon: 'category', color: '#f28b25' },
    { label: '购物', icon: 'bag', color: '#f28b25' },
    { label: '咖啡厅', icon: 'shop', color: '#a26b47' },
    { label: '地铁站', icon: 'location', color: '#4484f1' },
])

const onCancel = () => {
    searchValue.value = ''
}

const onMore = () => {
    console.log('查看更多历史记录')
}
</script>

<style lang="scss" scoped>
.search-page {
    padding: 16rpx;

    .search-bar {
        margin-bottom: 20rpx;
    }

    .section {
        margin-top: 20rpx;

        .section-title {
            display: flex;
            justify-content: space-between;
            font-size: 28rpx;
            font-weight: bold;
            margin-bottom: 10rpx;

            .more {
                font-size: 24rpx;
                color: #409eff;
            }
        }

        .recent-item,
        .nearby-item {
            display: flex;
            align-items: center;
            padding: 20rpx;
            background-color: #fdf4ef;
            border: 1px solid #f3c9a7;
            border-radius: 12rpx;
            margin-bottom: 16rpx;

            .text {
                margin-left: 16rpx;
                font-size: 28rpx;
            }
        }

        .nearby-list {
            display: flex;
            flex-direction: column;
        }
    }
}
</style>
