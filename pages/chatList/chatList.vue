<template>
	<view class="content">
		<view v-if="listData.length!==0" class="chat-list">
			<uni-list>
				<uni-list :border="true">
					<uni-list-chat :title="item.receiverInfo.userNick" v-for="(item,index) in listData" :avatar="item.receiverInfo.userAvatar"
						:note="item.chatLastMessage" :time="item.chatUpdateTime" badge-text=""
						:badge-style="{backgroundColor:'#FF80AB'}" :clickable="true" @click="goChat(item.receiverInfo.userId)"></uni-list-chat>
				</uni-list>
			</uni-list>
		</view>
		<view v-else v-show="!loading" class="empty-box">
			<view class="show-box">
				<view class="empty-img">
					<image src="../../static/empty.png" mode="scaleToFill"></image>
				</view>
				<view class="empty-text">
					聊天列表为空
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
		<!-- 加载动画 -->
		<zero-loading v-if="loading"></zero-loading>
	</view>
</template>

<script>
	import {
		request
	} from "../../common/request.js"
	export default {
		data() {
			return {
				listData: [],
				queryInfo: {
					page: 1,
					size: 10
				},
				loading:false,
			}
		},
		onLoad() {
			this.getChatList();
		},
		methods: {
			//获取聊天列表
			async getChatList() {
				this.loading=true;
				let res = await request("/users/GetChatList", {
					page: this.queryInfo.page,
					size: this.queryInfo.size
				})
				this.loading=false;
				if (res.code !== 200) {
					this.$refs.uToast.show({
						title: `错误：${res.msg}`,
						type: 'error',
					})
				} else {
					this.listData = res.data.chatList;
					this.total = res.data.total;
				}
			},
			//进入聊天页面
			goChat(Id){
				console.log("ddd")
				uni.navigateTo({
					url:`/pages/chat/chat?userId=${Id}`,
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.empty-box {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;

		.show-box {
			margin-top: 200px;
			width: 180px;
			height: 180px;

			.empty-img {
				width: 180px;
				height: 120px;
				display: flex;
				justify-content: center;

				image {
					width: 100px;
					height: 100px;
				}

			}

			.empty-text {
				height: 40px;
				line-height: 40px;
				text-align: center;
				color: #888;
			}
		}
	}
</style>