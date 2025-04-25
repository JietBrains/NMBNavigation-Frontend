<template>
    <view class="container">
        <!-- 用户信息展示 -->
        <image :src="userInfo.avatarUrl" class="avatar" />
        <text>{{ userInfo.nickName }}</text>

        <!-- 获取用户信息按钮 -->
        <button @click="handleGetUserProfile" class="auth-btn">
            用户信息
        </button>

        <button @click="test" class="auth-btn">
            测试
        </button>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'

// 用户信息状态
const userInfo = ref<{
    nickName: string
    avatarUrl: string
}>({
    nickName: '',
    avatarUrl: ''
})
const hasUserInfo = ref(false)

// 处理获取用户信息
const handleGetUserProfile = async () => {
    try {
        // const res1 =  await Taro.login()
        // console.log("login: " , res1)

        // 调用 Taro 封装的 getUserProfile
        const res = await Taro.getUserProfile({
            desc: '用于完善个人资料',
        })

        console.log("getUserProfile: ",res)

        // 更新用户信息状态
        userInfo.value = {
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl
        }
        hasUserInfo.value = true

        // 可选：获取 code 并发送到服务端
        // const loginRes = await Taro.login()
        // if (loginRes.code) {
        //     await sendToServer(loginRes.code, userInfo.value)
        // }
    } catch (error) {
        Taro.showToast({ title: '用户拒绝授权', icon: 'none' })
    }
}

const test = async () => {
    Taro.cloud.init({
        env: 'cloud1-8gkxwphl4d1cef91',
        traceUser: true
    })

    Taro.cloud.callFunction({
        name: 'test',
        complete: res => {
            console.log('callFunction test result:', res)
        }
    })
}

// 发送数据到服务端
const sendToServer = async (code: string, userInfo: { nickName: string, avatarUrl: string }) => {
    await Taro.request({
        url: 'https://6dd4-124-127-236-248.ngrok-free.app/api/login',
        method: 'POST',
        data: {
            code,
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl
        }
    })
}
</script>

<style>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 20px;
}

.auth-btn {
    margin-top: 30px;
    width: 200px;
    background-color: #07c160;
    color: white;
}
</style>