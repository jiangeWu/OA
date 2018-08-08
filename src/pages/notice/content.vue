<template>
	<div class="notice">
		<h4 class="font15">{{contentTitle}}</h4>
		<p class="noticeTime">
			<span class="time1">时间：</span>
			<time class="time2">{{ymdhm}}</time>
		</p>
		<p class="noticeAnnex" v-for="(file,index) in files">
			<span class="annex1" v-show="!index>0">附件：</span>
			<a class="annex2" :href="'/api-notice/core/downLoad?fileName='+file.urlEncodeName+'&path='+file.path+'&token='+token">{{file.name}}</a>
		</p>

		<div class="noticeContent" v-html="changeHtml(content)">
		<!-- <div class="noticeContent" v-html='hh'>	 -->
		</div>
	</div>
</template>
<script>
	import {mapState, mapActions} from 'vuex'
	export default {
		data() {
			return {
				token: this.$cookie.getCookie('token'),
				noticeId: {
					'noticeId' : this.$cookie.getCookie('noticeId')
				},
				ymdhm: '2018-01-01 00:00',
				contentTitle: '',
				files: [],
				content: '<p></p>',
				hh: '<h2 class="s1">66666</h2>',
			}
		},
		computed: {
			...mapState([
				'host'
			]),
		},
		created() {
            this.getContent();

        },
		mounted: function() {
			
		},
		methods: {
			//获取内容
			getContent() {
				let that = this;
				that.$http.post('api-notice/notice/notice/details',that.noticeId,function(response) {
					let data = response.data.datamap;
					console.log(response.data.datamap);
					that.ymdhm = that.timeFormat(data.createTime);
					that.contentTitle = data.noticeSubject;
					that.files = data.fileList;
					that.content = data.content;
				});
			},
			// //附件下载
			// downLoad(urlEncodeName,path) {

			// 	let downLoad = {
			// 		"fileName" : urlEncodeName,
			// 		"path": path
			// 	};
			// 	let that = this;
			// 	that.$http.get('api-notice/core/downLoad',downLoad,function(response) {
			// 		console.log(response.request.responseURL);
			// 		str = response.request.responseURL;
			// 		return str;
			// 	});
				
				
			// },
	
			add0(m){
	      		return m<10?'0'+m:m 
	      	},
			//时间戳转化成时间格式
			timeFormat(timestamp){
			  //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
			    let time = new Date(timestamp);
			    let year = time.getFullYear();
			    let month = time.getMonth()+1;
			    let date = time.getDate();
			    let hours = time.getHours();
			    let minutes = time.getMinutes();
			    let seconds = time.getSeconds();
			    return this.add0(year)+'-'+this.add0(month)+'-'+this.add0(date)+' '+this.add0(hours)+':'+this.add0(minutes);
			},
			changeHtml(html) {
				let str = "";
				let div = document.createElement('div');
				div.innerHTML = html;
				// 筛选HTML标签，除了img标签之外其他标签全部变成p标签
				str = div.innerText.replace(/<\/(?!img).*?>/gi,'</p>');
				str = div.innerText.replace(/<(?!\/)(?!img).*?>/gi,'<p>');
				//替换img标签的src根路径
				str = str.replace(/src=[\'\"]?([^\'\"]*)[\'\"]?/gi,"src=" + this.host + "$1");
				//去除img标签的宽高 样式
				// str = str.replace(/width=[\'\"]?([^\'\"]*)[\'\"]?|height=[\'\"]?([^\'\"]*)[\'\"]?/gi,"");
				
				return str;
			}
		}
	}
</script>
<style lang="less" rel="stylesheet/less" scoped>
	@import url("../../style/mixin");
	@import url("/content");
</style>