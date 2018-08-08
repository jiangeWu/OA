<template>
	<div class="application">
		<ul class="clear">
			<li v-for="item in logo">
				<router-link :to="item.hres"><img :src="item.srcs" :alt="item.name"></router-link>
				<span>{{item.name}}</span>
			</li>
			
		</ul>
	</div>

</template>
<script>
	import gonggao from '../../images/gonggao.png'
	import tongxunlu from '../../images/tongxunlu.png'
	import youxiang from '../../images/youxiang.png'
	import duanxin from '../../images/duanxin.png'
	import fawen from '../../images/fawen.png'
	import shouwen from '../../images/shouwen.png'
	import gongzuoliu from '../../images/gongzuoliu.png'
	export default {
		data() {
			return {
				// cookie: this.$cookie.getCookie('token'),

				logo: [
					{'hres':'/notice','srcs':gonggao,'name':'公告'},
					{'hres':'/department','srcs':tongxunlu,'name':'通讯录'},
					{'hres':'/mailbox','srcs':youxiang,'name':'邮箱'},
					{'hres':'/duanxin','srcs':duanxin,'name':'短信'},
					{'hres':'/daibanfawen','srcs':fawen,'name':'发文'},
					{'hres':'/daibanshouwen','srcs':shouwen,'name':'收文'},
					{'hres':'/workflow','srcs':gongzuoliu,'name':'工作流'},
				],
				login:{
					"account": "zhangjianheng",
					"password": "z4kWv+EbFqly64GKHJ+Yvw==",
					"systemId": "0"
				},
			}
		},
		mounted: function() {
			this.saveToken();
		},
		//行为
		methods: {
			//获取用户所在的系统
			getHost() {
				let that = this;
				that.$http.post('/api-notice/core/getHost',{},function(response) {
					that.$store.state.host = response.data.result;
				})
			},
			getUrlParam(name) {

    			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    			var r = window.location.search.substr(1).match(reg);  // 匹配目标参数
    			//入口首页，判断入口链接是否有token，没有的话跳到登录接口，有token的可能是安卓app的
    			// if(r === null) {
    			// 	this.$router.push('/login');
    			// }
    			if (r != null) return unescape(r[2]); return null; // 返回参数值
    		},
    		saveToken() {
    			let token = this.getUrlParam('token');
    			if(!token) {
    				console.log(this.$cookie.getCookie('token'));
    				if(!this.$cookie.getCookie('token')) {
    					this.$router.push('login');
    				}
    			}else {
    				this.$cookie.setCookie('token',token);
    			}
				
				// this.$router.push('notice');
				this.getHost();
    		}	
		}	
	}
</script>
<style lang="less" rel="stylesheet/less" scoped>
	@import url("../../style/mixin");
	@import url("/home");

</style>