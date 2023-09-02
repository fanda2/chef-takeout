<template>
	<view class="content">
		<view class="avatar-box">
			<view v-if="isChef" class="chef-ico">
				认证厨师
			</view>
			<view class="inner-avatar">
				<image v-if="userInfo.userAvatar" :src="userInfo.userAvatar" mode="aspectFill" />
				<image v-else src="../../static/ico/avatar.png" mode="aspectFill" />
			</view>
		</view>
		<view class="login-btn">
			<view v-if="!isLogin" class="btn-box" @click="goLogin">
				登录/注册
			</view>
			<view v-else class="btn-box" @click="goEdit">
				修改用户信息
			</view>
		</view>
		<view class="order-list">
			<view class="order-list-title">
				我的订单
			</view>
			<view class="order-list-content">
				<view class="list-item" @click="goOrder(0)">
					<view class="item-ico">
						<image src="../../static/ico/pay.png" mode="aspectFill" alt="待付款"></image>
					</view>
					<view class="item-text">
						待付款
					</view>
				</view>
				<view class="list-item" @click="goOrder(1)">
					<view class="item-ico">
						<image src="../../static/ico/historyOrder.png" mode="aspectFill" alt="待付款"></image>
					</view>
					<view class="item-text">
						历史订单
					</view>
				</view>
				<view class="list-item" @click="goOrder(2)">
					<view class="item-ico">
						<image src="../../static/ico/comment.png" mode="aspectFill" alt="待付款"></image>
					</view>
					<view class="item-text">
						评价
					</view>
				</view>
				<view class="list-item" @click="goOrder(3)">
					<view class="item-ico">
						<image src="../../static/ico/repay.png" mode="aspectFill" alt="待付款"></image>
					</view>
					<view class="item-text">
						退款售后
					</view>
				</view>
			</view>
		</view>
		<view class="control-list">
			<view class="list-item" @click="goCollect">
				<view class="left-ico">
					<image src="../../static/ico/shord.png" mode="aspectFill" alt="头像" />
				</view>
				<view class="right-text">
					我的收藏
				</view>
			</view>
			<view class="list-item" @click="goAddDish">
				<view class="left-ico">
					<image src="../../static/ico/send.png" mode="aspectFill" alt="头像" />
				</view>
				<view class="right-text">
					美食发布
				</view>
			</view>
			<view class="list-item" @click="goChatList">
				<view class="left-ico">
					<image src="../../static/ico/chat.png" mode="aspectFill" alt="头像" />
				</view>
				<view class="right-text">
					聊天
				</view>
			</view>
			<view v-if="isChef" class="list-item" @click="goChefMange">
				<view class="left-ico">
					<image src="../../static/ico/chef.png" mode="aspectFill" alt="头像" />
				</view>
				<view class="right-text">
					厨师信息管理
				</view>
			</view>
		</view>
		<view v-if="isLogin" class="unlogin-btn">
			<view class="btn-box" @click="unLoginBtn">
				退出登录
			</view>
		</view>
		<!-- 消息提示组件 -->
		<u-top-tips ref="uTips"></u-top-tips>
		<!-- 模态框 -->
		<u-modal v-model="dialogShow" :content="content" :mask-close-able="true" @confirm="modelConfirm"
			:show-cancel-button="true"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 用户是否已登录
				isLogin: false,
				//模态框内容
				dialogShow: false,
				content: "",

				userInfo: {},
				isChef: false,
			
			}
		},
		onShow() {
			//获取用户信息
			this.userInfo = uni.getStorageSync("userInfo") !== "" ? JSON.parse(uni.getStorageSync("userInfo")) : "";
			if (this.userInfo !== "" && this.userInfo.userId !== 0) {
				this.isLogin = true;
			};
		},
		created() {
			//检查是否是厨师
			this.isChef = this.checkChef();
		},
		methods: {
			//进入登录页面
			goLogin() {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			},
			//进入信息编辑界面
			goEdit() {
				uni.navigateTo({
					url: "/pages/edit/edit"
				})
			},
			//进入厨师信息管理页面
			goChefMange(){
			   this.checkLogin("/pages/chefManage/chefManage");
			},
			//模态框确认按钮
			modelConfirm() {
				if (this.isLogin) {
					uni.clearStorageSync();
					this.$router.go(0);
					this.isLogin = false;
				} else {
					this.goLogin();
				}
			},
			//进入待付款订单
			goOrder(val) {
				this.checkLogin(`/pages/order/order?tabType=${val}`)
			},
			//进入聊天列表
			goChatList() {
				console.log("进入");
				this.checkLogin('/pages/chatList/chatList');
			},
			//进入美食发布
			goAddDish() {
				this.checkLogin('/pages/shareFood/shareFood?userType=2');
			},
			//进入我的收藏
			goCollect() {
				this.checkLogin(`/pages/collect/collect`);
			},
			//判断用户是否登录,登入之后执行跳转
			checkLogin(url) {
				if (this.isLogin) {
					uni.navigateTo({
						url: url
					})
				} else {
					this.dialogShow = true;
					this.content = "当前未登录，是否前往登录？"
				}

			},
			//退出登录按钮
			unLoginBtn() {
				this.dialogShow = true;
				this.content = "是否确认退出登录？";
			},
			//检测是不是厨师
			checkChef() {
				let userInfo = uni.getStorageSync("userInfo") ? JSON.parse(uni.getStorageSync("userInfo")) : "";
				let chefInfo = '';
				let flag = false;
				if (userInfo !== '') {
					if ( userInfo.chefInfo !== ''&& userInfo.chefInfo!==null) {
						flag = true;
					} else {
						flag = false;
					}
				} else {
					flag = false;
				}
				return flag;
			}

		}
	}
