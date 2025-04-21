<template>
    <view class="home">
        <text>这是首页</text>
        <TabBar />
    </view>
</template>
  
<script lang="ts" setup>
import TabBar from "../../components/TabBar.vue";
</script>
  
<style scoped>
.home {
    padding-bottom: 60px;
    /* 为底部导航栏留出空间 */
}
</style>