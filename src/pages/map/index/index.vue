<template>
<!--   <web-view src="http://localhost:5173/"  @message="handleMessageFromWeb"-->
<!--   bindmessage="handleMessageFromWeb"/>-->

     <web-view src="http://8.140.200.27:8087/"  @message="handleMessageFromWeb"
   bindmessage="handleMessageFromWeb"/>
<!--  <view class="container">-->

<!--    &lt;!&ndash; 顶部搜索栏 &ndash;&gt;-->
<!--    <view class="search-bar">-->
<!--      <view class="search-box">-->
<!--        <input-->
<!--          class="search-input"-->
<!--          placeholder="搜索教室"-->
<!--          v-model="searchText"-->
<!--          @focus="showHistory = true"-->
<!--          @blur="handleBlur"-->
<!--        />-->
<!--        <view class="search-btn" >搜索</view>-->
<!--      </view>-->
<!--    </view>-->


<!--    <view class="floor-selector" @tap.stop>-->
<!--      &lt;!&ndash; 左边楼层栏 &ndash;&gt;-->
<!--      <view class="floor-list">-->
<!--        <view-->
<!--          v-for="floor in floors"-->
<!--          :key="floor"-->
<!--          :class="['floor-item', selectedFloor === floor ? 'active' : '']"-->
<!--          @tap="toggleBuildingList(floor)"-->
<!--        >-->
<!--          <text>{{ floor }}</text>-->
<!--          <text class="arrow">›</text>-->
<!--        </view>-->
<!--      </view>-->

<!--      &lt;!&ndash; 右侧楼栋弹出 &ndash;&gt;-->
<!--      <view-->
<!--        v-if="showBuildings"-->
<!--        class="building-popup"-->
<!--      >-->
<!--        <scroll-view scroll-y="true" class="building-scroll">-->
<!--          <view-->
<!--            v-for="b in buildings[selectedFloor] || []"-->
<!--            :key="b"-->
<!--            class="building-item"-->
<!--            @tap="selectBuilding(b)"-->
<!--          >-->
<!--            {{ b }}-->
<!--          </view>-->
<!--        </scroll-view>-->
<!--      </view>-->
<!--    </view>-->

<!--    <div v-if="selectedPlace" class="place-card">-->
<!--      <div class="place-name">{{ selectedPlace.name }}</div>-->
<!--      <div class="place-desc">{{ selectedPlace.description }}</div>-->
<!--      <div class="actions">-->
<!--        <button class="action-button" open-type="collect">-->
<!--          <image src="/assets/icons/收藏.png" class="icon"/>-->
<!--          收藏-->
<!--        </button>-->
<!--        <button class="action-button" bindtap="navigateToLocation">-->
<!--          <image src="/assets/icons/导航.png" class="icon"/>-->
<!--          去这里-->
<!--        </button>-->
<!--      </div>-->
<!--    </div>-->

<!--  </view>-->
</template>


<script setup>
import {nextTick, onBeforeUnmount, onMounted, ref} from 'vue'
import Taro from '@tarojs/taro'
import photo from '/src/assets/A1.jpg'
import collectIcon from 'src/assets/icons/收藏.png'
import wayIcon from 'src/assets/icons/导航.png'




// Page({
//   handleMessageFromWeb(e){
//   console.log(123)
//   const data = e.detail.data[0]
//   const { type, message } = e.detail.data;
//   if(message==="搜索"){
//   Taro.navigateTo({
//     url: '/pages/history/index/index',
//   })
//   }
//   console.log('收到来自 web 的消息：', data)
// }
// })

const handleMessageFromWeb = (e) => {
  console.log(123)
  const data = e.detail.data[0]
  const { type, message } = e.detail.data;
  if(message==="搜索"){
  Taro.navigateTo({
    url: '/pages/history/index/index',
  })
  }
  console.log('收到来自 web 的消息：', data)
}


const floors = ref(['1F', '2F', '3F', '4F', '5F'])
const buildings = {
  '1F': ['A座', 'B座', 'C座'],
  '2F': ['D座', 'E座'],
  '3F': ['F座', 'G座', 'H座', 'I座', 'J座', 'K座'],
  '4F': ['L座', 'M座'],
  '5F': ['N座', 'O座']
}


const selectedFloor = ref(null)
const showBuildings = ref(false)

function toggleBuildingList(floor) {
  if (selectedFloor.value === floor && showBuildings.value) {
    showBuildings.value = false
  } else {
    selectedFloor.value = floor
    showBuildings.value = true
  }
}

function selectBuilding(name) {
  console.log('选择了：', selectedFloor.value, name)
  showBuildings.value = false
}

// 点击外部关闭
function handleClickOutside() {
  showBuildings.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))


const searchText = ref('')
const showHistory = ref(false)



// 延迟关闭
function handleBlur() {
  setTimeout(() => {
    showHistory.value = false
  }, 200)
}


const selectedPlace = {name: '咖啡店', description: '提供咖啡、甜点和休闲环境。'}

</script>

<style lang="scss">
@import './index'; // 如果你写在外部文件中

</style>

