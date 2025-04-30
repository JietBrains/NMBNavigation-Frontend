<template>
  <view class="login-container">
    <!-- 用户信息卡片 -->
    <nut-cell-group class="user-card">
      <view class="user-info">
        <image class="avatar" :src="hasUserInfo ? userInfo.avatarUrl : defaultAvatar" mode="aspectFill"
          :class="{ 'avatar-animate': hasUserInfo }" />
        <view class="user-detail">
          <text v-if="hasUserInfo" class="nickname">{{ userInfo.nickName }}</text>
          <nut-button v-else type="primary" size="small" @tap="getUserProfile" class="login-btn">
            点击登录
          </nut-button>
        </view>
      </view>
    </nut-cell-group>

    <!-- 导航按钮组 -->
    <view class="nav-section">
      <nut-cell-group>
        <nut-cell title="🧭 导航页面" is-link @click="goTo('/pages/navigation/index/index')" class="nav-item" />
        <nut-cell title="⭐ 收藏页面" is-link @click="goTo('/pages/collect/index/index')" class="nav-item" />
        <nut-cell title="🔍 搜索页面" is-link @click="goTo('/pages/history/index/index')" class="nav-item" />
        <nut-cell title="📝 反馈页面" is-link @click="goTo('/pages/feedback/index/index')" class="nav-item" />
      </nut-cell-group>
    </view>

    <Tabbar :count="3"></Tabbar>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import Taro from '@tarojs/taro'
import Tabbar from 'src/components/Tabbar.vue'

interface UserInfo {
  avatarUrl: string
  nickName: string
}

const userInfo = reactive<UserInfo>({
  avatarUrl: '',
  nickName: '',
})

const hasUserInfo = ref(false)
const defaultAvatar = 'https://cdn.jsdelivr.net/gh/hjzts/imgs/img202505010233338.png'

const getUserProfile = () => {
  Taro.getUserProfile({
    desc: '用于完善会员信息',
    success: (res) => {
      Object.assign(userInfo, res.userInfo)
      hasUserInfo.value = true
      // 显示登录成功提示
      Taro.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 2000
      })
    },
    fail: () => {
      Taro.showToast({
        title: '登录失败',
        icon: 'error',
        duration: 2000
      })
    }
  })
}

const goTo = (url: string) => {
  console.log(url)
  Taro.navigateTo({ url: url })
  // Taro.reLaunch({ url: url })
}
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding: 20px;
}

.user-card {
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.avatar-animate {
  animation: avatarPop 0.5s ease;
}

@keyframes avatarPop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.user-detail {
  margin-left: 16px;
  flex: 1;
}

.nickname {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.login-btn {
  background: #fff !important;
  color: #4CAF50 !important;
  border: none !important;
  font-weight: 500;
  padding: 8px 20px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-section {
  margin-top: 20px;
}

.nav-item {
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}

// 自定义 NutUI 组件样式
:deep(.nut-cell) {
  padding: 16px !important;
  font-size: 16px !important;
}

:deep(.nut-cell__title) {
  font-weight: 500 !important;
}

:deep(.nut-cell__value) {
  color: #999 !important;
}
</style>