<template>
	<view class="content">
		<view class="back-btn">
			返回
		</view>
		<view class="chef-list">
			<view class="list-item">
				<view class="left-avatar">
					<image src="" mode=""></image>
				</view>
				<view class="chef-message">
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chefList:[
					{
						id:1,
						avatarUrl:"https://img1.baidu.com/it/u=1292091472,2963564742&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750",
						descript:"这是个人介绍",
						likeNum:11,
					}
				]
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="less" scoped>

</style>
