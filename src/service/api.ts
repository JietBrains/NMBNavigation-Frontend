import Taro from '@tarojs/taro'

export const wxLogin = (data: {
    code: string
    nickName: string
    avatarUrl: string
}) => {
    return Taro.request({
        url: 'http://your-server.com/api/login',
        method: 'POST',
        data,
    })
}