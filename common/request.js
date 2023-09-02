import {
	BASE_URL
} from '@/config.js'


export function request(url, data = {}, method = 'POST') {
	const token = uni.getStorageSync("token");
	let headers = {};
	if (token) {
		headers = {
			...headers,
			authorization: token
		};
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${BASE_URL}${url}`,
			header: headers,
			data: data,
			method: method,
			success: res => {

				if (res.data.code === 403 || res.data.code === 403) {
					// 当返回的状态码为401时，表示token过期，跳转登录页
					uni.reLaunch({
						url: '/pages/login/login',
					});
				} else {
					resolve(res.data)
				}

			},
			fail: err => {
				reject(err)
			}
		})
	})
};

export function request_avatar(url, data = {}, method = 'POST') {
	const token = uni.getStorageSync("token");
	let headers = {};
	if (token) {
		headers = {
			...headers,
			authorization: token
		};
	}
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: `${BASE_URL}${url}`,
			header: headers,
			filePath: data,
			name: 'file',
			success: res => {
				resolve(JSON.parse(res.data))
			},
			fail: err => {
				reject(err)
			}
		})
	})
};