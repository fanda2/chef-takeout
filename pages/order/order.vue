<template>
	<view class="content">

		<view class="order-content">
			<view class="tab-swiper">
				<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
					swiperWidth="750"></u-tabs-swiper>
			</view>
			<swiper style="height:800px;width: 100%;" :current="swiperCurrent" @transition="transition"
				@animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="(item, index) in tabs" :key="index">
					<scroll-view scroll-y style="height:800px;width: 100%;" @scrolltolower="onreachBottom">
						<view v-if="orderList.length!==0" class="order-list">
							<view v-for="(item,index) in orderList" :key="index" class="list-item">
								<view class="order-number">
									订单编号: {{item.orderNo}}
								</view>
								<view class="order-msg" @click="goChefDetail(item.chefInfo.chefId)">
									<view class="chef-img">
										<view class="img-box">
											<image :src="item.chefInfo.chefImg" mode="aspectFill"></image>
										</view>
									</view>
									<view class="chef-msg">
										<view class="chef-name">
											{{item.chefInfo.chefName}}
										</view>
										<view class="chef-desc">
											{{item.chefInfo.chefDesc}}
										</view>
									</view>
								</view>
								<view class="order-price">
									{{showPayCount()}} : <span> {{item.orderPrice}}</span>
								</view>
								<view class="control-btn">
									<view class="btn-item item1" v-if="swiperCurrent==0">
										<u-button class="btn" shape="circle" size="mini"
											@click="cancleOrder(item.orderId)">取消订单</u-button>
										<u-button class="btn" shape="circle" type="success" size="mini"
											@click="goOrderDetail(item.orderId)">支付订单</u-button>
									</view>
									<view class="btn-item item2" v-if="swiperCurrent==1">
										<div class="empty-box"></div>
										<u-button class="btn" shape="circle" type="success" size="mini"
											@click="goOrderDetail(item.orderId)">查看详情</u-button>
									</view>
									<view class="btn-item item3" v-if="swiperCurrent==2">
										<u-button class="btn" shape="circle" size="mini"
											@click="goOrderDetail(item.orderId)">查看详情</u-button>
										<u-button class="btn" shape="circle" type="success" size="mini"
											@click="goRate(item.orderId)">评价订单</u-button>
									</view>
									<view class="btn-item item4" v-if="swiperCurrent==3">
										 <view class="time-content">
										 	订单取消时间：{{item.orderUpdateTime}}
										 </view>
									</view>
								</view>
							</view>
						</view>
						<view v-else class="order-empty">
							<view class="empty-img">
								<image src="../../static/ico/no-order.png" mode="aspectFill"></image>
							</view>
							<view class="empty-text">
								您还没有相关的订单
							</view>
						</view>

					</scroll-view>
				</swiper-item>
			</swiper>



		</view>
		<u-toast ref="uToast" />
		<!-- 加载动画 -->
		<zero-loading type="pulse" v-if="loading"></zero-loading>
		<!-- 模态框 -->
		<u-modal v-model="dialogShow" :content="content" :mask-close-able="true" @confirm="modelConfirm"
			:show-cancel-button="true"></u-modal>
	</view>
</template>

