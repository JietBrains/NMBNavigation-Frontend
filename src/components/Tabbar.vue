<template>
  <nut-tabbar v-model="active" unactive-color="#7d7e80" active-color="#1989fa" bottom safe-area-inset-bottom placeholder
              @tab-switch="tabSwitch">
    <nut-tabbar-item tab-title="地图">
      <template #icon>
        <Home></Home>
      </template>
    </nut-tabbar-item>
    <nut-tabbar-item tab-title="找设施">
      <template #icon>
        <Find></Find>
      </template>
    </nut-tabbar-item>
    <nut-tabbar-item tab-title="收藏" :dot="false">
      <template #icon>
        <Category></Category>
      </template>
    </nut-tabbar-item>
    <nut-tabbar-item tab-title="关于" :dot="false">
      <template #icon>
        <My></My>
      </template>
    </nut-tabbar-item>
  </nut-tabbar>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import Taro from '@tarojs/taro'
import {Home, Category, Find, My} from '@nutui/icons-vue-taro'
import {useTabbarStore} from '/src/stores/tabbar'

const userStore = useTabbarStore()
const active = ref(0)
const props = defineProps({
  count: Number
})

onMounted(() => {
  active.value=props.count
})

const tabSwitch = (item: Record<string, unknown>, index: number) => {
  console.log(item, index)
  if (index == 0) { // 地图
    Taro.reLaunch({url: '/pages/map/index/index'})
  } else if (index == 1) {
    Taro.reLaunch({url: '/pages/findLatest/index/index'})
  } else if (index == 2) {
    Taro.reLaunch({url: '/pages/collect/index/index'})
  } else if (index == 3) {
    console.log(666666666)
    Taro.reLaunch({url: '/pages/login/index'})
  }
  // userStore.setIndex(index)
}

</script>
