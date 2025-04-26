<template>
    <view class="login">
        <view class="login-container">
            <view class="avatar" style="display: flex; justify-content: center; align-items: center;">
                <nut-avatar size="large" bg-color="pink">
                    <My />
                </nut-avatar>
            </view>
            <view class="title" style="text-align: center;">Hi,欢迎登录</view>

            <view class="form">
                <view class="input-wrapper">
                    <Add class="input-icon" />
                    <nut-input class="input-item" v-model="username" placeholder="请输入账号" :border="false">
                    </nut-input>
                </view>

                <view class="input-wrapper">
                    <Find class="input-icon" />
                    <nut-input class="input-item" v-model="password" placeholder="请输入密码" type="password" :border="false">
                    </nut-input>
                </view>

                <nut-space direction="vertical" fill>
                    <nut-button type="primary" plain block @click="getUserProfile">
                        获取个人信息
                    </nut-button>

                    <nut-button type="primary" plain block @click="handleWechatLogin">
                        使用微信登录
                    </nut-button>
                </nut-space>

            </view>
        </view>
    </view>
    <view class="container">
        <view class="userinfo">
            <template v-if="!hasUserInfo">
                <button v-if="canIUseGetUserProfile" @tap="getUserProfile">获取头像昵称</button>
                <button v-else open-type="getUserInfo" @getuserinfo="getUserInfo">获取头像昵称</button>
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
const username = ref('')
const password = ref('')


const hasUserInfo = ref(false)
const canIUseGetUserProfile = ref(false)

onMounted(() => {
    canIUseGetUserProfile.value = true
})

const getUserProfile = () => {
    console.log('获取用户信息——getUserProfile')
    Taro.getUserProfile({
        desc: '用于完善会员资料',
        success: (res) => {
            console.log('获取用户信息成功', res)
            Object.assign(userProfile, res)
            hasUserInfo.value = true
        },
        fail: (err) => {
            console.error('获取用户信息失败', err)
        },
        complete: (res) => {
            console.log('获取用户信息完成', res)
        }
    })
}

const handleWechatLogin = async () => {
    console.log('开始登录，发送用户信息到后端',  userProfile.userInfo.nickName, userProfile.userInfo.avatarUrl )

    try {
        const res = await Taro.request({
            url: 'https://your-backend.com/api/login', // 👈 换成你自己的后端接口
            method: 'POST',
            data: {
                username,
                password,
                userProfile.userInfo.nickName, 
                userProfile.userInfo.avatarUrl,
            },
            header: {
                'Content-Type': 'application/json',
            },
        })

        if (res.statusCode === 200) {
            console.log('登录成功', res.data)
            Taro.showToast({
                title: '登录成功',
                icon: 'success',
            })
        } else {
            console.error('登录失败', res)
            Taro.showToast({
                title: '登录失败',
                icon: 'none',
            })
        }
    } catch (error) {
        console.error('请求异常', error)
        Taro.showToast({
            title: '网络错误',
            icon: 'none',
        })
    }
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
  