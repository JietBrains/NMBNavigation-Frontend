import {get, post, del} from './apiConfig'

// 首页查看各地点图片
const viewAllPhotoOnMainPage = (data: any) => {
    return get('/search/photo', data)
}

//搜索一个地点的图片和信息
const searchOnePhoto = (data: any) => {
    return get('/search/place', data)
}

// 收藏
const uploadCollection = (data: any) => {
    return post('/collect/add', data)
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
    return del('/collect/delete', data)
}

// 上传评论
const uploadComment = (data: any) => {
    return post('/comment/upload', data)
}

// 查看一个地点的评论
const getComment = (data: any) => {
    return get('/comment/view', data)
}

// TODO: 图片上传



export {
    viewAllPhotoOnMainPage,
    searchOnePhoto,
    uploadCollection,
    uploadFeedback,
    getNavigation,
    getNearestNavigation,
    getAllCollection,
    deleteCollection,
    uploadComment,
    getComment
}