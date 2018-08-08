<template>
    <div>
        <div class="fawen-content">
            <div class="fawen-content-primary">
                <p class="font15">
                    <span>表单详情</span>
                    <a class="fr">查看</a>
                </p>
            </div>
            <div class="fawen-content-ft"></div>
        </div>
    </div>
</template>

<script>

    export default {
        //引用外部组件
        components: {
        },
        //数据源
        data() {
            return {
                
            }
        },
        created() {
           
        },
        mounted() {       
        },
        //行为
        methods: {
            
        },
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    @import url("../../style/mixin");
    .yo-scroll {
        top: 60px!important;
    }
    .fawen-content {
        height: 44px;
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        background-color: #ffffff;
        &:before {
            content: " ";
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            height: 1px;
            border-bottom: 1px solid #e5e5e5;
            color: #D9D9D9;
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
        }
    }
    .fawen-content {
        width: 100vw;
        padding: 10px 15px;
        .fawen-content-primary {
            width: 88vw;
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            flex: 1;
            p {
                width: 100%;
                a, span {
                    .sc(15px,#000);
                }
                
                a.fr {
                    .fr(right);
                    .mgr(10px);
                }
            }
            p{
                span {
                    display: inline-block;
                    width:30%;
                }
                a {
                    display: inline-block;
                    width:65%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    text-align:right;
                }
            }

        }
        .fawen-content-ft {
            padding-right: 13px;
            position: relative;
            text-align: right;
            color: #999999;
            &:after {
                content: " ";
                display: inline-block;
                height: 6px;
                width: 6px;
                border-width: 2px 2px 0 0;
                border-color: #C8C8CD;
                border-style: solid;
                -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
                position: relative;
                top: -2px;
                position: absolute;
                top: 50%;
                margin-top: -4px;
                right: 2px;
            }
        }
        
    }
</style>