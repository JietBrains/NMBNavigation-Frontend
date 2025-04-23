<template>
    <view class="container">
        <!-- 已登录时显示用户信息 -->
        <image :src="userInfo.avatarUrl" class="avatar" />
        <text>{{ userInfo.nickName }}</text>

        <!-- 未登录时显示授权按钮 -->
        <button open-type="getUserInfo" @getuserinfo="handleGetUserInfo" class="login-btn">
            微信登录
        </button>
    </view>
    <view class="container">
        <view class="userinfo">
            <block wx:if="{{!hasUserInfo}}">
                <button wx:if="{{canIUseGetUserProfile}}" bindtap="getUserProfile"> 获取头像昵称 </button>
                <button wx:else open-type="getUserInfo" bindgetuserinfo="getUserInfo"> 获取头像昵称 </button>
            </block>
            <block wx:else>
                <image bindtap="bindViewTap" class="userinfo-avatar" src="{{userInfo.avatarUrl}}" mode="cover"></image>
                <text class="userinfo-nickname">{{ userInfo.nickName }}</text>
            </block>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'



// 用户信息响应式变量
const userInfo = ref<{
    nickName: string
    avatarUrl: string
}>({
    nickName: '',
    avatarUrl: ''
})

// 处理用户授权事件
const handleGetUserInfo = async (e: any) => {
    if (e.detail.userInfo) {
        // 直接获取微信返回的用户信息（无需额外接口）
        const { nickName, avatarUrl } = e.detail.userInfo
        userInfo.value = { nickName, avatarUrl }

        // 调用微信登录接口获取 code
        try {
            const loginRes = await Taro.login()
            if (loginRes.code) {
                // 将 code + 用户信息发送到后端
                await sendToServer(loginRes.code, nickName, avatarUrl)
                Taro.showToast({ title: '登录成功', icon: 'success' })
            }
        } catch (error) {
            Taro.showToast({ title: '登录失败', icon: 'error' })
        }
    } else {
        Taro.showToast({ title: '您拒绝了授权', icon: 'none' })
    }
}

// 发送数据到服务端
const sendToServer = async (code: string, nickName: string, avatarUrl: string) => {
    try {
        await Taro.request({
            url: 'https://2ad3-124-127-236-248.ngrok-free.app/api/login',
            method: 'POST',
            data: {
                code,
                nickName,
                avatarUrl
            }
        })
    } catch (error) {
        console.error('请求失败:', error)
    }
}
</script>

<style>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx;
}

.avatar {
    width: 150rpx;
    height: 150rpx;
    border-radius: 50%;
    margin-bottom: 20rpx;
}

.login-btn {
    margin-top: 40rpx;
    width: 70%;
    background-color: #07c160;
    color: white;
}
</style>