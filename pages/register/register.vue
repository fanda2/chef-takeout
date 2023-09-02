<template>
	<view class="content">
		<view class="top-empty">
			<image src="../../static/register.png" mode=""></image>
		</view>
		<view class="register-box">
			<view class="form-item">
				<view class="item-title">
					电话号码:
				</view>
				<view class="item-input">
					<input type="text" focus v-model="form.username" placeholder="请输入用户名(用于登录系统)">
				</view>
			</view>
			<view class="form-item">
				<view class="item-title">
					设置密码:
				</view>
				<view class="item-input">
					<input type="password" v-model="form.password" placeholder="请设置密码">
				</view>
			</view>
			<view class="form-item">
				<view class="item-title">
					确认密码:
				</view>
				<view class="item-input">
					<input type="password" v-model="form.confirmPassword" placeholder="请再次输入以确认密码">
				</view>
			</view>
		</view>
		<view class="bottom-btn">
			<button class="submit-msg" @click="registerBtn()">注 册</button>
			<button @click="goBack()">取 消</button>
		</view>
		<!-- 消息提示组件 -->
		<u-top-tips ref="uTips"></u-top-tips>
		
		<!-- 消息提示组件 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		request
	} from '@/common/request.js'
	export default {
		data() {
			return {
				form: {
					username: "",
					password: "",
					confirmPassword: "",
				},
			}
		},
		methods: {
			//返回主页
			goBack() {
				uni.navigateBack();
			},
			//带点击用户注册按钮
			registerBtn() {
				let flag = true;
				for (let i in this.form) {
					if (this.form[i] === "") {
						this.$refs.uToast.show({
							title: '请将信息填写完整！',
							type: 'warning',
						})
					}
				}
				if (flag) {
					if (this.form.password !== this.form.confirmPassword) {
						this.$refs.uToast.show({
							title:"两次密码输入不同，请重新输入！",
							type: 'warning',
						})
					} else {
						//调用注册接口进行注册
						this.register();
					}
				}
			},
			//用户注册
			async register() {
				const res = await request('/users/Registry', {
					username: this.form.username,
					password: this.form.password,
				});
				if (res.code !== 200) {
					this.$refs.uToast.show({
						title: `注册失败：${res.msg}`,
						type: 'error',
					})
				} else {
					this.$refs.uToast.show({
						title: `注册成功`,
						type: 'success',
						url:   "/pages/login/login",
					})
				}
			},
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
		height: 320px;
		display: flex;
		justify-content: center;

		image {
			width: 100%;
			height: 280px;
		}
	}

	.register-box {
		width: 90%;
		margin: 0 auto;

		.form-item {
			display: flex;
			height: 60px;
		}

		.item-title {
			width: 80px;
			color: #437535;
			font-weight: 550;
		}
	}

	.bottom-btn {
		width: 90%;
		margin: 20px auto;

		button {
			margin-top: 10px;
		}

		.submit-msg {
			background: #8fcc73;
			color: white;
		}
	}
</style>