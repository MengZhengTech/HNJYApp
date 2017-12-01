<template>
    <div class="fullScreen">
        <HeaderBar title="审批中心"></HeaderBar>
        <BodyContent :showBottomPadding="true">
            <div slot="content" class="fullScreen">
                <tab v-model="tabIndex">
                    <tab-item selected>待审流程</tab-item>
                    <tab-item>已审流程</tab-item>
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
            tabIndex:0,
            tabSelected:1
        }
    },
    beforeMount(){
        globalData.tabSelected = this.tabSelected;
        if(this.$route.query.guid){
            let loginUser = globalData.user;
            loginUser.guid = this.$route.query.guid;
            loginUser.userId = this.$route.query.userId;
            loginUser.name = this.$route.query.name;
        } else{
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
