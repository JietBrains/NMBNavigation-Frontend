<template>
  <view class="login">
    <view class="login-container">
      <view class="avatar" style="display: flex; justify-content: center; align-items: center;">
        <template v-if="!hasUserInfo">
          <nut-avatar size="large" bg-color="pink">
            <My />
          </nut-avatar>
        </template>
        <template v-else>
          <image class="userinfo-avatar" :src="userProfile.userInfo.avatarUrl" mode="cover" @tap="bindViewTap" />
        </template>
      </view>
      <template v-if="!hasUserInfo">
        <view class="title" style="text-align: center;">Hi,欢迎登录</view>
      </template>
      <template v-else >
        <text class="userinfo-nickname" style="display: flex; justify-content: center; align-items: center;">{{ userProfile.userInfo.nickName }}</text>
      </template>

      <view class="form">
        <view class="input-wrapper">
          <nut-input class="input-item" v-model="username" placeholder="请输入账号" :border="false">
            <template #left>
              <Add class="input-icon" />
            </template>
          </nut-input>
        </view>

        <view class="input-wrapper">
          <nut-input class="input-item" v-model="password" placeholder="请输入密码" type="password" :border="false">
            <template #left>
              <Find />
            </template>
          </nut-input>
        </view>

        <nut-space direction="vertical" fill>
          <nut-button type="primary" plain block @click="getUserProfile">
            获取个人信息
          </nut-button>

          <nut-button type="primary" plain block @click="handleWechatLogin">
            登录
          </nut-button>
        </nut-space>

      </view>
    </view>
  </view>
    <Tabbar></Tabbar>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { Find, Add, My } from '@nutui/icons-vue-taro'
import { login } from 'src/utils/api.ts'
import Tabbar from '../../components/Tabbar.vue'

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
  try {
    let res = await Taro.login()
    console.log('微信登录成功:', res)
    // console.log('微信登录 code:', code)
    login({
      'username': username.value,
      'password': password.value,
      'nickname': userProfile.userInfo.nickName,
      'avatarurl': userProfile.userInfo.avatarUrl
    }).then((res) => {
      console.log('res:', res)
      if (res.code === 200) {
        Taro.setStorageSync('token', res.data.token)
        Taro.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        Taro.showToast({
          title: '登录失败',
          icon: 'none',
          duration: 2000
        })
      }
    }).catch((err) => {
      console.error('登录失败:', err)
    })
    console.log('微信登录')
  } catch (error) {
    console.error('微信登录失败:', error)
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
