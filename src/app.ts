import { createApp } from 'vue'
import {setupStore} from './stores/index'
import './app.scss'


const App = createApp({
  onShow(options) {
  },
})
setupStore(App)

export default App
