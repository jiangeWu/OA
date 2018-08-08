<template>
    <div>

            <input name="file" type="file" @change="update"/>
            <button @click="initObj()">初始化</button>
            <button @click="assignment()">赋值</button>

            <input type="text" v-model="obj.test1">

        <vscroll :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData">
            <ul>
                <li v-for="(item,index) in listdata">{{item.name}}</li>
                <li v-for="(item,index) in downdata">{{item.name}}</li>
            </ul>
        </vscroll>
    </div>
</template>
<script>
    import Vscroll from "../../components/index"
    import axios from 'axios'
    import qs from 'qs'
    export default {
        components: {
            Vscroll,
        },
        data() {
            
            return {
                counter: 1, //当前页
                num: 10, // 一页显示多少条
                pageStart: 0, // 开始页数
                pageEnd: 0, // 结束页数
                listdata: [], // 下拉更新数据存放数组
                downdata: [], // 上拉更多的数据存放数组
                scrollData:{
                    noFlag: false //暂无更多数据显示
                },
                params: {
                    'file':'',
                    'saveFileDir':''
                },
                obj: {
                    test1: 777
                }
                
            }
        },
        mounted: function() {
            this.getList();
            
        },
        methods: {
            initObj() {
                this.obj = {};
            },
            assignment() {
                this.$set(this.obj,'test1',666);
            },

            update (e) {  // 上传照片
                var self = this
                console.log('update');
                let file = e.target.files[0];
                /* eslint-disable no-undef */
                let param = new FormData(); // 创建form对象
                // debugger;
                param.append('file', file, file.name) // 通过append向form对象添加数据
                param.append('chunk', '0') // 添加form表单中其他数据
                param.append('saveFileDir','');
                console.log(param);
                
                console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
                
                debugger;
                let config = {
                    headers:{'Content-Type': 'multipart/form-data',},
                }
               
                this.$http.post('api-notice/notice/mailinternal/uploadMailFile',param,function(response) {
                    param.set('saveFileDir',response.data.datamap.saveFileDir);
                    console.log(response);
                },config) 
            
            },
            //页面加载时的数据
            getList() {
                var response = []
                for(let i = 0; i < 60; i++) {
                    response.push({
                        name: i
                    })
                }
                this.listdata = response.slice(0, this.num);
            },
            //下拉刷新
            onRefresh(done) {
                this.getList();
                done(); // call done
            },
            //上拉加载
            onInfinite(done) {
                this.counter++;
                let end = this.pageEnd = this.num * this.counter;
                let i = this.pageStart = this.pageEnd - this.num;
                let more = this.$el.querySelector('.load-more')
                for(i; i < end; i++) {
                    if(i >= 30) {
                        more.style.display = 'none'; //隐藏加载条
                        //走完数据调用方法
                        this.scrollData.noFlag = true;
                        break;
                    } else {
                        this.downdata.push({
                            name: i + "==="
                        })
                        more.style.display = 'none'; //隐藏加载条
                    }
                }
                done();
            }
        }
    }
</script>

<style lang="less" scoped>
    ul li {
        min-height: 100px;
        line-height: 100px;
        text-align: center;
        border: 1px solid red;
    }
</style>