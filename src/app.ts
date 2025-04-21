import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Icon  from '@nutui/nutui-taro'


import './app.scss'
import '@nutui/nutui-taro/dist/style.css'

const App = createApp({
  onShow(options) {
  },
})

App.use(createPinia())
App.use(Icon)

export default App
