<template>
    <view class="index">
        <Counter />
    </view>
    <Tabbar></Tabbar>
</template>

<script>
import './index.scss'
import Counter from '../../components/Counter.vue'
import Tabbar from '../../components/Tabbar.vue'

export default {
    name: 'Index',
    components: {
        Counter
    }
}
</script>
