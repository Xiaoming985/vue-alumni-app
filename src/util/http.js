import axios from 'axios'

// get请求
export const get = (url, params = {}, headers = {}) => {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params,
            headers
        }).then(res => {
            if (res.status == 200) {
                resolve(res.data)
            } else {
                reject(res.data)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

// post请求
export const post = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        axios.post(url, params).then(res => {
            if (res.status == 200) {
                resolve(res.data)
            } else {
                reject(res.data)
            }
        }).catch(err => {
            reject(err)
        })
    })
}