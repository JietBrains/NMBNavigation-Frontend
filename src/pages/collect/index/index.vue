<template>
  <view class="container">
    <!-- 收藏列表 -->
    <view class="fav-list">
      <view v-for="item in allItems" :key="item.id" class="fav-item">
        <view class="info" @tap="goToLocation(item)">
          <nut-cell :title="item.floor + '　' + item.building + '　' + item.name">
            <template #icon>
              <image src="/assets/icons/收藏 (已收藏).png" class="icon" />
            </template>
            <template #link>
              <image src="/assets/icons/设置.png" class="icon" @tap.stop="onChange(item)" />
            </template>
          </nut-cell>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import collectIcon from 'src/assets/icons/收藏 (已收藏).png'
import change from 'src/assets/icons/设置.png'
import { getAllCollection, topCollection, deleteCollection } from 'src/utils/api.ts'

// 收藏数据
const allItems = ref([])

function goToLocation(item) {
  Taro.navigateTo({
    url: `/pages/place/index/index?name=${item.name}`
  })
}

const changeItem = ref(false);
const onChange = (item) => {
  Taro.showActionSheet({
    itemList: [
      '置顶',
      //'前往该地点',
      '删除该地点',
    ],
    success(res) {
      console.log(item.name)
      if (res.tapIndex === "置顶") {
        topCollection({ 'name': item.name }).then(res => {
          if (res.code === 200) {
            Taro.showToast({
              title: '置顶成功',
              icon: 'success'
            })
          } else {
            Taro.showToast({
              title: '置顶失败',
              icon: 'none'
            })
          }
        })
      } else if (res.tapIndex === "删除该地点") {
        deleteCollection({ 'name': item.name }).then(res => {
          if (res.code === 200) {
            Taro.showToast({
              title: '删除成功',
              icon: 'success'
            })
            allItems.value = allItems.value.filter(i => i.name !== item.name)
          } else {
            Taro.showToast({
              title: '删除失败',
              icon: 'none'
            })
          }
        })
      }
    },
    fail(err) {
      if (err.errMsg === 'showActionSheet:fail cancel') {
        console.log('取消')
      } else {
        console.log('出错', err)
      }
    }
  })
}

onMounted(() => {
  console.log('onMounted')
  // 获取收藏数据
  getAllCollection().then(res => {
    if (res.code === 200) {
      console.log('getAllCollection', res)
      res.data.collects.forEach((item, index) => {
        const id = index + 1;
        const building = item[0] + '座';
        const floor = item[1] + '层';
        const name = item;
        allItems.value.push({ id, floor, building, name });
      })
      console.log('allItems', allItems.value)
    } else {
      Taro.showToast({
        title: '获取收藏数据失败',
        icon: 'none'
      })
    }
  })
})
</script>

<style lang="scss">
@import './index'; // 如果你写在外部文件中</style>
