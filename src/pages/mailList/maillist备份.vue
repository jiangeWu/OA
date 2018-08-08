<template>
    <div id="Company">
        <!-- 搜索框 -->
        <search @searchData="searchData"></search>
        <!-- 通讯录导航条 -->
        <contacts :contacts="contacts"  @gainData="gainData"></contacts>

        
        <div style="margin-bottom:80px">
            <div class="weui-cells weui-cells_checkbox" style="margin:15px 0" v-if="ifSear">
                <label for="checkbox_yvu1m_0" class="weui-cell weui-check_label vux-checklist-label-left">
                    <div class="weui-cell__hd">
                        <input type="checkbox" class="weui-check" :data-id="dataId" :value="datas" v-model="checked" id="checkbox_yvu1m_0"  @click="changeAllChecked(dataId,$event)"> 
                        <i class="iconfont icon-success1"></i>
                    </div> 
                </label>
                <div class="weui-cell__bd">
                    <p>全选</p> 
                </div>
            </div>
            <!-- 子部门 -->
            <div style="margin-bottom:15px;">
                <div class="weui-cells weui-cells_checkbox" v-for="item in data1">
                    <label :for="'checkbox_yvu1m' + item.departmentId" class="weui-cell weui-check_label vux-checklist-label-left" @click="getData(item,$event)"> 
                        <div class="weui-cell__hd">
                            <input type="checkbox" class="weui-check buMen" :value="item.departmentName" :id="'checkbox_yvu1m' + item.departmentId" v-model="datas2" :data-id="item.departmentId"> 
                            <i class="iconfont icon-success1"></i>
                        </div> 
                    </label>
                    <div class="weui-cell__bd" @click="gainData(item.departmentId)">
                        <p>{{item.departmentName}}</p> 
                    </div>
                </div>
            </div>

            <!-- 成员 -->
            <div class="weui-cells weui-cells_checkbox" v-for="item in data3">
                <label :for="'checkbox_yvu1m' + item.userId" class="weui-cell weui-check_label vux-checklist-label-left" @click="getUser(item,$event)"> 
                    <div class="weui-cell__hd">
                        <input type="checkbox" class="weui-check" :value="item.userName" :id="'checkbox_yvu1m' + item.userId" v-model="datas1"> 
                        <i class="iconfont icon-success1"></i>
                    </div> 
                </label>
                <div class="weui-cell__bd">
                    <p>{{item.userName}}</p> 
                </div>
            </div>

            <!-- 显示选择 -->
            <div class="attr-wrap">
                <div class="attr-rel">
                    <div class="attr-name">
                        <span v-for="attr in attr1">{{attr.userName}},</span>
                    </div>
                    <div class="attr-complete" @click="retData(getName)">
                        完成({{attr1.length}})
                    </div>
                    
                </div>
            </div>
        </div>

    </div>
</template>

<script>

import Search from '../../components/search/search'
import Contacts from '../../components/contacts/contacts'
import  Cookies from '../../common/nenglong.cookies'

