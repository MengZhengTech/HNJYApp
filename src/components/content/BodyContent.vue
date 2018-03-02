/**
* Created by Administrator on 2017/11/13.
*/
<!-- main content showBottomPadding?55px:0 -->
<template>
    <view-box ref="viewBox" :body-padding-top="showTop" :body-padding-bottom="showBottom">
        <!-- 主体 -->
        <slot name="content"></slot>
    </view-box>
</template>

<script>
    import {ViewBox} from 'vux';
    export default{
        props:{
            showBottomPadding:{ // 是否有底部Tab
                default: true,
            },
            showTopPadding:{
                default:true,
            }
        },
        components:{
            ViewBox
        },
        //状态值
        data(){
            return {
            }
        },
        computed:{
            showBottom: function(){
                return this.showBottomPadding?"55px":"0";
            },
            showTop:function(){
                return this.showTopPadding?"46px":"0";
            }
        }
    }
</script>

<style>
</style>
