import {get, post, del, queryPost, queryDel, comfirmedGet} from './apiConfig'

// 首页查看各地点图片
const viewAllPhotoOnMainPage = (data: any) => {
    return get('/images/view', data)
}

//搜索一个地点的图片和信息
const searchPhotos = (data: any) => {
    return get('/images/search', data)
}

// 收藏
const uploadCollection = (data: any) => {
    return queryPost('/collect/add', data)
}

// 查看某个用户是否收藏了某个地点
const collectJudgement = (data: any) => {
    return get('/collect/judgement', data)
}

//上传反馈信息

const uploadFeedback = (data: any) => {
    return post('/upload/feedback', data)
}

// 导航
const getNavigation = (data: any) => {
    return get('/navigation/target', data)
}

// 导航至最近的目标
const getNearestNavigation = (data: any) => {
    return get('/navigation/nearest', data)
}

// 查看收藏
const getAllCollection = (data: any) => {
    return get('/collect/getAll', data)
}

// 删除收藏
const deleteCollection = (data: any) => {
    return queryPost('/collect/delete', data)
}

// 上传评论
const uploadComment = (data: any) => {
    console.log(data)
    return queryPost('/comment/upload', data)
}

// 查看一个地点的评论
const getComment = (data: any) => {
    return get('/comment/view', data)
}

// TODO: 图片上传

// 置顶收藏
const topCollection = (data: any) => {
    return queryPost('/collect/top', data)
}

// 搜索保存历史记录
const saveSearchHistory = (data: any) => {
    console.log(data)
    return queryPost('/search/save', data)
}

// 获取当前用户的搜索记录
const loadSearchHistory = (data: any) => {
    return get('/search/get', data)
}

// 清空本用户的历史记录
const clearSearchHistory = (data: any) => {
    return del('/search/delete', data)
}

const login = (data: any) => {
    return post('/user/login', data)
}

const checkLogin = () => {
    return get('/user/checkLogin')
}

const getOpenId = (data: any) => {
    return comfirmedGet("https://api.weixin.qq.com/sns/jscode2session", data)
}

const getUserInfo = () => {
    return get('/user/getInfo', {})
}

const updateInfo = (data: any) => {
    return queryPost('/user/updateInfo', data)
}

export {
    viewAllPhotoOnMainPage,
    searchPhotos,
    uploadCollection,
    uploadFeedback,
    getNavigation,
    getNearestNavigation,
    getAllCollection,
    deleteCollection,
    uploadComment,
    getComment,
    collectJudgement,
    topCollection,
    saveSearchHistory,
    loadSearchHistory,
    clearSearchHistory,
    login,
    checkLogin,
    getOpenId,
    getUserInfo,
    updateInfo
}
