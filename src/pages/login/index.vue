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
          <nut-button type="primary" plain block @click="handleLogin">
            登录
          </nut-button>

          <nut-button type="primary" plain block @click="handleWechatLogin">
            使用微信登录
          </nut-button>
        </nut-space>

      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { My, Find, Add } from '@nutui/icons-vue-taro'

const username = ref('')
const password = ref('')
const avatarUrl = ref('../../static/images/avatar.jpg')

const handleLogin = () => {
  // TODO: 实现登录逻辑，与后端交互
  console.log('登录', username.value, password.value)
}

const handleWechatLogin = async () => {
  try {
    const { code } = await wx.login()
    console.log('微信登录 code:', code)

    console.log('微信登录')
  } catch (error) {
    console.error('微信登录失败:', error)
  }
}
</script>

<style lang="scss" scoped></style>
