<template>
    <div class="fullScreen">
        <!-- <HeaderBar title="审批中心" :showBackBtn="true"></HeaderBar> -->
        <div class="fullScreen" v-if="!loading">
            <BodyContent :showTopPadding="false">
                <div slot="content">
                    <div class="comment">
                        <group title="填写审批意见：">
                            <x-textarea v-model="comment"  :max="200" :show-counter="false" :height="200"></x-textarea>
                        </group>
                    </div>
                    <div class="fixedBottom" v-if="actList.length > 0">
                        <flexbox>
                            <flexbox-item v-for="(item,index) in mainAct" :key="index">
                                <x-button type="warn" @click.native="operation(item.type)">{{item.name}}</x-button>
                            </flexbox-item>
                            <flexbox-item v-if="moreAct.length > 0">
                                <x-button @click.native="showMore">更多</x-button>
                            </flexbox-item>
                        </flexbox>
                    </div>
                    <actionsheet v-model="popupShow" :menus="actMenu" @on-click-menu="operation"></actionsheet>
                    <div v-if="userSelectModal">
                        <SelectUser
                            @listenToToggleSearchBar="syncToggleState"
                            @listenSelectedUserList="getUserFromChild"
                        />
                    </div>
                    <div v-if="flowCommentModal">
                        <FlowComment
                            :actType="actType"
                            :givenUser="givenUser"
                            @listenToToggleComment="syncToggleComment"
                        />
                    </div>
                    <actionsheet 
                    v-model="rejectShow" 
                    :menus="rejectMenu" 
                    @on-click-menu="rejectAct"
                    show-cancel >
                        <div slot="header">
                            <p v-html="rejectTitle" style="font-size:1rem;font-weight:bold;color:#C30D23;"></p>
                            <p v-if="rejectUserInfo" style="font-size:0.8rem;color:gray;">
                                （即将驳回给 <span style="font-weight:bold;">{{rejectUserInfo.flowPosName+' '+rejectUserInfo.userName}}</span>）
                            </p>
                        </div>
                    </actionsheet>
                    <div v-if="rejectUserModal">
                        <RejectUser 
                            :flowInstanceId="flowInstanceId"
                            @listenRejectUser="getRejectUserFromChild"
                            @listenToToggleRejectUser="syncToggleRejectUser"
                        />
                    </div>
                </div>
            </BodyContent>
        </div>
    </div>
