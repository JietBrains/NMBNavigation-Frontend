<template>
    <view class="container">
        <view class="userinfo">
            <template v-if="!hasUserInfo">
                <button v-if="canIUseGetUserProfile" @tap="getUserProfile">获取头像昵称</button>
                <button v-else open-type="getUserInfo" @getuserinfo="getUserInfo">获取头像昵称</button>
            </template>
            <template v-else>
                <image class="userinfo-avatar" :src="userInfo.avatarUrl" mode="cover" @tap="bindViewTap" />
                <text class="userinfo-nickname">{{ userInfo.nickName }}</text>
            </template>
        </view>
    </view>
</template>
  
<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'

interface UserInfo {
    avatarUrl: string
    nickName: string
}

const userInfo = reactive<UserInfo>({
    avatarUrl: '',
    nickName: ''
})
const hasUserInfo = ref(false)
const canIUseGetUserProfile = ref(false)

onMounted(() => {
    if (Taro.getUserProfile) {
        canIUseGetUserProfile.value = true
    }
})

const getUserProfile = () => {
    Taro.getUserProfile({
        desc: '用于完善会员资料',
        success: (res) => {
            userInfo.avatarUrl = res.userInfo.avatarUrl
            userInfo.nickName = res.userInfo.nickName
            hasUserInfo.value = true
        }
    })
}

const getUserInfo = (e: any) => {
    userInfo.avatarUrl = e.detail.userInfo.avatarUrl
    userInfo.nickName = e.detail.userInfo.nickName
    hasUserInfo.value = true
}

const bindViewTap = () => {
    console.log('点击头像')
}
</script>
  
<style lang="scss">
.container {
    padding: 20rpx;
}

.userinfo {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #aaa;
}

.userinfo-avatar {
    overflow: hidden;
    width: 128rpx;
    height: 128rpx;
    margin: 20rpx;
    border-radius: 50%;
}

.userinfo-nickname {
    margin-top: 20rpx;
}
</style>
  