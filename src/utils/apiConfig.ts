import Taro from '@tarojs/taro';

// 定义基础的请求配置
const baseConfig = {
    baseUrl: process.env.USE_MOCK? process.env.API_MOCK_URL : process.env.API_BASE_URL, // API 基础 URL
    timeout: 10000, // 请求超时时间，单位为毫秒
    header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Taro.getStorageSync('token')}`, // 从本地存储中获取 token
    }
};

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// 定义请求函数
function request({
    url,
    method: methodParam = 'GET' as RequestMethod,
    data = {},
    header = {}
}: {
    url: string;
    method?: RequestMethod;
    data?: Record<string, any>;
    header?: Record<string, string>;
}) {
    return new Promise((resolve, reject) => {
        Taro.request({
            url: baseConfig.baseUrl + url,
            method: methodParam,
            data,
            header: {
                ...baseConfig.header,
                ...header
            },
            timeout: baseConfig.timeout,
            success: (res) => {
                const { statusCode, data } = res;
                if (statusCode >= 200 && statusCode < 300) {
                    resolve(data);
                } else {
                    reject(new Error(`请求失败，状态码: ${statusCode}`));
                    console.log('url:' + url);
                }
            },
            fail: (err) => {
                reject(new Error(`请求出错: ${err.errMsg}`));
            }
        });
    });
}

// 辅助函数：将对象转换为查询字符串
function objectToQueryString(obj: Record<string, any>) {
    return Object.entries(obj)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
}



// 定义 GET 请求
function get(url: string, data?: Record<string, any>, header?: Record<string, string>) {
    // 如果有数据，则将其转换为查询字符串
    if (data) {
        const queryString = objectToQueryString(data);
        url = `${url}?${queryString}`;
    }
    return request({
        url,
        method: 'GET',
        data: {}, // 由于参数已经在 URL 里，这里的 data 置为空
        header
    });
}

// 定义 POST 请求
function post(url: string, data?: Record<string, any>, header?: Record<string, string>) {
    return request({
        url,
        method: 'POST',
        data,
        header
    });
}

// 定义 PUT 请求
function put(url: string, data?: Record<string, any>, header?: Record<string, string>) {
    return request({
        url,
        method: 'PUT',
        data,
        header
    });
}

// 定义 DELETE 请求
function del(url: string, data?: Record<string, any>, header?: Record<string, string>) {
    return request({
        url,
        method: 'DELETE',
        data,
        header
    });
}

// 导出请求函数
export {
    get,
    post,
    put,
    del
};