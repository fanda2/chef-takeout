<template>
	<view class="content">
		<view class="top-empty">
			<image src="../../static/login.png" mode=""></image>
		</view>
		<view class="login-form">
			<view class="form-item item1">
				<view class="label">
					<text>手机号码:</text>
				</view>
				<input type="text" focus v-model="username" placeholder="请输入手机号">
			</view>
			<view class="form-item item1">
				<view class="label">
					<view>密&nbsp;码:</view>
				</view>
				<input type="password" v-model="password" placeholder="请输入密码">
			</view>
			<view class="bottom-btn">
				<button @click="doLogin" class="do-login">登 录</button>
				<button @click="goBack" class="cancle">取 消</button>
			</view>
		</view>
		<view class="bottom-notify">
			<view class="register-btn" @click="goRegister()">
				还没账号？点击注册
			</view>
		</view>

		<!-- 消息提示组件 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		request
	} from '@/common/request.js'
	import w_md5 from "../../js_sdk/zww-md5/w_md5.js"
	export default {
		data() {
			return {
				username: "",
				password: "",
			}
		},
		methods: {
			//返回主页
			goBack() {
				uni.navigateBack();
			},
			//进入注册页面
			goRegister() {
				uni.navigateTo({
					url: "/pages/register/register"
				})
			},
			//进行登录操作
			async doLogin() {
				if (this.username != "" && this.password != "") {
					const res = await request('/users/Login', {
						username: this.username,
						password: w_md5.hex_md5_32Upper(this.password)
					});
					if (res.code !== 200) {
						this.$refs.uToast.show({
							title: `登录失败：${res.msg}`,
							type: 'error',
						})
					} else {
						this.$refs.uToast.show({
							title: `登录成功`,
							type: 'success',
							url:  "/pages/mine/mine",
							isTab:true
						})
						uni.setStorageSync('token', res.data.token);
						await this.getUserInfo();
					}
				} else {
					this.showNotify("warn", "请输入用户名或密码后重试")
				}
			},

			//调用查询个人信息接口
			async getUserInfo() {
				await request('/users/GetUserInfo').then(res => {
					if (res.code !== 200) {
						return this.$refs.uTips.show({
							title: `错误：${res.msg}`,
							type: 'error',
						})
					} else {
						uni.setStorageSync('userInfo', JSON.stringify(res.data.userInfo))
					}
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="less">
	.content {
		width: 100%;
	}

	.top-empty {
		width: 96%;
		margin: 0 auto;
		height: 300px;
		display: flex;
		justify-content: center;

		image {
			width: 100%;
			height: 280px;
		}
	}

	.login-form {
		width: 90%;
		margin: 0px auto;
		background: #ffffff;
		padding: 20px 10px;
		border-radius: 6px;
		border: 1px solid #e6e6e6;

		.form-item {
			display: flex;
			height: 50px;
			margin-top: 20px;

			.label {
				height: 50px;
				width: 80px;
				display: flex;
				font-size: 16px;
				font-weight: bold;
				color: #444;
				justify-content: flex-start;
				align-items: flex-end;

				div {
					height: 10px;
				}
			}

			input {
				height: 40px;
				margin-top: 10px;
				width: 80%;
				border-bottom: 1px solid #ccc;
			}
		}

		.bottom-btn {
			margin-top: 40px;
		}

		.bottom-btn button {
			margin-top: 20px;
			width: 240px;
		}

		.cancle:hover {
			background: #c8c8c8;
		}

		.do-login {
			background: #8fcc73;
			color: white;
		}
	}

	.bottom-notify {
		cursor: pointer;
		width: 100%;
		height: 60px;
		line-height: 60px;
		text-align: center;
		color: blue;
	}

	.register-btn {
		width: 40%;
		margin: 0 auto;
	}

	.register-btn:hover {
		text-decoration: underline;
	}
</style>