<template>
	<view class="content">
		<u-navbar :is-back="true" title="">
			<view class="slot-wrap">
				<view class="select-btn" @click="pickerShow=true">
					{{userInfo.userNick}}
				</view>
			</view>
		</u-navbar>
		<view class="chat">
			<scroll-view :style="{height: `${windowHeight}rpx`}" id="scrollview" scroll-y="true" :scroll-top="scrollTop"
				:scroll-with-animation="true" class="scroll-view">
				<!-- 聊天主体 -->
				<view id="msglistview" class="chat-body">
					<!-- 聊天记录 -->
					<view v-for="(item,index) in msgList" :key="index">
						<!-- 自己发的消息 -->
						<view  class="item self" v-if="item.senderId==myInfo.userId">
							<!-- 文字内容 -->
							<view class="content right">
								{{item.messageContent}}
							</view>
							<!-- 头像 -->
							<view class="avatar">
								<image :src="myInfo.userAvatar" mode="aspectFill"></image>
							</view>
						</view>
						<!-- 机器人发的消息 -->
						<view class="item Ai"  v-else>
							<!-- 头像 -->
							<view class="avatar">
								<image :src="userInfo.userAvatar" mode="aspectFill"></image>
							</view>
							<!-- 文字内容 -->
							<view class="content left">
								{{item.messageContent}}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 底部消息发送栏 -->
			<!-- 用来占位，防止聊天消息被发送框遮挡 -->
			<view class="chat-bottom">
				<view class="send-msg">
					<view class="uni-textarea">
						<textarea v-model="chatMsg" maxlength="300" :show-confirm-bar="false" auto-height></textarea>
					</view>
					<button @click="handleSend" class="send-btn">发送</button>
				</view>
			</view>
		</view>
		<!-- 消息提示组件 -->
		<u-toast ref="uToast" />
		<!-- 加载动画 -->
		<zero-loading v-if="loading"></zero-loading>
	</view>
</template>