export default {
    // 组件
    components: {
        Search,
        Contacts,
    },
    // 父组件传参
    props: ['getName'],
    // 数据源
    /*
        选择成员控件逻辑
        因为子部门之间，子部门与直属成员之间可能存在人员重复,子部门A[1,2,3,4,5],子部门B[3,4,5,6,7] 直属成员[5,6,7,8,9]全选时应该显示[1,2,3,4,5,6,7,8,9],选择A,B部门时应该显示 [1,2,3,4,5,6,7],选择A,B之后取消B应该显示[1,2,3,4,5] 单选A部门应该显示[1,2,3,4,5],单选B部门加 直属成员[5,6]应该显示[3,4,5,6,7]
        
        1.使用一个数组储存被选中数据，这时假如取消某个子部门的，需要重新渲染剩下的全部被勾选的子部门的数据，这时数组应该被清空，直属成员不存在，显示错误

        2.使用数组arr1储存子部门数据，使用数组arr2储存直属成员数据，最后合并数据为数组arr3，去重
        2.1  勾选与取消子部门的时候渲染所有被选中的部门，数组arr1储存
        2.2  勾选直属成员数据，被选中的添进数组arr2,取消选中时需要渲染被选中的子部门之间有没有被取消选中的成员数据，有则arr3不改变，无则arr3舍去被选中成员数据
        基于多个数组储存数据，所以在选中全选的时候应该把直属成员数据填充满数组arr2，取消全选则清空


     */
    data () {
        return {
            ifSear : true,
            checked: false,
            // 全选或不全选显示
            datas: '能龙总部',
            dataId: -1,
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
                "pageSize": 1000,
                "pageIndex": 1
            },
            // 判断是否点击部门加载部门下的用户
            isPanDuan: false,
            // 通讯录导航条
            contacts: [],
            // 子部门或者子单位数据源
            data1: [],
            // data2 数据来源于data1 的 department 属性， 目的是为了赋值与datas1  
            data2:[],
            //  成员选中的复选框
            datas1: [],
            //  部门选中的复选框
            datas2: [],
            //  用户数据源
            data3: [],
            // data4 数据来源于data3 的 department 属性， 目的是为了赋值与datas1  
            data4: [],
            //数组attr1 储存被选中的用户数据，数组attr2储存选择单位或者部门返回的用户数据， 数组attr3储存直属用户
            attr1: [],
            attr2: [],
            attr3: [],
        }
    },
    // 生命周期,跟随页面开始加载，只加载一次
    mounted:function(){
        // this.loadGetAddressList()
        this.loadGetDepListByPreviousDepartmentId(true);
        this.loadGetUserListPageByDepartmentId();

    },

    methods: {
        
        //加载部门数据
        loadGetDepListByPreviousDepartmentId(isContact) {
            let that = this;
            this.$http.post('/api-user/api/department/getDepListByPreviousDepartmentId',this.departmentParameter,function(response) {
              
                that.record = response.data.datamap;
                if(isContact === true){
                    that.contacts = that.record.hierarchyList;
                    that.dataId = that.contacts[that.contacts.length-1].departmentId;
                }
                
                that.data1 = that.record.departmentList;
                
                for(var i in that.data1) {
                    that.data2.push(that.data1[i].departmentName);
                }

                that.data2.length = that.data1.length;
                if(that.data1.length === 0) {
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
                
                that.data3  = response.data.result.list;
                for(var j in that.data3) {
                    that.data4.push(that.data3[j].userName);
                }
                that.data4.length = that.data3.length;
                if(that.data3.length === 0) {
                    that.chengyuan = false  
                }else {
                    that.chengyuan = true
                }
            })
        },
        // 调用子组件的方法
        goDepartment: function() {
            this.$refs.cell.goDepartment();
        },
        // 判断全选或者全不选
        changeAllChecked(id,e) {
            let checked = e.target.checked;
            checked ? this.getAllData(id) : this.delAllData(id);
            let self = this;
            if(!self.checked) {
                self.datas1 = self.data4;
                self.datas2 = self.data2;
            }else {
                self.datas1 = [];
                self.datas2 = [];
            }
        },
        //点击获取数据
        gainData: function(id) {
            this.datas1 = [];
            this.datas2 = [];
            this.data1 = [];
            this.data2 = [];
            this.data3 = [];
            this.data4 = [];
            this.attr1 = [];
            this.attr2 = [];
            this.attr3 = [];
            this.checked = false;
            this.ifSear = true;
            this.departmentParameter = {"departmentId" : id, "isSearch" : false, "keyword" : ''};
            this.userParameter = {"departmentId" : id, "isSearch" : false, "keyword" : '',"pageSize": 1000,"pageIndex":1};
           
            this.loadGetDepListByPreviousDepartmentId(true);
            this.loadGetUserListPageByDepartmentId();
        },
        //true全选，获取全部用户数据
        getAllData(id) {
            let that = this;
            that.$http.post('/api-user/api/userInfo/getAllUserByDepartment',{'departmentId':id},function(response) {
                console.log(response);
                that.attr1 = [];
                that.attr2 = response.data.list;
                that.attr1 = that.attr1.concat(that.attr2);
                that.attr2 = [];
            })
        },
        //false全不选,删除所有用户数据
        delAllData() {
            this.attr1 = [];
        },
        // 点击部门获取数据
        getData(item,e) {

            let checkeds = e.target.checked;
            // debugger;
            if(checkeds === true) {
                // this.trueGetData(item);
            }else if(checkeds === false) {
                // this.falseDelData(item);
            }else {
                return false;
            } 
            let arr = this.$el.querySelectorAll('.buMen');
            this.attr1 = this.attr3;
            this.attr2 = [];
            for (let i=0;i<arr.length;i++) {
               
                // debugger;
                if(arr[i].checked === true) {

                    // debugger;
                    this.trueGetData(arr[i].getAttribute('data-id'));
                }      
            }
            
        },
        getUser(data,e) {
            let checkeds = e.target.checked;
            // debugger;

            if (checkeds === true) {
                this.trueGetUser(data)
            }else if(checkeds === false) {
                this.falseDelUser(data);
                let arr = this.$el.querySelectorAll('.buMen');
                this.attr1 = this.attr3;
                this.attr2 = [];
                for (let i=0;i<arr.length;i++) {
                    if(arr[i].checked === true) {
                        this.trueGetData(arr[i].getAttribute('data-id'));
                    }      
                }
               
            }
        },
        //true时获取所选中的部门数据
        trueGetData(data) {
            let that = this;
            let departmentId  = {
                'departmentId': data
            }
            that.$http.post('/api-user/api/userInfo/getAllUserByDepartment',departmentId,function(response) {
                that.attr2 = that.attr2.concat(response.data.list);
                that.attr1 = that.quChong(that.attr1.concat(that.attr2));
            })
            

        },
        //false时删除所选中的部门数据
        falseDelData(data) {
            let that = this;
            let departmentId  = {
                'departmentId': data.departmentId
            }
            that.$http.post('/api-user/api/userInfo/getAllUserByDepartment',departmentId,function(response) {
                that.attr2 = response.data.list;
                that.attr1 = that.falseQuChong(that.attr1,that.attr2);
            })        
        },
        //true时获取所选中的用户数据
        trueGetUser(data) {
            this.attr1 = [];
            this.attr3.push(data);
            this.attr1 = this.quChong( this.attr1.concat(this.attr2,this.attr3) );
            // this.attr3 = [];
        },
        //false时删除所选中的用户数据
        falseDelUser(data) {
        
            let arr = [];
            arr.push(data);
            this.attr3 = this.falseQuChong(this.attr3,arr);
            console.log(this.attr3);
         
        },
        //两个数组去掉重复的数据
        quArrChong(arr1,arr2) {
            let temp = []; //临时数组1 
            let temparray = [];//临时数组2 
            for (let i = 0, len=arr2.length; i < len; i++) { 
                temp[arr2[i]] = true;//巧妙地方：把数组arr2的值当成临时数组1的键并赋值为真 

            }; 
                
            for (let i = 0, len = arr1.length; i < len; i++) { 

                if (!temp[arr1[i]]) { 
                    temparray.push(arr1[i]);//巧妙地方：同时把数组arr1的值当成临时数组1的键并判断是否为真，如果不为真说明没重复，就合并到一个新数组里，这样就可以得到一个全新并无重复的数组 
                } ; 
     
            }; 

            arr1 = temparray;
            temparray = [];
            temp = [];
            arr2 = [];
        },
        //两个数组对象去掉重复的数据
        falseQuChong(arr1,arr2) {
            let hash= {};
            let arrData = [];
            
            for(var i = 0; i < arr1.length; i++){
                var obj = arr1[i];
                var num = obj.userId;
                var isExist = false;
                for(var j = 0; j < arr2.length; j++){

                    var aj = arr2[j];
                    var n = aj.userId;
                    // debugger;
                    if(n == num){
                        isExist = true;
                        break;
                    }
                }
                if(!isExist){
                    arrData.push(obj);
                }
                // debugger;
            }

            arr1 = arrData;
              // debugger;
            arrData = [];
            arr2 = [];
            return arr1;
        },
        trueQuChong(arr1,arr2) {
            let hash = {};
            // debugger;
            arr1 = arr1.concat(arr2);
            arr1 = this.quChong(arr1);
            // debugger;
            arr2 = [];
            // debugger;
            return arr1;
            
        },
        quChong(arr) {
            let hash = {};
            arr = arr.reduce(function(item, next) {
                hash[next.userId] ? '' : hash[next.userId] = true && item.push(next);
                return item;
            }, []);
            return arr;
        },
        //去除单个数组里面重复的数据
        dedupe(array){
            return Array.from(new Set(array));
        },
        //点击完成返回数据
        retData(name) {
          
            this.$emit('getArr',{'name':name,'arr':this.attr1});
        },
        searchData(key) {
            
            this.ifSear = false;
  
            if(key === '') {
                    this.ifSear = true;
                    this.departmentParameter = {"departmentId" : this.$store.state.departmentId, "isSearch" : false, "keyword" : ''};
                    this.userParameter = {"departmentId" : this.$store.state.departmentId, "isSearch" : false, "keyword" : '',"pageSize": 1000,"pageIndex":1}
                }else {
                    // this.parameter = {"departmentId" : -1, "isSearch" : true, "keyword" : key}
                    this.departmentParameter = {"departmentId" : -1, "isSearch" : true, "keyword" : key};
                    this.userParameter = {"departmentId" : -1, "isSearch" : true, "keyword" : key,"pageSize": 1000,"pageIndex":1}
            }
            
            this.loadGetDepListByPreviousDepartmentId(false);
            this.loadGetUserListPageByDepartmentId();
           
        }
    },    
    // 监视数据变化
    watch: {
        //成员变化
        "datas1": function() {

            if(this.datas1.length === this.data3.length && this.datas2.length === this.data1.length) {
                if(this.datas1.length === 0 && this.datas2.length === 0) {
                    this.checked = false;
                }else {
                    this.checked = true;
                }
                
            }else {   
                this.checked = false;
            }
        },
        //部门变化
        "datas2": function() {
            if(this.datas1.length === this.data3.length && this.datas2.length === this.data1.length) {
                if(this.datas2.length === 0 && this.datas1.length === 0) {
                    this.checked = false;
                }else {
                    this.checked = true;
                }
            }else {
                this.checked = false;
            }
        }
    }
}

</script>

<style lang="less" scoped rel="stylesheet/less">
@import url("../../style/mixin");
@import url("/mailList");


</style>