<script>
	import {
		request
	} from "@/common/request.js"
	export default {
		data() {
			return {
				orderList: [],
				query: {
					page: 1,
					size: 10
				},
				total: 0,
				calcelId: 0,
				loading: false,

				swiperCurrent: 0,
				current: 0,
				list: [{
					name: '待付款'
				}, {
					name: '历史订单'
				}, {
					name: '待评价'
				}, {
					name: "退款/售后"
				}],
				tabs: [{
					name: '待付款'
				}, {
					name: '历史订单'
				}, {
					name: '待评价'
				}, {
					name: "退款/售后"
				}],

				//模态框展示
				dialogShow: false,
				content: "",

				//当前订单ID
				currentOrderId: 0,
			}
		},
		onLoad: function(option) {
			if (option.tabType != 0) {
				this.current = option.tabType;
				this.swiperCurrent = option.tabType;
			}
			this.getOrderList();
		},
		methods: {
			// 获取订单信息
			async getOrderList() {
				let status = 0;
				if (this.swiperCurrent == 0) {
					status = 0;
				} else if (this.swiperCurrent == 1) {
					status = 1;
				} else if (this.swiperCurrent == 2) {
					status = 2
				} else if (this.swiperCurrent == 3) {
					status = 4
				}
				const res = await request('/users/GetUserOrderList', {
					page: this.query.page,
					size: this.query.size,
					status: status
				});
				if (res.code !== 200) {
					this.$refs.uToast.show({
						title: '数据获取失败',
						type: 'error',
					})
				} else {
					this.orderList = res.data.orderList;
					this.total = res.data.total;
				}
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
				console.log("头部却换")
				this.getOrderList();
			},
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// scroll-view到底部加载更多
			onreachBottom() {

			},

			//进入详情页面
			goOrderDetail(id) {
				uni.navigateTo({
					url: "/pages/orderDetail/orderDetail?orderId=" + id + "&&orderType=" + this.swiperCurrent,
				})
			},
			//进入厨师详情页面
			goChefDetail(Id){
				uni.navigateTo({
					url: `/pages/chefDetail/chefDetail?chefId=${Id}`,
				})
			},
			//确认框确认按钮
			modelConfirm(id) {
				this.cancleOrderAip(id)
			},
			//点击取消订单按钮
			cancleOrder(id) {
				this.dialogShow = true;
				this.content = "是否取消该订单？";
				this.currentOrderId = id;
			},
			//取消订单
			async cancleOrderAip(id) {
				const res = await request('/users/CancelUserOrder', {
					orderId: this.currentOrderId
				});
				if (res.code !== 200) {
					this.$refs.uToast.show({
						title: '取消订单失败',
						type: 'error',
					})
				} else {
					this.$refs.uToast.show({
						title: '订单已取消',
						type: 'success',
					})
					this.getOrderList();
				}
			},
			//展示用户付款金额状态
			showPayCount(){
				if(this.swiperCurrent==0){
					return '需要支付';
				}else if(this.swiperCurrent==3){
					return '已经退还';
				}else{
					return '已经支付';
				}
			},
			//进入订单评价界面
			goRate(Id){
				uni.navigateTo({
					url:`/pages/orderRate/orderRate?orderId=${Id}`
				})
			}

		}
	}
</script>

<style lang="less" scoped>
	.content,
	.order-content {
		border-right-width: 100%;
	}

	.swiper-item {
		width: 100%;
		height: 1400px;
	}

	.order-list {
		width: 96%;
		margin: 0 auto;

		.list-item {
			width: 100%;
			margin: 20px auto;
			height: 200px;
			border-bottom: 1px solid #ccc;

			.order-number {
				height: 30px;
				line-height: 30px;
				padding: 0 10px;
				font-size: 12px;
				background: #f4f4f4;
			}

			.order-msg {
				width: 100%;
				height: 90px;
				display: flex;
				justify-content: space-between;

				.chef-img {
					width: 20%;
					height: 80px;
					display: flex;
					justify-content: center;
					align-items: center;

					.img-box {
						width: 60px;
						height: 80px;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}

				.chef-msg {
					width: 78%;
					color: #333;

					.chef-name {
						height: 30px;
						line-height: 30px;
						font-size: 14px;
						font-weight: 550;
					}

					.chef-desc {
						padding: 0 5px;
						line-height: 16px;
						height: 48px;
						margin: 6px auto;
						font-size: 12px;
						display: -webkit-box;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;
						/*没置超出部分显示省略号 */
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.chef-time {
						padding: 4px 0;
					}
				}

			}

			.order-price {
				height: 40px;
				line-height: 40px;
				text-align: right;
				padding: 0 10px;

				span {
					color: orange;
				}
			}

			.control-btn {
				height: 40px;
				line-height: 40px;
				display: flex;
				justify-content: flex-end;

				.btn-item {
					width: 50%;
					display: flex;
					align-items: center;
					justify-content: space-around;
					.empty-box {
						width: 100px;
					}
				}
				.item4{
					width: 60%;
					.time-content{
						font-size: 12px;
					}
				}
			}
		}
	}

	.order-empty {
		width: 80%;
		height: 500px;
		margin: 10px auto;
		padding-top: 20px;
		z-index: 99;

		.empty-img {
			height: 200px;
			width: 200px;
			margin: 0 auto;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.empty-text {
			height: 60px;
			line-height: 60px;
			text-align: center;
			font-size: 14px;
			color: #888;
		}
	}
</style>