<template>
	<view class="content">
		<view class="avatar-box">
			<view class="inner-avatar" @click="chooseAvatar">
				<image v-if="userInfo.userAvatar!==null" :src="userInfo.userAvatar" mode="aspectFill"/>
				<image v-else src="../../static/ico/avatar.png" mode="aspectFill"/>
			</view>
		</view>
		<view class="top-empty">

		</view>
		<view class="register-box">
			<view class="form-item">
				<view class="item-title">
					昵称:
				</view>
				<view class="item-input">
					<input type="text" focus v-model="userInfo.userNick" placeholder="请输入用户名">
				</view>
			</view>
		</view>
		<view class="bottom-btn">
			<button class="submit-msg" @click="submitMsg()">确认修改</button>
			<button @click="goBack()">取 消</button>
		</view>
		
		<!-- 消息提示组件 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	const fs = require('fs');
	import {
		request,
		request_file,
		request_avatar
	} from '@/common/request.js'
	export default {
		data() {
			return {
				form: {
					nickname: "",

				},
				userId: 0,
				
				userInfo: {},

			}
		},
		onLoad() {
			this.userInfo = JSON.parse(uni.getStorageSync('userInfo'));
			this.oldMsg = JSON.parse(uni.getStorageSync('userInfo'));
			uni.$on('uAvatarCropper', path => {
				this.avatar = path;
				this.uploadFile(path);
			});
		},
		methods: {
			//返回主页
			goBack() {
				uni.navigateBack();
			},
			//上传文件
			async uploadFile(file) {
				let res=await request_avatar('/users/UploadFile', file);
				if (res.code !== 200) {
					this.$refs.uToast.show({
						title: '头像上传失败',
						type: 'error',
						// url:"pages/edit/edit"
					})
				} else {
					this.$refs.uToast.show({
						title: '头像上传成功',
						type: 'success',
						// url:"pages/edit/edit"
					})
					this.userInfo.userAvatar = res.data.fileInfo.url;
				}
			},
	
			//修改用户信息
			async submitMsg() {
				const res = await request('/users/ModifyUserInfo', {
					avatar:this.userInfo.userAvatar,
					nickname:this.userInfo.userNick
				});
				if (res.code !== 200) {
					this.$refs.uToast.show({
						title: '信息修改失败',
						type: 'error',
					})
				} else {
					uni.setStorageSync("userInfo", JSON.stringify(this.userInfo));
					console.log(this.userInfo)
					this.$refs.uToast.show({
						title: '信息修改成功',
						type: 'success',
						url: '/pages/mine/mine',
						isTab:true
					})
				
				}
			},
			//头像剪辑上传
			chooseAvatar() {
				this.$u.route({
					// 关于此路径，请见下方"注意事项"
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: 300,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: 200,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpg',
					}
				})
			},
			//上传文件的接口

		}
	}
</script>

<style lang="less">
	.content {
		width: 100%;
	}

	.top-empty {
		height: 20px;
	}

	.item-input input {
		color: #333;
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

	.avatar-box {
		width: 100%;
		height: 160px;
		display: flex;
		justify-content: center;
		align-items: center;

		.inner-avatar {
			width: 100px;
			height: 100px;
			overflow: hidden;
			border-radius: 6px;
			background: #888;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>