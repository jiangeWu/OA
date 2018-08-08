<template>

	<div>
		<search @searchData="searchData"></search>
		<contacts :contacts="contacts" @gainData="gainData"></contacts>
		<h3 class="assortment" v-if="bumen">部门</h3>
		<cell :department="department" ref="cell" @gainData="gainData"></cell>
		<h3 class="assortment" v-if="chengyuan">成员</h3>
		<members :members="members" :scrollData="scrollData" ref="members" @loadMember="loadMember()" ></members>		
	</div>
</template>
<script>
	import Cell from '../../components/cell/cell'
	import Search from '../../components/search/search'
	import Contacts from '../../components/contacts/contacts'
	import Members from '../../components/members/members'
	export default {
		name:'department',
		// 组件
		components: {
			Contacts,
			Cell,
			Search,
			Members
		},
		// 数据源
		data() {
			return {
				//接口参数
				departmentParameter: {
		        	"departmentId": -1,
			        "isSearch": false,
			        "keyword":""
		      	},
		      	userParameter: {
		        	"departmentId": -1,
			        "isSearch": false,
			        "keyword":"",
			        "pageSize": 15,
			        "pageIndex": 1
		      	},

		      	//存储接口数据
		      	record: '',		
		      	//通讯录
				contacts: '',	
				//单位	
				company:'',
				//部门
				department: '',
				//成员
				members: '',
				//部门是否显示
				bumen: true,
				//成员是否显示
				chengyuan: true,

				//暂无数据
				scrollData: false,
				
			}
		},
		created() {
			this.loadGetDepListByPreviousDepartmentId();
			this.loadGetUserListPageByDepartmentId();
		},
		// 跟随页面开始加载，只加载一次
		mounted: function() {
			
		},
		methods: {
		
			//加载部门数据
			loadGetDepListByPreviousDepartmentId() {
				let that = this;
			    this.$http.post('/api-user/api/department/getDepListByPreviousDepartmentId',this.departmentParameter,function(response) {
			    	console.log(response);
			    	that.record = response.data.datamap;
			      	that.contacts = that.record.hierarchyList;
			      	that.company = that.record.company;
			      	that.department = that.record.departmentList;
			      	if(that.department.length === 0) {
			      		that.bumen = false
			      	}else {
			      		that.bumen = true
			      	}
			    })
			},
			//加载成员数据
			loadGetUserListPageByDepartmentId() {
				let that = this;
			    this.$http.post('/api-user/api/department/getUserListPageByDepartmentId',this.userParameter,function(response) {
			    	console.log(response);
			    	that.members  = response.data.result.list;
			    	
			    	if(that.members.length === 0) {
			      		that.chengyuan = false	
			      	}else {
			      		that.chengyuan = true
			      	}
			    })
			},
			//加载点击部门对应的数据
			gainData: function(id) {
				console.log(id);
				this.departmentParameter = {"departmentId" : id, "isSearch" : false, "keyword" : ''}
				this.userParameter = {"departmentId" : id, "isSearch" : false, "keyword" : '',"pageSize": 10,"pageIndex": 1}
			 	this.loadGetDepListByPreviousDepartmentId();
			 	this.loadGetUserListPageByDepartmentId();
			},
			searchData: function(key) {
				console.log(key)
				if(key === '') {
					this.departmentParameter = {"departmentId" : this.$store.state.departmentId, "isSearch" : false, "keyword" : ''};
					this.userParameter = {"departmentId" : this.$store.state.departmentId, "isSearch" : false, "keyword" : '',"pageSize": 10,"pageIndex": 1}
				}else {
					this.departmentParameter = {"departmentId" : -1, "isSearch" : true, "keyword" : key}
					this.userParameter = {"departmentId" : -1, "isSearch" : true, "keyword" : key,"pageSize": 10,"pageIndex": 1}
				}
				setTimeout(this.setTimeoutSearch(),500);
				
			},
			// 延时加载数据
			setTimeoutSearch() {
				let that = this;
			    this.loadGetDepListByPreviousDepartmentId();
			    this.loadGetUserListPageByDepartmentId();
			},
			//上拉加载成员数据
			loadMember() {
				let that = this;
				that.userParameter.pageIndex++;
			    that.$http.post('/api-user/api/department/getUserListPageByDepartmentId',that.userParameter,function(response) {
			    	console.log(response);
			    	if(response.data.result.list.length === 0) {
			    		that.scrollData = true;
			    	}
			    	that.members  = that.members.concat(response.data.result.list);
			    	
			    	if(that.members.length === 0) {
			      		that.chengyuan = false	
			      	}else {
			      		that.chengyuan = true
			      	}
			    })

			}

		}
	}
</script>
<style lang="less" scoped rel="stylesheet/less">
	@import url("../../style/mixin");
  	@import url("/department");
</style>