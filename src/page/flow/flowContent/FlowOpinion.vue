<template>
    <div>
        <!-- <HeaderBar title="审批意见" :showBackBtn="true"></HeaderBar> -->
        <BodyContent :showTopPadding="false" :showBottomPadding="false">
            <div v-if="loaded" slot="content">
                <TimeLine>
                    <TimeLineItem
                        v-for="(item,index) in flowOptionAry"
                        :key="index" :isActive="item.createDate?true:false"
                    >
                        <!-- 头部 -->
                        <div class="p-head">
                            <div class="p-actionType">{{item.actionTypeName}}</div>
                            <div class="p-createTime">{{item.createDate}}</div>
                        </div>
                        <div class="p-preStepName" v-if="item.approvalUser||item.preStepName">{{item.approvalUser}} - {{item.preStepName}}</div>
                        <div class="p-flowResult">{{item.result.replace(/<[^>]+>/g, '').replace('&nbsp;', '')}}</div>
                        <div class="p-flowContent">{{item.content.replace(/<[^>]+>/g, '').replace('&nbsp;', '') == '会签确认'?'同意':item.content.replace(/<[^>]+>/g, '').replace('&nbsp;', '')}}</div>
                    </TimeLineItem>
                </TimeLine>
            </div>
            <div v-else class="p-no-data-panel" slot="content">
                <divider>数据加载中...</divider>
            </div>
        </BodyContent>
    </div>
</template>
<script>
import HeaderBar from '@/components/header/Header';
import BodyContent from "@/components/content/BodyContent";
import TimeLine from '../../../components/common/TimeLine.vue';
import TimeLineItem from '../../../components/common/TimeLineItem.vue';
import { Divider } from 'vux';

import apiConfig from '../../../server/apiConfig';
import axios from 'axios';
import globalData from '../../../server/globalData';

export default {
    props:{
        flowInstanceId:null,
    },
    data(){
        return {
            flowOptionAry: null,
            isLoading: false, // 加载指示器
            loaded: false, //页面是否已经加载
        }
    },
    components:{
        HeaderBar, BodyContent,
        TimeLine, TimeLineItem, Divider,
    },
    methods:{
        fetchData(){
            this.isLoading = true;
            this.$vux.loading.show({
                text: '加载中'
            });
            axios.get(apiConfig.companyServer+apiConfig.commonApproveLogUrl+"?flowInstanceId="+this.flowInstanceId).then(res=>{
            // axios.get(apiConfig.companyServer+apiConfig.commonApproveLogUrl+"?flowInstanceId="+this.$route.query.flowInstanceId).then(res=>{
                console.log(res);
                this.flowOptionAry = res.data;
                this.isLoading = false;
                this.loaded = true;
                this.$vux.loading.hide(); // 关闭遮罩
            }).catch(error=>{
                this.isLoading = false;
                this.$vux.loading.hide(); // 关闭遮罩
                console.log(error);
            })
        },
        showActive:function(activeType){
            console.log(activeType)
            return true;
        }
    },
    beforeMount(){
        this.fetchData();
    },
}
</script>
<style>
  .p-head{
      display: flex;
      justify-content: space-between;
  }
  .p-head>div{
      display: inline-block;
  }
  .p-head .p-createTime{
      font-size: 12px;
      color: #cccccc;
  }
  .p-head .p-actionType{
      font-size: 14px;
  }
  .p-preStepName{
      margin-top: 5px;
      font-size: 12px;
      color: #cccccc;
  }
  .p-flowContent{
      margin-top: 5px;
      font-size: 14px;
      color: #cccccc;
  }
  .p-flowResult{
      margin-top: 5px;
      font-size: 14px;
      color: #B72B21;
  }
</style>


