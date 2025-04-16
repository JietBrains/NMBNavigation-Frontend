<template>
  <view class="feedback-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="back" @click="goBack">＜</text>
      <text class="title">提交反馈</text>
    </view>

    <!-- 问题描述 -->
    <view class="section">
      <text class="label required">* 问题描述或建议</text>
      <textarea class="textarea" v-model="description" placeholder="请输入问题描述"/>
      <text class="tip">请描述您的操作步骤和现象，并提供截图便于我们定位问题</text>
    </view>

    <!-- 上传截图 -->
    <view class="section">
      <text class="label">上传截图</text>
      <view class="image-upload-list">
        <!-- 展示已上传的图片 -->
        <view v-for="(img, index) in imageList" :key="index" class="image-item">
          <image :src="img" mode="aspectFill" class="preview"/>
          <view class="delete-btn" @tap="removeImage(index)">×</view>
        </view>

        <!-- 添加图片按钮（如果未超限） -->
        <view
          v-if="imageList.length < maxImages"
          class="upload-placeholder"
          @tap="uploadImage"
        >
          ＋
        </view>
      </view>
    </view>


    <!-- 联系方式 -->
    <view class="section">
      <text class="label">联系方式</text>
      <view class="input-group">
        <text class="icon">📞</text>
        <input class="input" type="text" v-model="phone" placeholder="手机号"/>
      </view>
      <view class="input-group">
        <text class="icon">✉️</text>
        <input class="input" type="text" v-model="email" placeholder="邮箱"/>
      </view>
    </view>


    <!-- 提交按钮 -->
    <view class="footer">
      <button class="submit-btn" @click="submit">提交</button>
    </view>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro'
import {ref} from 'vue'
import style from './index.css'

const description = ref('')
const phone = ref('')
const email = ref('')
const imageUrl = ref('')

const goBack = () => {
  // 返回逻辑
}

const imageList = ref([]); // 存放多张图片路径
const maxImages = 5;

const uploadImage = () => {
  Taro.chooseImage({
    count: maxImages - imageList.value.length,
    success: (res) => {
      const newImages = res.tempFilePaths;
      imageList.value = imageList.value.concat(newImages);
    }
  });
};

const removeImage = (index) => {
  imageList.value.splice(index, 1);
};

const submit = () => {
  console.log({
    description: description.value,
    phone: phone.value,
    email: email.value,
    image: imageUrl.value
  })
}
</script>

<style>

</style>
