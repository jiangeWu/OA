<template>
	<div>
		<search @searchData="searchData"></search>
		<div class="fawen">
			<div class="fawen-primary">
				<p class="fawen-banli">
					<span  class="mgl15" :class="{bot3: fawen}" @click="Tab2">待办理</span>
					<span :class="{bot3: banli}" @click="Tab">已办理</span>
				</p>
				<!-- <span class="mgr15">新建</span> -->
			</div>
		</div>
		
        <vscroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData">
        	<!-- <div>
        		<div class="infoContent" v-for="mess in message" @click="gofawenxiangqing(mess.formId,mess.nodeId,mess.isSignIn,mess.isFlow)" v-if="fawen">
					<div class="infoContent-primary">
						<p class="font15 hei44">{{mess.title}}</p>
						<p class="mgt15 hei20"><span>{{mess.departmentName}}</span><time>{{timeFormat(mess.applyTime)}}</time></p>
					</div>
				</div>
        	</div>

        	<div>
				<div class="infoContent" v-if="banli" v-for="mess in message2" @click="gofawenxiangqing3(mess.formId,mess.nodeId,mess.isSignIn)">
					<div class="infoContent-primary">
						<p class="font15 hei44">{{mess.title}}</p>
						<p class="mgt15 hei20">
							<span>{{mess.departmentName}}</span>
							<time>{{timeFormat(mess.applyTime)}}</time>
						</p>
					</div>
				</div>
			</div>	 -->
			<office-list @goTarget="gofawenxiangqing" :message="message" v-if="fawen"></office-list>
            <office-list @goTarget="gofawenxiangqing3" :message="message2" v-if="banli"></office-list>
        </vscroll>	
		
			
	</div>
</template>

<script>
	import Search from '../../components/search/search';
	import Vscroll from "../../components/refresh/refresh"
	import OfficeList from '../../components/officeList/officeList'
	export default {
		
		name: 'daiBanFaWen',
		//引用外部组件
		components: {
			Search,
			Vscroll,
			OfficeList
		},
		//数据源
		data() {
			return {
				// 待办列表参数
				todoList : {
					"pageSize":8,	
					"pageIndex":1,
					"keyWsord" : ''
				},
				wasList: {
					"pageSize":8,	
					"pageIndex":1,
					"keyWsord" : ''
				},
				// 待办列表信息
				message : [],
				//已办列表信息
				message2 : [],
				isFlow : true,
				// 切换
				fawen: true,
				banli: false,
				// 加载数据
                scrollData:{
                    noFlag: false //暂无更多数据显示
                }
			}
		},
		created() {
			this.loadTodoList();
			this.loadWasList();
		},
		mounted: function() {		
		},
		//行为
		methods: {
			//加载 todoList 接口数据
			loadTodoList() {
				let that = this;
				that.$http.post('api-office/office/sendfile/todoList',that.todoList,function(response) {
					that.message = response.data.result.list;
					that.isFlow = that.message.isFlow;
				
				});
			},
			//加载 wasList 接口数据
			loadWasList() {
				let that = this;
				that.$http.post('api-office/office/sendfile/wasList',that.wasList,function(response) {
					that.message2 = response.data.result.list;
					
				});
			},
			//搜索
			searchData(key) {

				this.todoList.keyWord = key;
				this.wasList.keyWord = key;
				if(this.fawen) {
					this.loadTodoList();
				}else if(this.banli) {
					this.loadWasList();
				}
				
				
			},
			//上啦刷新
            onRefresh(done) {
            	if(this.fawen) {
            		this.todoList.pageIndex = 1;
                	this.loadTodoList();
            	}else if(this.banli){
            		this.wasList.pageIndex = 1;
                	this.loadWasList();
            	}
            	
                done(); // call done
            },
			//下拉加载
            onInfinite(done) {
            	let that = this;
            	let more = this.$el.querySelector('.load-more');
            	if(that.fawen) {
            		that.todoList.pageIndex++;
	            	that.$http.post('api-office/office/sendfile/todoList',that.todoList,function(response) {
	            		let data = response.data.result.list;
	            		that.message = that.message.concat(data);
						that.isFlow = that.message.isFlow;
						more.style.display = 'none'; //隐藏加载条
						done();
	            		if(data.length < 8) {
	            			more.style.display = 'none'; //隐藏加载条
	            			//走完数据调用方法
	                        that.scrollData.noFlag = true;
	            		}	
	            	})
            	}else if(that.banli){
            		that.wasList.pageIndex++;
            		that.$http.post('api-office/office/sendfile/wasList',that.wasList,function(response) {
            			let data = response.data.result.list;
						that.message2 = that.message2.concat(data);
						more.style.display = 'none'; //隐藏加载条
						done();
	            		if(data.length < 8) {
	            			more.style.display = 'none'; //隐藏加载条
	            			//走完数据调用方法
	                        that.scrollData.noFlag = true;
	            		}		
					});

            	}
            	
            },
			// hasFlow 为true跳转到有流程页面，为false 跳转到无流程页面
			gofawenxiangqing(...args) {
				this.$cookie.setCookie('formId',args[0]);
				this.$cookie.setCookie('nodeId',args[1]);
				this.$cookie.setCookie('isSignIn',args[2]);
				if(args[3]) {
					this.$router.push({
						path: '/fawenxiangqing',
						name: 'faWenXiangQing',
					})
				}else {
					this.$router.push({
						path: '/fawenxiangqing2',
						name: 'faWenXiangQing2',
					})
				}
				
			},
			//待办发文之已已办详情页面
			gofawenxiangqing3(...args) {
				this.$cookie.setCookie('formId',args[0]);
				this.$cookie.setCookie('nodeId',args[1]);
				this.$cookie.setCookie('isSignIn',args[2]);
				this.$router.push({
					path: '/fawenxiangqing3',
					name: 'faWenXiangQing3',
				})
			},
			
	      	//切换到办理流程，并加载办理流程数据
			Tab: function() {
				let that = this;
				this.fawen = false;
				this.banli = true;
				this.scrollData.noFlag = false;
				// 办理流程
				
			},
			Tab2: function() {
				this.fawen = true;
				this.banli = false;
				this.scrollData.noFlag = false;
			},


		},
	}
</script>

<style lang="less" rel="stylesheet/less" scoped>
	@import url("../../style/mixin");
	@import url("/daiBanFaWen");
	
</style>