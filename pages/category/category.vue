<template>
	<view class="content">
		<view class="search-box">
			<u-search :placeholder="placeholderText" v-model="searchKeyword" :show-action="true" @search="goSearch" @custom="goSearch"
				input-align="center"></u-search>
		</view>
		<view class="category-box">
			<view class="content-left">
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
				placeholderText: "搜索",
				searchKeyword: "",
				//分类列表
				menuList: [],
				queryInfo:{
					page:1,
					size:10
				},
				//菜品列表
				listData: []
			}
		},
		onLoad(){
			this.getClassifyList();
		},
		methods: {
			//进入详情页
			goDetail(val) {
				uni.navigateTo({
					url: `/pages/detail/detail?dishId=${val}`
				})
			},
			//进入信息搜索界面
			goSearch(){
				uni.navigateTo({
					url: `/pages/search/search?keyword=${this.searchKeyword}`
				})
			},
			//获取分类列表
			async getClassifyList() {
				let result = await request("/common/GetClassifyList");
				if (result.code !== 200) {
					this.$refs.uToast.show({
						title: '数据获取失败：'+result.msg,
						type: 'error',
						url: '/pages/category/category'
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
				  type:0,
				  classify:classifyId,
			  })
			  if (result.code !== 200) {
			  	this.$refs.uToast.show({
			  		title: '数据获取失败：'+result.msg,
			  		type: 'error',
			  		url: '/pages/category/category'
			  	})
			  } else {
			  	this.listData=result.data.dishList;
				this.listDataTotal=result.data.total;
			  }
			},
			//改变当前的菜品列表
			changeMenuList(val){
				this.getDishList(val)
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
</style>