</template>
<script>
import HeaderBar from '@/components/header/Header'
import BodyContent from "@/components/content/BodyContent"
import apiConfig from '../../../server/apiConfig'
import axios from 'axios'
import globalData from '../../../server/globalData'
import SelectUser from './SelectUser.vue';
import FlowComment from './FlowComment';
import RejectUser from './rejectUser';
import { Group,XTextarea,XButton,Flexbox,FlexboxItem,Popup,Actionsheet,PopupPicker  } from 'vux'
export default {
    data(){
        return {
            popupShow:false,
            userSelectModal:false,
            flowCommentModal:false,
            actList:[],
            mainAct:[],
            moreAct:[],
            actMenu:{},
            rejectShow:false,
            rejectMenu:['是','否'],
            rejectTitle:'驳回的节点是否在通过后直接返回本人？',
            rejectUserModal:false,
            rejectUserInfo:null,
            jumpStepId:0,
            // tableName:null,
            // referFieldName:null,
            // referFieldValue:null,
            flowId: null,   // 流程Id
            flowInstanceId: null,   // 流程实例Id
            stepId:null,    // 当前步骤Id
            backToRefuserStepId:null,   // 驳回流程Id
            actType:null,
            comment:'',     // 审批意见
            flowContentData: '',
            givenUser:null,
            loading:false,
        }
    },
    methods:{
        showMore(){
            this.popupShow = true;
        },
        syncToggleState: function(newState){ // 同步用户选择状态
            this.userSelectModal = newState;
        },
        getUserFromChild: function(data){
            console.log('以下是从组件获取的人员信息！');
            console.log(data);
            if(data.userId != globalData.user.userId){
                this.givenUser = data;
                this.flowCommentModal = !this.flowCommentModal;
            }else{
                this.$vux.toast.show({
                    type:'warn',
                    text: '转办对象有误',
                })
            }
        },
        getRejectUserFromChild(data){
            this.rejectUserInfo = data;
            this.rejectShow = !this.rejectShow;
        },
        syncToggleComment(newState){
            this.flowCommentModal = newState;
        },
        syncToggleRejectUser(newState){
            this.rejectUserModal = newState;
        },
        operation(type,item){
            var self = this;
            type = type + '';
            switch(type){
                case '1': // 会签确认
                    self.doActions(apiConfig.doAction,{actId: 2, attitude: 1});
                    break;
                case '2': // 通过
                    this.$vux.confirm.show({
                        title:'请确认审批操作',
                        content:'您选择的审批操作为“通过”',
                        onConfirm(){
                            self.doActions(apiConfig.doAction,{actId: 3, attitude: 1});
                        },
                    });
                    break;
                case '3': // 驳回
                    // this.$vux.confirm.show({
                    //     title:'请确认审批操作',
                    //     content:'您选择的审批操作为“驳回”',
                    //     onConfirm(){
                    //         self.doActions(apiConfig.doAction,{actId: 4, attitude: 0})
                    //     },
                    // });
                    globalData.flow.actId = 0;
                    this.actType = 3;
                    //this.userSelectModal = !this.userSelectModal;
                    this.rejectUserModal = !this.rejectUserModal;
                    break;
                case '4': // 集团驳回
                    break;
                case '5': // 转办
                    globalData.flow.actId = 0;
                    this.actType = 5;
                    this.userSelectModal = !this.userSelectModal;
                    break;
                case '6': // 提交
                    self.doActions(apiConfig.CirculateComplete + '/' + self.flowInstanceId,{actId: 0})
                    break;
                case '7': // 不同意
                    this.$vux.confirm.show({
                        title:'请确认审批操作',
                        content:'确定不同意并终止流程吗',
                        onConfirm(){
                            self.doActions(apiConfig.ForceAbandonInstance,{actId: 0});
                        },
                    });
                    break;
                case '10': // 当前会签
                    self.$router.push({name:'FlowSign',query:{flowInstanceId:this.flowInstanceId,actType:10}});
                    break;
                case '11': // 加签
                    self.$router.push({name:'FlowSign',query:{actType:11,flowInstanceId:this.flowInstanceId}});
                    break;
                case '12': // 回退
                    this.$vux.confirm.show({
                        title:'请确认审批操作',
                        content:'您选择的审批操作为“回退”，流程将返回给上一级操作',
                        onConfirm(){
                            self.doActions(apiConfig.BackSpaceAction,{actId: 4, attitude: 0});
                        },
                    });
                    break;
                case '13': // 知会
                    this.$router.push({name:'NotifyUser'});
                    break;
                case '14': // 暂存待办
                    this.$vux.confirm.show({
                        title:'请确认审批操作',
                        content:'您选择的审批操作为“暂存待办”',
                        onConfirm(){
                            self.doActions(apiConfig.Trans2Standby+self.flowInstanceId, {remark: self.comment});
                        },
                    });
                    break;
            }
        },
        doActions(url, params){ //params > {key:value} ,actId,attitude,
            let self = this;
            let param = new URLSearchParams();
            param.append("flowId", self.flowId);
            param.append("flowInstanceId", self.flowInstanceId);
            param.append("stepId", self.stepId);
            param.append("content", self.comment);
            param.append("remark", self.comment);
            if(parseInt(self.backToRefuserStepId) > 0){
                param.append('jumpStepId',parseInt(self.backToRefuserStepId));
            }
            else{
                if(parseInt(self.jumpStepId) > 0){
                    param.append('jumpStepId',self.jumpStepId);
                }
                else{
                    param.append('jumpStepId',0);
                }
            }
            for(let key in params){
                param.append(key, params[key]);
            }
            axios.post(apiConfig.companyServer + url,param)
                .then(res=>{
                    if(res.data.Success){
                        this.$vux.toast.show({
                            text: '操作成功'
                        });
                        setTimeout(()=>{
                            self.$router.push({name:'Flow'});
                        },500)
                    }else{
                        this.$vux.toast.show({
                            text: '未知错误，请联系管理员或刷新重试！',
                            type: 'warn'
                        });
                    }
                }).catch(err=>{
                    console.log(err);
                });
        },
        rejectAct(key,item){
            var self = this;
            self.jumpStepId = self.rejectUserInfo.stepId;
            if(item == '是'){
                self.doActions(apiConfig.doAction,{actId: self.rejectUserInfo.backToLaunchActId, attitude: 0})
            }
            else if(item == '否'){
                self.doActions(apiConfig.doAction,{actId: 9, attitude: 0})
            }
        }
    },
    beforeMount(){

        const self = this,initData = JSON.parse(globalData.getStorage('curFlowContentInfo').data);
        const commentWord = this.$route.query.data.stepRemark||initData.stepRemark;
        this.comment = commentWord.replace(/<[^>]+>/g, '').replace(/&nbsp;/g,' ');
        this.flowId = globalData.flow.flowId || initData.flowId;
        this.flowInstanceId = globalData.flow.flowInstanceId || initData.flowInstanceId;
        this.stepId = globalData.flow.stepId || initData.stepId;
        this.backToRefuserStepId = globalData.flow.backToRefuserStepId || initData.backToRefuserStepId;
        this.actList = globalData.flow.actList || initData.actList;
        if(this.actList.length == 1 || this.actList.length == 2){
            this.mainAct = this.actList;
        }else if(this.actList.length > 2){
            this.mainAct = this.actList.slice(0,2);
            this.moreAct = this.actList.slice(2);
            this.moreAct.forEach(function(item,index) {
                this.actMenu[item.type] = item.name;
            }, this);
        }
        console.log(this.actList)
    },
    mounted(){
        if(this.actList.length <= 0){
            var self = this;
            this.$vux.toast.show({
                text: '该流程已结束',
                type: 'warn',
            });
            setTimeout(()=>{
                self.$router.push({name:'Flow'});
            },2000);
        }
    },
    components:{
        HeaderBar,
        BodyContent,
        SelectUser,
        FlowComment,
        RejectUser,
        Group,
        XTextarea,
        XButton,
        Flexbox,
        FlexboxItem,
        Popup,
        Actionsheet,
        PopupPicker
    }
}
</script>
<style scoped>
    .comment{
        padding: 0 1rem;
    }
</style>