</script>

<style lang="less" scoped>
	.content {
		width: 100%;
		height: 100%;
	}

	.avatar-box {
		width: 100%;
		height: 160px;
		margin-top: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
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
		.chef-ico{
			position: absolute;
			width: 160px;
			height: 40px;
			line-height: 40px;
			color: orange;
			font-size: 38rpx;
			text-align: center;
			letter-spacing: 3rpx;
			background: white;
			box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
			top: -5px;
			z-index: 10;
			border-radius: 20px;
			border: 1px solid #ccc;
		}
	}

	.login-btn {
		height: 80px;

		.btn-box {
			width: 60%;
			margin: 0 auto;
			height: 50px;
			text-align: center;
			line-height: 50px;
			border-radius: 25px;
			font-size: 18px;
			border: 1px solid #ccc;
		}
	}

	.control-list {
		width: 90%;
		margin: 0 auto;

		.list-item {
			display: flex;
			height: 60px;
			margin-top: 5px;
			border-bottom: 1px solid #333;

			.left-ico {
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 45px;
					height: 45px;
				}
			}

			.right-text {
				line-height: 60px;
				padding: 0 20px;
				font-size: 16px;

			}
		}
	}

	.order-list {
		&-title {
			width: 100%;
			height: 40px;
			line-height: 40px;
			box-sizing: border-box;
			padding: 5px 10px;
			margin: 0 auto;
			font-weight: bold;
			font-size: 18px;
		}

		&-content {
			width: 96%;
			margin: 0 auto;
			display: flex;
			justify-content: space-around;

			.list-item {
				width: 20%;
				height: 80px;

				.item-ico {
					display: flex;
					justify-content: center;
					align-items: center;

					image {
						width: 40px;
						height: 40px;
					}
				}

				.item-text {
					height: 30px;
					line-height: 30px;
					text-align: center;
				}
			}
		}
	}

	.unlogin-btn {
		margin-top: 20px;
		height: 80px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		.btn-box {
			width: 90%;
			height: 50px;
			line-height: 50px;
			border-radius: 25px;
			font-size: 18px;
			letter-spacing: 2px;
			text-align: center;
			color: #333;
			border: 1px solid #333;
		}
	}
</style>