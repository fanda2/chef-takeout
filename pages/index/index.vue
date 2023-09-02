<template>
	<view class="content">
		<view class="search-box">
			<u-search :placeholder="placeholderText" v-model="searchKeyword" :show-action="true" @search="goSearch"
				@custom="goSearch" input-align="center"></u-search>
		</view>
		<view class="banner-box">
			<view class="banner-inner">
				<u-swiper :list="bannerList"></u-swiper>
			</view>
		</view>
		<view class="recommond-list">
			<view class="recommond-list-title">
				<view class="inner-text">
					每日推荐
				</view>
			</view>
			<view class="list-content">
				<view v-for="(item,index) in listData" :key="item.dishId" class="list-item"
					@click="goDetail(item.dishId)">
					<view class="nemu-cover">
						<view class="img-box">
							<image :src="item.dishImg" mode="aspectFill" alt="封面图">
						</view>
					</view>
					<view class="control-box">
						<view class="menuName-box">
							<view class="inner-box">
								{{item.dishName}}
							</view>
						</view>
						<view class="control-btn">
							<view class="like-btn item-btn" @click.stop="doLike(item,index)">
								<image v-show="!item.isLike" src="../../static/ico/like.png" mode="aspectFill"></image>
								<image v-show="item.isLike" src="../../static/ico/like_h.png" mode="aspectFill"></image>
							</view>
							<view class="collect-btn item-btn" @click.stop="doCollect(item,index)">
								<image v-show="!item.isCollect" src="../../static/ico/shord.png" mode="aspectFill"></image>
								<image v-show="item.isCollect" src="../../static/ico/shord_h.png" mode="aspectFill"></image>
							</view>
						</view>
					</view>
					<view class="introduce-box">
						<view class="inner-box">
							介绍：{{item.dishDesc}}
						</view>
					</view>
				</view>
			</view>
		</view>
			<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		request
	} from "../../common/request.js"
	export default {
		data() {
			return {
				bannerList: [],
				placeholderText: "搜索", //默认提示词
				searchKeyword: "", //搜索关键词

				queryInfo: {
					page: 1,
					size: 10
				},
				listData: []

			}
		},
		onLoad() {
			this.getBannerList();
			this.getDishList();
		},
		methods: {
			//进入详情页
			goDetail(val) {
				uni.navigateTo({
					url: `/pages/detail/detail?dishId=${val}`
				})
			},
			//进入信息搜索界面
			goSearch() {
				uni.navigateTo({
					url: `/pages/search/search?keyword=${this.searchKeyword}`
				})
			},
			//获取首页轮播图
			async getBannerList() {
				this.bannerList = [];
				const res = await request('/common/GetBannerList', {
					page: 1,
					size: 5
				});
				if (res.code !== 200) {
					this.$refs.uTips.show({
						title: '数据请求异常',
						type: 'warning',
						duration: '2000'
					})
				} else {
					let resArr = res.data.bannerList;
					resArr.forEach((item, index) => {
						this.bannerList.push(item.bannerUrl);
					})
				}
			},

			//获取菜品列表
			async getDishList(classifyId) {
				let result = await request("/common/GetDishList", {
					page: this.queryInfo.page,
					size: this.queryInfo.size,
					type:2
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: '数据获取失败：' + result.msg,
						type: 'error',
						url: '/pages/category/category'
					})
				} else {
					this.listData = result.data.dishList;
					this.listDataTotal = result.data.total;
				}
			},

			//执行收藏
			async doCollect(item,index) {
				let requestUrl="/users/CreateDishCollect";
				if(item.isCollect){
					requestUrl="/users/DeleteDishCollect";
				}
				let result = await request(requestUrl, {
					dishId: item.dishId
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: `收藏菜品失败：${result.msg}`,
						type: 'error',
					})
				} else {
					this.listData[index].isCollect=!item.isCollect;
					this.$refs.uToast.show({
						title: `操作成功：${result.msg}`,
						type: 'success',
					})
				}
			},
			//执行点赞
			async doLike(item,index) {
				let requestUrl="/users/CreateDishLike";
				if(item.isLike){
					requestUrl="/users/DeleteDishLike";
				}
				let result = await request(requestUrl, {
					dishId:  item.dishId
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: `操作信息失败：${result.msg}`,
						type: 'error',
					})
				} else {
						this.listData[index].isLike=!item.isLike;
					this.$refs.uToast.show({
						title: `操作成功：${result.msg}`,
						type: 'success',
					})
				}
			}

		}
	}
</script>

<style lang="less" scoped>
	.content {
		width: 100%;
		height: 100%;
	}

	// 搜索框
	.search-box {
		width: 90%;
		height: 40px;
		margin: 10px auto;
	}

	.banner-box {
		width: 100%;

		// height: 160px;
		.banner-inner {
			width: 90%;
			margin: 20px auto;
		}
	}

	//列表
	.recommond-list {
		width: 96%;
		margin: 10px auto;

		&-title {
			width: 100%;

			.inner-text {
				padding: 5px 10px;
				color: #333;
			}
		}

		.list-content {
			width: 100%;

			.list-item {
				width: 90%;
				margin: 10px auto;
				height: 240px;
				border: 1px solid #333;

				.nemu-cover {
					height: 140px;
					width: 100%;
					overflow: hidden;

					.img-box {
						height: 100%;
						width: 100%;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.img-box img {
						object-fit: cover;
					}
				}

				.control-box {
					display: flex;
					justify-content: space-between;

					.menuName-box {
						// height: 20px;
						font-size: 14px;
						width: 40%;
						margin-top: 5px;

						.inner-box {
							height: 30px;
							line-height: 30px;
							text-align: center;
							width: 80px;
							border-top: 1px solid #333;
							border-right: 1px solid #333;
						}

					}

					.control-btn {
						width: 30%;
						display: flex;
						justify-content: space-around;

						.item-btn {
							width: 50px;
							height: 30px;
							display: flex;
							align-items: center;
							justify-content: center;

							image {
								margin-top: 5px;
								width: 24px;
								height: 24px;
							}
						}
					}
				}


				.introduce-box {
					border-top: 1px solid #333;

					.inner-box {
						text-align: center;
					}
				}
			}
		}
	}
</style>