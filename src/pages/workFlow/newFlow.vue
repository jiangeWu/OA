<template>
    <div>
        <search @searchData="searchData"></search>
        <vscroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData">
           <cell :department="department" @goTarget="goFlow"></cell>
        </vscroll>  
        
            
    </div>
</template>

<script>
    import Search from '../../components/search/search';
    import Vscroll from "../../components/refresh/refresh"
    import Cell from '../../components/cell/cell'
    export default {
        
        name: 'daiBanFaWen',
        //引用外部组件
        components: {
            Search,
            Vscroll,
            Cell
        },
        //数据源
        data() {
            return {
                department:[{"departmentName":'请假请假请假请假请假请假请假请假请假请假请假请假请假请假请假请假请假请假请假请假请假请假请假请假'},{"departmentName":'加班'},{"departmentName":'事假'},{"departmentName":'申请'},{"departmentName":'调薪'},{"departmentName":'加薪'},{"departmentName":'前任'},{"departmentName":'你猜'}],
                scrollData:{
                    noFlag: false //暂无更多数据显示
                }
            }
        },
        created() {
           
        },
        mounted() {       
        },
        //行为
        methods: {
            
            //搜索
            searchData(key) {
   
            },
            //上啦刷新
            onRefresh(done) {
                this.todoList.pageIndex = 1;
                this.loadTodoList();
                done(); // call done
            },
            //下拉加载
            onInfinite(done) {
                let that = this;
                let more = this.$el.querySelector('.load-more');
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
               
            },
         
            //待办发文之已已办详情页面
            goFlow(...args) {
                this.$cookie.setCookie('formId',args[0]);
                this.$cookie.setCookie('nodeId',args[1]);
                this.$cookie.setCookie('isSignIn',args[2]);
                this.$router.push({
                    path: '/flow',
                })
            },
           

        },
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    @import url("../../style/mixin");
    @import url("../daiBanFaWen/daiBanFaWen");
    .yo-scroll {
        top: 60px!important;
    }
</style>