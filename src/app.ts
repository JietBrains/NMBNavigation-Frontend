import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Button } from "@nutui/nutui-taro";

import './app.scss'
import '@nutui/nutui-taro/dist/style.css'
import '@nutui/touch-emulator';

const App = createApp({
  onShow(options) {
  },
})

App.use(createPinia())
App.use(Button)

export default App
