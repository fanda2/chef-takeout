<template>
	<view class="content">
		<view class="category-box">
			<view class="content-left">
				<view class="chef-avatar">
					<view class="img-box">
						<image v-if="chefInfo" :src="chefInfo.chefImg" mode="aspectFill"></image>
					</view>
					<view class="text-msg">
						<view class="inner-text">
							拿手菜
						</view>
						<view class="inner-ico">
							<image src="../../static/ico/down.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<scroll-view scroll-y="true" class="scroll-left">
					<view v-for="(item,index) in menuList" :key="item.classifyId" class="menu-item" @click="changeMenuList(item.classifyId)">
						<view class="inner-menu-item">
							{{item.classifyName}}
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="content-right">
				<scroll-view v-if="listData.length!=0" scroll-y="true" class="scroll-right">
					<view class="content-list">
						<view v-for="(item,index) in listData" :key="item.dishId" class="content-item" @click="goDetail(item.dishId)">
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
		</view>
		<view class="bottom-btn">
			 <view class="btn-left">
			 	<view class="like-btn">
			 		<view class="inner-box">
			 			<view class="img-box" @click="doLike(chefInfo.isLike)">
			 				<image v-show="!chefInfo.isLike" src="../../static/ico/like.png" mode="aspectFill"></image>
			 				<image v-show="chefInfo.isLike" src="../../static/ico/like_h.png" mode="aspectFill"></image>
			 			</view>
						<view class="like-count">
							{{chefInfo.chefLike}}
						</view>
			 		</view>
			 	</view>
			 	<view class="chef-price">
			 		<view class="inner-box">
			 			{{chefInfo.chefPrice}}/6道
			 		</view>
			 	</view>
			 </view>
			<view class="btn-right">
				<view class="btn-item chat-btn">
					<u-button shape="circle" type="primary" size="mini" @click="goChat">联系厨师</u-button>
				</view>
				<view class="btn-item create-order">
					<u-button  shape="circle" type="success" size="mini" @click="createOrder">立即下单</u-button>
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

				//分类列表
				menuList: [],
				queryInfo:{
					page:1,
					size:10
				},
				//菜品列表
				listData: [],
				chefInfo:"",
				loading:false,
			}
		},
		onLoad(option){
			this.getClassifyList();
			this.chefId=option.chefId;
			this.getChefInfo();
		},
		methods: {
			//进入详情页
			goDetail(val) {
				uni.navigateTo({
					url: `/pages/detail/detail?dishId=${val}`
				})
			},
			//获取分类列表
			async getClassifyList() {
				let result = await request("/common/GetClassifyList");
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: '数据获取失败：'+result.msg,
						type: 'error',
					})
				} else {
					this.menuList=result.data.classifyList;
					//第一次加载
					if(this.menuList.length!==0){
					   this.getDishList(this.menuList[0].classifyId);
					}
				}
			},
			//获取某一类下的菜品
			async getDishList(classifyId) {
			  let result=await request("/common/GetDishList",{
				  page:this.queryInfo.page,
				  size:this.queryInfo.size,
				  type:1,
				  classify:classifyId,
				  chefId:this.chefId
			  })
			  if (result.code !== 200) {
			  	this.$refs.uToast.show({
			  		title: '数据获取失败：'+result.msg,
			  		type: 'error',
			  	})
			  } else {
			  	this.listData=result.data.dishList;
				this.listDataTotal=result.data.total;
			  }
			},
			//改变当前的菜品列表
			changeMenuList(val){
				this.getDishList(val)
			},
			//执行点赞
			async doLike(item) {
				//操作点赞
				let requestUrl="/users/CreateChefLike";
				if(item.isLike){
					requestUrl="/users/DeleteChefLike"
				}
				let result = await request("/users/CreateChefLike", {
					dishId: item.chefId
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: `点赞信息失败：${result.msg}`,
						type: 'error',
					})
				} else {
					this.$refs.uToast.show({
						title: `点赞成功：${result.msg}`,
						type: 'success',
					})
				}
			},
			//获取厨师详细信息
			async getChefInfo() {
				let result = await request("/common/GetChef", {
					chefId:this.chefId
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: `获取信息失败：${result.msg}`,
						type: 'error',
					})
				} else {
					this.chefInfo=result.data.chefInfo;
				}
			},
			//执行点赞
			async doLike(isLike) {
				let requestUrl="/users/CreateChefLike";
				if(isLike){
					requestUrl="/users/DeleteChefLike";
				}
				let result = await request(requestUrl, {
					chefId:  this.chefId
				})
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: `操作信息失败：${result.msg}`,
						type: 'error',
					})
				} else {
				     this.chefInfo.isLike=!isLike;
					 if(isLike){
					 	this.chefInfo.chefLike=	this.chefInfo.chefLike-1;
					 }else{
						 	this.chefInfo.chefLike=	this.chefInfo.chefLike+1;
					 }
					
					this.$refs.uToast.show({
						title: `操作成功：${result.msg}`,
						type: 'success',
					})
				}
			},
			//进入聊天页面
			goChat(Id){
				uni.navigateTo({
					url:`/pages/chat/chat?userId=${this.chefId}`,
				})
			},
			//进入创建订单页面
			createOrder(Id){
				uni.navigateTo({
					url:`/pages/createOrder/createOrder?chefId=${this.chefId}`,
				})
			},
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

	//分类列表
	.category-box {
		width: 96%;
		margin: 10px auto;
		height: calc(100vh - 180px);
		display: flex;
		justify-content: space-between;

		.content-left {
			width: 28%;
			height: 100%;
			border: 1px solid #ccc;

			.scroll-left {
				height: 100%;
				padding-top: 10px;
			}

			.menu-item {
				height: 50px;
				width: 100%;

				.inner-menu-item {
					height: 30px;
					line-height: 30px;
					text-align: center;
					width: 90%;
					margin: 0 auto;
					border-radius: 8px;
					background: skyblue;
				}
			}
			.chef-avatar{
				width: 98%;
				margin:4px auto;
				height: 160px;
				.img-box{
					width: 100%;
					height: 120px;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.text-msg{
					height: 40px;
					margin-top: 10px;
					.inner-text{
						height: 26px;
						width: 100%;
						border: 1px solid #777;
						line-height: 26px;
						text-align: center;
					}
					.inner-ico{
						height: 14px;
						line-height: 14px;
					    display: flex;
						justify-content: center;
						align-items: center;
						image{
							width: 14px;
							height: 14px;
						}
					}
				}
			}
		}

		.content-right {
			width: 70%;
			height: 100%;

			.scroll-right {
				height: 100%;
			}

			.content-list {
				width: 98%;
				margin: 0 auto;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;

				.content-item {
					height: 100px;
					width: 46%;
					margin-top: 10px;
					border: 1px solid #ccc;

					.cover-box {
						width: 100%;
						height: 70px;
						overflow: hidden;
						image{
							height: 70px;
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
	}
	.empty-box{
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		.show-box{
			margin-top: 200px;
			width: 180px;
			height: 180px;
			.empty-img{
				width: 180px;
				height: 120px;
				display: flex;
				justify-content: center;
				image{
					width: 100px;
					height: 100px;
				}
				
			}
			.empty-text{
				height: 40px;
				line-height: 40px;
				text-align: center;
				color: #888;
			}
		}
	}
	
	// 底部操作按钮
	.bottom-btn{
		width: 100%;
		height: 60px;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #e6e6e6;
		display: flex;
		justify-content: space-between;
		.btn-left{
			height: 100%;
			width: 55%;
			display: flex;
			justify-content: space-around;
			.like-btn{
				color: #333;
				width: 40%;
				height: 60px;
				display: flex;
				justify-content: center;
				align-items: center;
				.inner-box{
					width: 90%;
					height: 40px;
					line-height: 40px;
					display: flex;
					.img-box{
						width: 30px;
						height: 30px;
						image{
							width: 100%;
							height: 100%;
						}
					}
					.like-count{
						padding-left: 4px;
					}
				}
			}
			.chef-price{
				width: 75%;
				height: 60px;
				display: flex;
				justify-content: center;
				align-items: center;
				.inner-box{
					width: 80%;
					height: 40px;
					line-height: 40px;
				}
			}
		}
		.btn-right{
			height: 100%;
			width: 44%;
			display: flex;
			justify-content: center;
			align-items: center;
			.btn-item{
				margin-right: 15px;
			}
			
		}
	}
</style>