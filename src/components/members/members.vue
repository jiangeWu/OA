<template>
	<div class="inner">
		<div class="members members-access" v-for="item in members" @click="userId(item.userId)" :data-id="item.userId" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)">
			<div class="members-primary">
				<div class="members-img">
					<img src="../../assets/logo.png" alt="" width="48" height="48">
				</div>
				<div class="members-info">
					<p class="font15 name" :data-id="item.userId">{{item.userName}}</p>
					<p class="font13 info">
						<span class="iconfont icon-order_fill"></span>
						<span class="job">{{item.positionName}}</span>
						<span class="iconfont icon-dianhua"></span>
						<span></span>
					</p>
				</div>

			</div>
			<div class="members-ft"></div>
		</div>	
		<!-- <footer :style="{'line-height': 60 + moveY + 'px', 'height': 60 + moveY + 'px'}" class="load-more">
            <span v-show="downFlag === false">上啦加载数据</span>
            <span v-show="downFlag === true">加载中……</span>
        </footer> -->
        <div class="nullData" v-if="scrollData">暂无更多数据</div>
	</div>	
</template>
<script>
	import Vscroll from "../../components/refresh/refresh"
	export default {
		//组件
		components: {
			Vscroll
		},
		//数据源
		data() {
			return {
                downFlag: false,
                startY: 0,
                moveY: 0,
                endY: 0,
			}
		},
		props:['members','scrollData'],
		// 生命周期，跟随页面加载
		mounted: function() {
		},
		// 行为集合
		methods: {
			userId: function(id) {
				this.$cookie.setCookie('userId',id);		//传用户id
				this.$router.push('memberInfo');	//跳转到用户信息页面
			},
			text: function(id) {
				alert('调用members子组件并传参数：'+id);
			},

            touchStart(e) {
            	if(this.members === true){
            		return false;
            	}
            	this.startY = e.targetTouches[0].pageY;
                this.startScroll = this.$el.scrollTop || 0;
            },
            touchMove(e) {
            	if(this.members === true){
            		return false;
            	}
            	let diff = e.targetTouches[0].pageY - this.startY - this.startScroll;
            	diff < 0 ? diff : diff = 0;
            	this.moveY = Math.abs(diff);

            },
            touchEnd(e) {
            	if(this.members === true){
            		return false;
            	}
            	if (this.moveY >= 50) {
            		this.downFlag = true;
	        		setTimeout(() => {
	        			this.$emit('loadMember')
	        		},500);
            	}else {
            		return false;
            	}
        		
            	
            }

		}
	}
</script>

<style lang="less" scoped rel="stylesheet/less">
	@import url("/members");
	.load-more {
       
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        position: relative;
        display:none;
        bottom: 0px;
    }
    .nullData{
	    font-size: 26px;
	    color: #999999;
	    height: 100px;
	    line-height: 100px;
	    text-align: center;
	}
</style>