<template>
	<view class="content">
		<view class="search-box">
			<u-search :placeholder="placeholderText" v-model="searchKeyword" :show-action="true" @search="searchList"
				@custom="searchList" input-align="center"></u-search>
		</view>
		<!-- 搜索列表 -->
		<view class="content-list">
			<scroll-view v-if="listData.length!=0" scroll-y="true" class="scroll-right">
				<view class="content-list">
					<view v-for="(item,index) in listData" :key="item.dishId" class="content-item"
						@click="goDetail(item.dishId)">
						<view class="cover-box">
							<image :src="item.dishImg" alt="封面图" mode="aspectFill" />
						</view>
						<view class="menu-name">
							{{item.dishName}}
						</view>
					</view>
				</view>
			</scroll-view>
			<view v-else class="empty-box">
				<view class="show-box">
					<view class="empty-img">
						<image src="../../static/empty.png" mode="scaleToFill"></image>
					</view>
					<view class="empty-text">
						内容为空
					</view>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
		<!-- 加载动画 -->
		<zero-loading type="radar" v-if="loading"></zero-loading>
	</view>
</template>

<script>
	import {
		request
	} from "../../common/request.js"
	export default {
		data() {
			return {
				searchKeyword: "",
				listData: [],
				placeholderText: "请输入菜品名称",
				queryInfo: {
					page: 1,
					size: 10
				},
				loading:false,
			}
		},
		onLoad(option) {
			//获得其他页面传递过来的关键值
			this.searchKeyword = option.keyword;
			this.searchList();
		},
		methods: {
			//进入详情页
			goDetail(val) {
				uni.navigateTo({
					url: `/pages/detail/detail?dishId=${val}`
				})
			},
			//执行搜索内容
			async searchList() {
				this.loading=true;
				let result = await request("/common/GetDishList", {
					page: this.queryInfo.page,
					size: this.queryInfo.size,
					keyword: this.searchKeyword,
					type: 0,
				})
				this.loading=false;
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: '数据获取失败：' + result.msg,
						type: 'error',
					})
				} else {
					this.listData = result.data.dishList;
					this.listDataTotal = result.data.total;
				}
			}

		}
	}
</script>

<style lang="less" scoped>
	.content-list {
		width: 98%;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;


		.content-list {
			width: 98%;
			margin: 0 auto;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.content-item {
				height: 140px;
				width: 46%;
				margin-top: 10px;
				border: 1px solid #ccc;

				.cover-box {
					width: 100%;
					height: 110px;
					overflow: hidden;

					image {
						height: 110px;
						width: 100%;
					}
				}

				.menu-name {
					text-align: center;
					height: 30px;
					line-height: 30px;
					font-size: 24rpx;
				}
			}

			.content-item:first-child,
			.content-item:nth-child(2) {
				margin-top: 0;
			}
		}
	}

	// 搜索框
	.search-box {
		width: 90%;
		height: 40px;
		margin: 10px auto;
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