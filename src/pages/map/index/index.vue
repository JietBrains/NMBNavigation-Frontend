<template>
  <view class="container">

    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="search-box">
        <input
          class="search-input"
          placeholder="搜索教室"
          v-model="searchText"
          @focus="showHistory = true"
          @blur="handleBlur"
          @confirm="saveToHistory"
        />
        <view class="search-btn" @tap="saveToHistory">搜索</view>
      </view>

    </view>

<!--    <view class="container1" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">-->
<!--      <canvas-->
<!--        type="2d"-->
<!--        id="canvas"-->
<!--        canvas-id="canvas"-->
<!--        style="width: 100%; height: 400px; background: white"-->
<!--      />-->
<!--    </view>-->

     <web-view src="http://localhost:5173/" @message="handleMessage"/>
    <!--    <image src="/assets/A1.jpg" alt="底图" class="map-image" mode="aspectFill"/>-->
    <!-- 地图与楼层导航 -->
    <view class="floor-selector" @tap.stop>
      <!-- 左边楼层栏 -->
      <view class="floor-list">
        <view
          v-for="floor in floors"
          :key="floor"
          :class="['floor-item', selectedFloor === floor ? 'active' : '']"
          @tap="toggleBuildingList(floor)"
        >
          <text>{{ floor }}</text>
          <text class="arrow">›</text>
        </view>
      </view>

      <!-- 右侧楼栋弹出 -->
      <view
        v-if="showBuildings"
        class="building-popup"
      >
        <scroll-view scroll-y="true" class="building-scroll">
          <view
            v-for="b in buildings[selectedFloor] || []"
            :key="b"
            class="building-item"
            @tap="selectBuilding(b)"
          >
            {{ b }}
          </view>
        </scroll-view>
      </view>
    </view>

    <div v-if="selectedPlace" class="place-card">
      <div class="place-name">{{ selectedPlace.name }}</div>
      <div class="place-desc">{{ selectedPlace.description }}</div>
      <div class="actions">
        <button class="action-button" open-type="collect">
          <image src="/assets/icons/收藏.png" class="icon"/>
          收藏
        </button>
        <button class="action-button" bindtap="navigateToLocation">
          <image src="/assets/icons/导航.png" class="icon"/>
          去这里
        </button>
      </div>
    </div>

  </view>
</template>


<script setup>
import {nextTick, onBeforeUnmount, onMounted, ref} from 'vue'
import Taro from '@tarojs/taro'
import photo from '/src/assets/A1.jpg'
import collectIcon from 'src/assets/icons/收藏.png'
import wayIcon from 'src/assets/icons/导航.png'

const imgUrl = '/assets/A1.jpg' // ✅ 换成你自己的图片地址

let canvas, ctx
let imageRef = null // ✅ 全局保存图片对象
const position = ref({x: 0, y: 0, scale: 1})
let lastTouch = null

onMounted(() => {
  nextTick(() => {
    const query = Taro.createSelectorQuery()
    query.select('#canvas')
      .node()
      .exec(async (res) => {
        canvas = res[0].node
        ctx = canvas.getContext('2d')

        const img = canvas.createImage()
        img.src = imgUrl
        img.onload = () => {
          imageRef = img
          drawImage(img)
        }
      })
  })
})

function drawImage(img) {
  const {x, y, scale} = position.value
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.drawImage(img, 0, 0, canvas.width,  canvas.height)
  ctx.restore()
}

function onTouchStart(e) {
  const touch = e.touches[0]
  lastTouch = {x: touch.clientX, y: touch.clientY}
}

function onTouchMove(e) {
  if (!lastTouch) return
  const touch = e.touches[0]
  const deltaX = touch.clientX - lastTouch.x
  const deltaY = touch.clientY - lastTouch.y

  position.value.x += deltaX
  position.value.y += deltaY
  lastTouch = {x: touch.clientX, y: touch.clientY}

  drawImage(imageRef) // 重绘
}

function onTouchEnd() {
  lastTouch = null
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
const historyList = ref([])

// 加载历史记录
onMounted(() => {
  const history = Taro.getStorageSync('searchHistory')
  if (Array.isArray(history)) {
    historyList.value = history
  }
})

// 保存记录（输入框回车）
function saveToHistory() {
  const value = searchText.value.trim()
  if (!value) return

  const updated = historyList.value.filter(item => item !== value)
  updated.unshift(value)

  if (updated.length > 10) {
    updated.length = 10
  }

  historyList.value = updated
  Taro.setStorageSync('searchHistory', updated)
  showHistory.value = false
}

// 选中历史记录
function selectHistory(item) {
  searchText.value = item
  showHistory.value = false
}

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

