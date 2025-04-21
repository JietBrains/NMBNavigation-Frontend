<template>
     <web-view src="http://localhost:5174/"     @message="handleMessageFromWeb"
    :bindmessage="handleMessageFromWeb"/>
</template>

<script setup>
import './index.scss'


</script>
