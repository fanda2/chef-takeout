<template>
	<view class="content">
		<view class="menu-list">
			<view class="cover-box">
				<image :src="dishData.dishImg" mode="aspectFill"></image>
			</view>
			<view class="food-name">
				<view class="inner-box">
					{{dishData.dishName}}
				</view>
			</view>
			<view class="food-material">
				<view class="left-top">
					材料
				</view>
				<view class="inner-box">
					准备材料：{{dishData.dishMaterial}}
				</view>
			</view>
			<view class="food-step">
				<view class="step-title">
					<view class="inner-box">
						制作步骤
					</view>
				</view>
				<view v-for="(item,index) in dishStep" :key="index" class="step-item">
					<view class="left-top">
						步骤 {{NumberToChinese(index+1)}}
					</view>
					<view class="step-img">
						<image :src="item.imgUrl" mode="scaleToFill"></image>
					</view>
					<view class="step-content">
						步骤说明：{{item.describe}}
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-btn">
			<view class="btn-item ">
				<view class="dish-ico">
					<view class="inner-btn" @click="doLike(dishData.isLike)">
						<image v-show="!dishData.isLike" src="../../static/ico/like.png" mode="aspectFill"></image>
						<image v-show="dishData.isLike" src="../../static/ico/like_h.png" mode="aspectFill"></image>

					</view>
				</view>
				<view class="dish-count">
					{{dishData.dishLike}}
				</view>

			</view>
			<view class="btn-item">
				<view class="dish-ico">
					<view class="inner-btn" @click="doCollect(dishData.isCollect)">
						<image v-show="!dishData.isCollect" src="../../static/ico/shord.png" mode="aspectFill"></image>
						<image v-show="dishData.isCollect" src="../../static/ico/shord_h.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="dish-count">
					{{dishData.dishCollect}}
				</view>
			</view>
		</view>
		<!-- 消息提示组件 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		numberToChinese
	} from "../../common/formatdate.js"
	import {
		request
	} from "../../common/request.js"
	export default {
		data() {
			return {
				dishData: {
					coverUrl: "https://img0.baidu.com/it/u=1848400172,269413136&fm=253&fmt=auto&app=138&f=JPEG?w=890&h=500",
					foodName: "土豆烧排骨",
					material: "料酒，排骨（200g）",
				},
				//操作步骤
				dishStep: [],
				currentDishId: 0,
			}
		},
		onLoad: function(option) {
			this.currentDishId = option.dishId;
			this.getDishList();
		},
		methods: {
			NumberToChinese(num) {
				return numberToChinese(num);
			},
			//获取菜品详情
			async getDishList(classifyId) {
				let result = await request("/common/GetDish", {
					dishId: this.currentDishId
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: '数据获取失败：' + result.msg,
						type: 'error',
						url: '/pages/category/category'
					})
				} else {
					this.dishData = result.data.dishInfo;
					this.dishStep = JSON.parse(result.data.dishInfo.dishDetail);
				}
			},
			//执行收藏
			async doCollect(status) {
				let requestUrl = "/users/CreateDishCollect";
				if (status) {
					requestUrl = "/users/DeleteDishCollect";
				}
				let result = await request(requestUrl, {
					dishId: this.currentDishId
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: `收藏菜品失败：${result.msg}`,
						type: 'error',
					})
				} else {
					this.dishData.isCollect = !status;
					if(status){
						this.dishData.dishCollect=this.dishData.dishCollect-1;
					}else{
						this.dishData.dishCollect=this.dishData.dishCollect+1;
					}
					this.$refs.uToast.show({
						title: `操作成功：${result.msg}`,
						type: 'success',
					})
				}
			},
			//执行点赞
			async doLike(status) {
				let requestUrl = "/users/CreateDishLike";
				if (status) {
					requestUrl = "/users/DeleteDishLike";
				}
				let result = await request(requestUrl, {
					dishId: this.currentDishId
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: `操作信息失败：${result.msg}`,
						type: 'error',
					})
				} else {
					this.dishData.isLike=!status;
					if(status){
						this.dishData.dishLike=this.dishData.dishLike-1;
					}else{
						this.dishData.dishLike=this.dishData.dishLike+1;
					}
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

	.menu-list {
		width: 94%;
		margin: 0 auto;

		.cover-box {
			width: 100%;
			height: 160px;
			// background: red;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.food-name {
			height: 40px;
			line-height: 40px;
			text-align: center;
		}

		.food-material {
			height: 180px;
			width: 100%;
			border: 1px solid #333;

			.left-top {
				width: 80px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				border-right: 1px solid #333;
				border-bottom: 1px solid #333;
			}

			.inner-box {
				padding: 5px 10px;
			}
		}

		.step-title {
			width: 100%;
			height: 60px;
			display: flex;
			align-items: center;
			justify-content: center;

			.inner-box {
				width: 100px;
				height: 30px;
				text-align: center;
				line-height: 30px;
				border: 1px solid #333;
			}
		}

		.step-item {
			margin-top: 10px;
			min-height: 180px;
			width: 100%;
			border: 1px solid #333;

			.left-top {
				width: 80px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				border-right: 1px solid #333;
				border-bottom: 1px solid #333;
			}

			.step-img {
				width: 50%;
				height: 120px;
				margin: 5px auto;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.step-content {
				box-sizing: border-box;
				padding: 5px;
			}

		}
	}

	// 底部操作按钮
	.bottom-btn {
		width: 100%;
		height: 60px;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #f0f0f0;
		display: flex;
		justify-content: space-around;
		padding: 10px 20px;

		.btn-item {
			width: 40%;
			height: 100%;
			display: flex;
			justify-content: center;
			.inner-btn {
				
				width: 30px;
				height: 30px;

				image {
					width: 100%;
					height: 100%;
				}
			}
			.dish-count{
				line-height: 40px;
				padding-left: 6px;
			}
		}
	}
</style>