<script>
	import {
		BASE_SOCKETURL
	} from '@/config.js'
	import io from '../../js_sdk/hyoga-uni-socket_io/uni-socket.io.js';
	import {
		request
	} from "../../common/request.js"
	const socket = io(BASE_SOCKETURL, {
		query: {},
		transports: ['websocket', 'polling'],
		timeout: 5000,
	});
	export default {
		data() {
			return {
				//滚动距离
				scrollTop: 0,
				userId: '',
				userInfo: {},
				myInfo: {},
				loading: false,
				//发送的消息
				chatMsg: "",
				queryInfo:{
					page:1,
					size:10
				},
				msgList: []
			}
		},
		computed: {
			windowHeight() {
				return this.rpxTopx(uni.getSystemInfoSync().windowHeight)
			}
		},
		onLoad(option) {
			let token = uni.getStorageSync("token");
			socket.on('connect', () => {
				console.log('ws 已连接');
				socket.emit("register", token);
				// const {
				// 	id
				// } = socket;
			});
			this.userId = option.userId;
			let userId = option.userId;
			this.getUserInfo();
			this.getChatData();
			this.myInfo = JSON.parse(uni.getStorageSync("userInfo"));
	
			socket.on("private-message", (userId, message) => {
				// 收到服务器推送的消息，可以跟进自身业务进行操作
				console.log('ws 收到服务器消息：',message );
			
			});
			//检查登录结果
			socket.on("register-res",(status)=>{
				console.log("登录结果", status);
			});
			//监听发送失败
			socket.on("send-fail",(msg)=>{
				console.log("发送失败",msg)
			});
		},
		methods: {
			// px转换成rpx
			rpxTopx(px) {
				let deviceWidth = uni.getSystemInfoSync().windowWidth;
				let rpx = (750 / deviceWidth) * Number(px);
				return Math.floor(rpx);
			},
			// 发送消息
			handleSend() {
				//如果消息不为空
				if (!this.chatMsg || !/^\s+$/.test(this.chatMsg)) {
					let obj = {
					 messageContent:this.chatMsg,
					 receiverId:this.userId,
					 senderId:this.myInfo.userId
					};
					// 主动向服务器发送数据
					let receiveUserId = this.userId;
					socket.emit("private-message", receiveUserId, this.chatMsg);
					this.msgList.push(obj);
					this.chatMsg = '';
				} else {
					this.$refs.uToast.show({
						title: `不能发送空白消息`,
						type: 'warning',
					})
				}
			},
			//获取聊天数据
			async getUserInfo() {
				let res = await request("/common/GetUserBasicInfo", {
					userId: this.userId
				})
				if (res.code !== 200) {
					this.$refs.uToast.show({
						title: `错误：${res.msg}`,
						type: 'error',
					})
				} else {
					this.userInfo = res.data.userInfo;
				}
			},
			//获取用户信息
			async getChatData() {
				let res = await request("/users/GetMessageList", {
					page:this.queryInfo.page,
					size:this.queryInfo.size,
					receiverId:this.userId
				})
				if (res.code !== 200) {
					this.$refs.uToast.show({
						title: `错误：${res.msg}`,
						type: 'error',
					})
				} else {
					this.msgList = res.data.messageList;
					this.total=res.data.tatal;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	$chatContentbgc: #C2DCFF;
	$sendBtnbgc: #4F7DF5;

	view,
	button,
	text,
	input,
	textarea {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	/* 聊天消息 */
	.chat {
		.scroll-view {
			::-webkit-scrollbar {
				display: none;
				width: 0 !important;
				height: 0 !important;
				-webkit-appearance: none;
				background: transparent;
				color: transparent;
			}

			// background-color: orange;
			background-color: #F6F6F6;

			.chat-body {
				display: flex;
				flex-direction: column;
				padding-top: 23rpx;
				// background-color:skyblue;

				.self {
					justify-content: flex-end;
				}

				.item {
					display: flex;
					padding: 23rpx 30rpx;
					// background-color: greenyellow;

					.right {
						background-color: $chatContentbgc;
					}

					.left {
						background-color: #FFFFFF;
					}

					// 聊天消息的三角形
					.right::after {
						position: absolute;
						display: inline-block;
						content: '';
						width: 0;
						height: 0;
						left: 100%;
						top: 10px;
						border: 12rpx solid transparent;
						border-left: 12rpx solid $chatContentbgc;
					}

					.left::after {
						position: absolute;
						display: inline-block;
						content: '';
						width: 0;
						height: 0;
						top: 10px;
						right: 100%;
						border: 12rpx solid transparent;
						border-right: 12rpx solid #FFFFFF;
					}

					.content {
						position: relative;
						max-width: 486rpx;
						border-radius: 8rpx;
						word-wrap: break-word;
						padding: 24rpx 24rpx;
						margin: 0 24rpx;
						border-radius: 5px;
						font-size: 32rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #333333;
						line-height: 42rpx;
					}

					.avatar {
						display: flex;
						justify-content: center;
						width: 78rpx;
						height: 78rpx;
						background: $sendBtnbgc;
						border-radius: 8rpx;
						overflow: hidden;

						image {
							width: 100%;
							height: 100%;
							align-self: center;
						}

					}
				}
			}
		}

		/* 底部聊天发送栏 */
		.chat-bottom {
			width: 100%;
			height: 177rpx;
			background: #F4F5F7;

			.send-msg {
				display: flex;
				align-items: flex-end;
				padding: 16rpx 30rpx;
				width: 100%;
				min-height: 177rpx;
				position: fixed;
				bottom: 0;
				background: #EDEDED;
			}

			.uni-textarea {
				padding-bottom: 70rpx;

				textarea {
					width: 537rpx;
					min-height: 75rpx;
					max-height: 500rpx;
					background: #FFFFFF;
					border-radius: 8rpx;
					font-size: 32rpx;
					font-family: PingFang SC;
					color: #333333;
					line-height: 43rpx;
					padding: 5rpx 8rpx;
				}
			}

			.send-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 70rpx;
				margin-left: 25rpx;
				width: 128rpx;
				height: 75rpx;
				background: $sendBtnbgc;
				border-radius: 8rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 28rpx;
			}
		}
	}
</style>