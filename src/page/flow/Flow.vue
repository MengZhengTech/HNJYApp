<template>
    <div class="fullScreen">
        <HeaderBar title="审批中心"></HeaderBar>
        <BodyContent :showBottomPadding="true">
            <div slot="content" class="fullScreen">
                <tab v-model="tabIndex">
                    <tab-item @on-item-click="changeFlowItem">待审流程</tab-item>
                    <tab-item @on-item-click="changeFlowItem">已审流程</tab-item>
                    <!--<tab-item>待发流程</tab-item>-->
                    <!--<tab-item>已发流程</tab-item>-->
                </tab>
                <keep-alive>
                    <UncheckedFlow v-if="tabIndex == 0"></UncheckedFlow>
                </keep-alive>
                <keep-alive>
                    <CheckedFlow v-if="tabIndex == 1"></CheckedFlow>
                </keep-alive>
                <!--<keep-alive>-->
                    <!--<UnsentFlow v-if="tabIndex == 2"></UnsentFlow>-->
                <!--</keep-alive>-->
                <!--<keep-alive>-->
                    <!--<SentFlow v-if="tabIndex == 3"></SentFlow>-->
                <!--</keep-alive>-->
            </div>
        </BodyContent>
    </div>
</template>

<script>
import globalData from '../../server/globalData';
import HeaderBar from '@/components/header/Header';
import BodyContent from "@/components/content/BodyContent";
import CheckedFlow from '@/page/flow/children/CheckedFlow';
import UncheckedFlow from '@/page/flow/children/UncheckedFlow';
import UnsentFlow from '@/page/flow/children/UnsentFlow';
import SentFlow from '@/page/flow/children/SentFlow';
import { Tab, TabItem, Swiper, SwiperItem } from 'vux'

export default {
    data(){
        return {
            tabIndex:parseInt(globalData.getStorage('flowTabIndex').data)|| 0,
            tabSelected:1
        }
    },
    methods:{
        /**
         * 记录当前选中的Tab
         * @param index
         */
        changeFlowItem:function(index){
            globalData.setStorage('flowTabIndex',index);
        }
    },
    beforeMount(){
        globalData.tabSelected = this.tabSelected;
        var localUserInfo = globalData.getStorage('userInfo').data;
        if(this.$route.query.guid && globalData.isWebView){
            let loginUser = globalData.user;
            loginUser.guid = this.$route.query.guid;
            loginUser.userId = this.$route.query.userId;
            loginUser.name = this.$route.query.name;
            console.log('路径上的数据');
            console.log(loginUser);
            globalData.setStorage('userInfo',loginUser);
        }
        else if(localUserInfo.guid && globalData.isWebView){
            let loginUser = globalData.user;
            loginUser.guid = localUserInfo.guid;
            loginUser.userId = localUserInfo.userId;
            loginUser.name = localUserInfo.name;
        }
        else if(globalData.isWebView){ // 检查是否有数据
            //this.$router.push({name:'Login'});
            // console.log("没有获取到用户guid");
            // console.log(this.$route.query)
        }
    },
    components:{
        HeaderBar, BodyContent,
        CheckedFlow, UnsentFlow,
        UncheckedFlow, SentFlow,
        Tab, TabItem,
        Swiper, SwiperItem,
    }
}
</script>

<style scoped>

</style>
