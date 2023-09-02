<template>
	<view class="content">
		<view v-if="listData.length!==0" class="collect-list">
			<view v-for="(item,index) in listData" :key="item.dishInfo.dishId" class="list-item"
				@click="goDetail(item.dishId)">
				<view class="collect-left">
					<view class="cover-img">
						<image :src="item.dishInfo.dishImg" alt="封面图" mode="aspectFill"/>
					</view>
				</view>
				<view class="collect-right">
					<view class="dish-name">
						{{item.dishInfo.dishName}}
					</view>
					<view class="dish-desc">
						介绍：{{item.dishInfo.dishDesc}}
					</view>
					<view class="collect-time">
						收藏于：{{item.dishLikeUpdateTime}}
					</view>
				</view>
			</view>
		</view>
		<view v-else v-show="!loading" class="empty-box">
			<view class="show-box">
				<view class="empty-img">
					<image src="../../static/empty.png" mode=""></image>
				</view>
				<view class="empty-text">
					内容为空
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
		request
	} from '@/common/request.js'
	export default {
		data() {
			return {
				queryInfo: {
					page: 1,
					size: 10
				},
				listData: [],
				total: 0,

				//加载动画
				loading: false
			}
		},
		onLoad() {
			this.getCollectList();
		},
		methods: {
			//获取收藏信息列表
			async getCollectList() {
				this.loading = true;
				let res = await request("/users/GetUserCollectList", {
					page: this.queryInfo.page,
					size: this.queryInfo.size
				})
				this.loading = false;
				if (res.code !== 200) {
					this.$refs.uToast.show({
						title: `错误：${res.msg}`,
						type: 'error',
					})
				} else {
					this.listData = res.data.collectList;
					this.total = res.data.total;
				}
			},
			//进入详情页
			goDetail(val) {
				uni.navigateTo({
					url: `/pages/detail/detail?dishId=${val}`
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.collect-list {
		width: 96%;
		margin: 0 auto;

		.list-item {
			width: 96%;
			margin: 6px auto;
			padding: 6px;
			height: 120px;
			border: 1px solid #888;
			display: flex;
			justify-content: space-between;
			border-radius: 6px;
			.collect-left {
				width: 28%;
				display: flex;
				justify-content: center;
				align-items: center;
				.cover-img{
					width: 100px;
					height: 80px;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.collect-right{
				width: 70%;
				padding: 6px 4px;
				color:#333;
				.dish-name{
					width:100%;
					font-size: 16px;
					font-weight: 550;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.dish-desc{
					min-height: 40px;
					margin: 6px auto;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					/*没置超出部分显示省略号 */
					overflow: hidden;
					text-overflow: ellipsis;
					
				}
				.collect-time{
					font-size: 12px;
					text-align: right;
				}
			}
		}
	}

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