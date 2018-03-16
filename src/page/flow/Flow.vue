<template>
    <div class="fullScreen">
        <!-- <HeaderBar title="审批中心"></HeaderBar> -->
        <BodyContent :showTopPadding="false" :showBottomPadding="false">
            <div slot="content" class="fullScreen">
                <tab v-model="tabIndex">
                    <tab-item @on-item-click="changeFlowItem">待审流程</tab-item>
                    <tab-item @on-item-click="changeFlowItem">已审流程</tab-item>
                    <!-- <tab-item @on-item-click="changeFlowItem">待发流程</tab-item> -->
                    <tab-item @on-item-click="changeFlowItem">已发流程</tab-item>
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
                <keep-alive>
                    <SentFlow v-if="tabIndex == 2"></SentFlow>
                </keep-alive>
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
import { Tab, TabItem, Swiper, SwiperItem } from 'vux';
import apiConfig from '../../server/apiConfig';
import axios from 'axios';

export default {
    data(){
        return {
            // tabIndex:parseInt(globalData.getStorage('flowTabIndex').data)|| 0,
            tabIndex:0,
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
            //  模拟登录
            if(loginUser.name && loginUser.pwd){
                loginUser.name = this.$route.query.loginName;
                loginUser.pwd = this.$route.query.loginPwd;

                let param = new URLSearchParams();
                param.append("userName", loginUser.name);
                param.append("passWord", loginUser.pwd);
                axios.post(apiConfig.companyServer + apiConfig.login,param ).then((response)=>{
                    let data = response.data;
                    if(data.state === 1){
                        globalData.isLogin = true;
                        globalData.user={
                            userId: data.userId, // 用户Id
                            name: data.name,  // 用户名
                            loginName: data.loginName,
                            guid: data.guid,
                        };
                        globalData.setStorage('userInfo',data);
                    }else{
                        this.$vux.toast.text(data.Message, 'bottom');
                    }
                }).catch(error=>{
                });
            }
            globalData.setStorage('userInfo',loginUser);
        }
        else if(localUserInfo.guid && globalData.isWebView){
            let loginUser = globalData.user;
            loginUser.guid = localUserInfo.guid;
            loginUser.userId = localUserInfo.userId;
            loginUser.name = localUserInfo.loginName;
            loginUser.pwd = localUserInfo.loginPwd;
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
