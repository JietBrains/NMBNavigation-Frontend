<template>
    <view class="container">
        <view class="userinfo">
            <template v-if="!hasUserInfo">
                <button v-if="canIUseGetUserProfile" @tap="getUserProfile">获取头像昵称</button>
                <!-- <button v-else open-type="getUserInfo" @getuserinfo="getUserInfo">获取头像昵称</button> -->
                <button v-else open-type="getUserProfile" @getuserinfo="getUserProfile"> 获取头像昵称 </button>
            </template>
            <template v-else>
                <image class="userinfo-avatar" :src="userProfile.userInfo.avatarUrl" mode="cover" @tap="bindViewTap" />
                <text class="userinfo-nickname">{{ userProfile.userInfo.nickName }}</text>
            </template>
        </view>
    </view>
</template>
  
<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'

interface UserInfo {
    avatarUrl: string
    city: string
    country: string
    gender: number
    language: string
    nickName: string
    province: string
}

interface UserProfile {
    cloudID: string
    encryptedData: string
    errMsg: string
    iv: string
    rawData: string
    signature: string
    userInfo: UserInfo
}

const userProfile = reactive<UserProfile>({
    cloudID: '',
    encryptedData: '',
    errMsg: '',
    iv: '',
    rawData: '',
    signature: '',
    userInfo: {
        avatarUrl: '',
        city: '',
        country: '',
        gender: 0,
        language: '',
        nickName: '',
        province: ''
    }
})

const hasUserInfo = ref(false)
const canIUseGetUserProfile = ref(false)

onMounted(() => {
    canIUseGetUserProfile.value = true
})

// const getUserProfile = () => {
//     console.log('获取用户信息——getUserProfile')
//     Taro.getUserProfile({
//         desc: '用于完善会员资料',
//         success: (res) => {
//             console.log('获取用户信息成功', res)
//             Object.assign(userProfile, res)
//             hasUserInfo.value = true
//         },
//         fail: (err) => {
//             console.error('获取用户信息失败', err)
//         },
//         complete: (res) => {
//             console.log('获取用户信息完成', res)
//         }
//     })
// }

const getUserProfile = (e: any) => {
    console.log('真实用户信息', e.detail.userInfo)
    Object.assign(userProfile.userInfo, e.detail.userInfo)
    hasUserInfo.value = true
}

const getUserInfo = (e: any) => {
    // 仅作兼容：旧版不带加密信息，只返回userInfo
    userProfile.userInfo = e.detail.userInfo
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
  