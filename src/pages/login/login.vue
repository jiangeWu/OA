<template>
	<div class="login">
		<section class="loginInput">
			<div>
				<label for="loginAccountt"><i class="icon iconfont icon-yigerenwu"></i></label>
				<input type="text" placeholder="请输入用户名" autofocus="autofocus" v-model="account" id="loginAccount">
			</div>
			<div>
				<label for="loginPassword"><i class="icon iconfont icon-lock_fill"></i></label>
				<input type="password" placeholder="请输入密码" v-model="passwords" id="loginPassword">
			</div>
		</section>
		<section class="loginSign">
			<div>
				<a href="javascript:void(0)" @click="logins()">立即登录</a>	
			</div>
		</section>
		
		
	</div>

</template>
<script>
	export default {
		data() {
			return {
				account: '',
				passwords: '',
				fullHeight: document.body.clientHeight,
				user: {
					'account':'',
					'password':'',
					'systemId' : '1'
				},
				
			}
		},
		computed: {
			
			
		},
		mounted: function() {

			document.querySelector('.login').style.position = 'relative';
			document.querySelector('.login').style.height = this.fullHeight + 'px'
			const that = this;
      		window.onresize = () => {
        		return (() => {
          			window.fullHeight = document.documentElement.clientHeight;
        	  		that.fullHeight = window.fullHeight;
        		})()
      		};
      		
			// document.querySelector('.login').style.height = this.fullHeight + 'px';
			// document.querySelector('.login').style.position = 'relative';
		},
		//行为
		
		methods: {
			//获取用户所在的系统

			logins() {
				let that = this;
				that.user.account = that.account;
				that.user.password = that.passwords;
				that.$http.post('/api-user/api/loginBySystem',that.user,function(response) {
					if(response.status === 200) {
						that.$cookie.setCookie('token',response.data.result);
						that.$router.push('home');
					}
					
				})
			},
			
			
		},	
		watch: {
			fullHeight (val) {
				console.log(val);
				document.querySelector('.login').style.height = val + 'px';
		        if(!this.timer) {
		          	this.fullHeight = val
		          	this.timer = true
		          	let that = this
		          	setTimeout(function (){
		            	that.timer = false
		          	},400)
		        }
	      	}
		}
	}
</script>
<style lang="less" rel="stylesheet/less" scoped>
	@import url("../../style/mixin");
	@import url("/login");
</style>