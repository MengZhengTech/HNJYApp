<template>
    <div class="fullScreen">
        <HeaderBar title="审批中心" :showBackBtn="true"></HeaderBar>
        <FlowTemplate v-if="!loading">
            <div slot="flowInfo" v-if="flowContent.showFields.length > 0">
                <group class="weui-group p-flowInfoContent">
                    <cell v-for="(item,index) in flowContent.showFields" :key="index"
                        :title="item.showName" :inline-desc="item.showValue.replace(/<[^>]+>/g, '')"></cell>
                </group>
            </div>
            <div slot="flowAttachment" v-if="flowContent.fileList.length > 0">
                <div class="p-title">相关附件</div>
                <!--<group class="p-no-group-top">-->
                    <!--<cell v-for="(item,index) in flowContent.fileList" :key="index"-->
                        <!--:title="item.name + item.ext">-->
                        <!--<x-button :class="previewerShowClass(item.ext)" type="warn" :mini="true" @click.native="goFlowAttachment(item.name,item.url,item.ext,item.onlineFilePath)">查看</x-button>-->
                    <!--</cell>-->
                <!--</group>-->
                <grid :cols="3">
                    <grid-item v-for="(item,index) in flowContent.fileList" :key="index" @click.native="goFlowAttachment(item)">
                        <i slot="icon" :class="getFileTypeClass(item.ext)" class="fa p-file"></i>
                        <span slot="label">{{item.name + item.ext}}</span>
                    </grid-item>
                </grid>
            </div>
            <div slot="flowOperation">
                <div class="fixedBottom" v-if="type == 1">
                    <x-button type="warn" @click.native="goFlowOpinion">查看审批意见</x-button>
                </div>
                <div class="fixedBottom" v-else-if="type == 2">
                    <flexbox>
                        <flexbox-item>
                            <x-button type="warn" @click.native="goFlowCheck">我要审批</x-button>
                        </flexbox-item>
                        <flexbox-item>
                            <x-button type="warn" @click.native="goFlowOpinion">查看审批意见</x-button>
                        </flexbox-item>
                    </flexbox>
                </div>
                <div class="fixedBottom" v-if="type == 3">
                    <x-button type="warn" @click.native="goFlowOpinion">查看审批意见</x-button>
                </div>
                <div class="fixedBottom" v-if="type == 4">
                    <x-button type="warn" @click.native="startFlow">发起流程</x-button>
                </div>
            </div>
        </FlowTemplate>
        <!--  -->
        <popup height="100%" v-model="showPopup">
            <x-header :left-options="{showBack: false}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
                {{curPopupTitle}}
                <a slot="right" href="javascript:;" @click="toggleDialog"><i class="fa fa-close"></i></a>
            </x-header>
            <BodyContent :showBottomPadding="false">
                <iframe v-if="curTableUrl" slot="content" :src="curTableUrl" width="100%" height="100%" frameborder="0"></iframe>
                <div v-else slot="content">暂无数据</div>
            </BodyContent>
        </popup>
        <div v-transfer-dom>
            <previewer :list="picList" ref="previewer" :options="options"></previewer>
        </div>
        <!-- 附件弹层 -->
        <popup height="100%" v-model="showFilePopup">
            <x-header :left-options="{showBack: false}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
              {{curFloderName}}
              <a slot="right" href="javascript:;" @click="closeFilePopup"><i class="fa fa-close"></i></a>
            </x-header>
            <BodyContent :showBottomPadding="false">
                <!--<div v-else slot="content">暂无数据</div>-->
                <grid :cols="3" slot="content">
                    <grid-item v-for="(item,index) in curFolderFiles" :key="index" @click.native="goFlowAttachment(item)">
                        <i slot="icon" :class="getFileTypeClass(item.ext)" class="fa p-file"></i>
                        <span slot="label">{{item.name + item.ext}}</span>
                    </grid-item>
                </grid>
            </BodyContent>
        </popup>
    </div>
</template>
<script>
import HeaderBar from '@/components/header/Header';
import FlowTemplate from '@/components/FlowTemplate/FlowTemplate';
import BodyContent from "@/components/content/BodyContent";
import TableView from '@/components/common/TableViewReader';
import apiConfig from '../../../server/apiConfig';
import axios from 'axios';
import globalData from '../../../server/globalData';
import { Group, Cell, XButton, Flexbox, FlexboxItem, Popup, XHeader, Previewer, TransferDom, Grid, GridItem, GroupTitle } from 'vux';
export default {
    directives: {
        TransferDom
    },
    computed: {

    },
    data(){
        return{
            flowContent: [],
            tableName: null,
            referFieldName: null,
            referFieldValue: null,
            actList:null,
            flowId: null,   // 流程Id
            flowInstanceId: null,   // 流程实例Id
            stepId:null,    // 当前步骤Id
            type: null, // 判断流程状态 1.已审 2.未审 3.已发 4.未发
            loading: false,
            showPopup: false, // 是否显示弹窗
            showFilePopup: false, // 显示文件夹弹窗
            curFloderName: '',
            curPopupTitle: '附件标题',
            curTableUrl: null,
            picList: [], // 查看附件 图片数组
            breadPath: [], // 文件夹面包屑
            curFolderFiles: [], //
            options: {
                getThumbBoundsFn (index) {
                    // find thumbnail element
                    let thumbnail = document.querySelectorAll('.previewer-show-img')[index]
                    // get window scroll Y
                    let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                    let rect = thumbnail.getBoundingClientRect()
                    // w = width
                    return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
                }
            }
          }
    },
    methods:{
        getFlowContent(){
            this.$vux.loading.show({
                text: '加载中'
            });
            this.loading = true;
            axios.get(apiConfig.companyServer + apiConfig.flowContent.pageUrl
                    + '?tableName='+this.tableName
                    +'&referFieldName=' + this.referFieldName
                    +'&referFieldValue='+this.referFieldValue
                    +'&userId=' + globalData.user.guid)
                .then(res=>{
                    this.flowContent = res.data;
                    this.actList = res.data.actList;
                    this.flowId = res.data.flowId;
                    this.flowInstanceId = res.data.flowInstanceId;
                    this.stepId = res.data.stepId;
                    this.loading = false;
                    this.$vux.loading.hide();
                }).catch(err=>{
                    console.log(err);
                    this.loading = false;
                    this.$vux.loading.hide();
                });
        },
        goFlowOpinion(){
            this.$router.push({name:'FlowOpinion',query:{flowInstanceId:this.flowInstanceId}});
        },
        goFlowAttachment:function(item){
            if(item.ext == ""){
                // 拓展名为空
            }else if(item.ext == "folder"){
                this.$vux.loading.show({
                    text: '加载中'
                });
                this.breadPath.push({
                    folderName: item.name,
                    structId: item.keyValue,
                });
                this.showFilePopup = true;
                this.curFloderName = item.name;
                axios.get(apiConfig.companyServer+apiConfig.getFolderFile+
                    "?userId="+globalData.user.guid +
                    "&tableName="+this.flowContent.tableName +
                    "&referFieldName="+this.flowContent.referFieldName +
                    "&referFieldValue="+this.flowContent.referFieldValue +
                    "&structId="+item.keyValue)
                .then((res)=>{
                    console.log(res);
                    this.curFolderFiles = res.data;
                    this.$vux.loading.hide();
                }).catch((msg)=>{
                    console.log(msg);
                    this.$vux.loading.hide();
                });
            } else if(globalData.fileType.img.indexOf(item.ext.toLowerCase())!== -1 && item.onlineFilePath){ // 预览图片格式
                if(this.picList.length > 0){
                    this.picList = [];
                }
                this.picList.push({
                  src: item.onlineFilePath,
                  w: 800, h: 400
                });
                this.$refs.previewer.show(0);
            }else if(globalData.fileType.other.indexOf(item.ext.toLowerCase())!== -1){ // office pdf
                console.log(item)
            }else{ // 未知文件格式
                this.$vux.alert.show({
                    title: '未知文件类型',
                    content: '系统暂未支持该类型文件预览！'
                });
            }
        },
        goFlowCheck(){
            globalData.flow.actList = this.actList;
            globalData.flow.flowId = this.flowId;
            globalData.flow.flowInstanceId = this.flowInstanceId;
            globalData.flow.stepId = this.stepId;
            this.$router.push({name:'FlowCheck',query:{
                // flowId:this.flowId,
                // flowInstanceId: this.flowInstanceId,
                // stepId: this.stepId,
                // tableName:this.tableName,
                // referFieldName:this.referFieldName,
                // referFieldValue:this.referFieldValue,
            }});
        },
        startFlow(){
            // 发起流程
        },
        showTable(item){
            this.showPopup = true;
            this.curPopupTitle = item.name;
            this.curTableUrl = apiConfig.webViewServer + decodeURIComponent(item.url) + '&uid=' + globalData.user.guid;
        },
        toggleDialog(){
            this.showPopup = false;
            this.curPopupTitle = "暂无附件";
        },
        getFileTypeClass: function (fileExt){
            let iconClass;
            let ext = fileExt.toLowerCase();
            if(globalData.fileType.img.indexOf(ext)!== -1){
                return 'fa-file-image-o previewer-show-img';
            }else{
                switch(ext) {
                    case '.doc':
                        iconClass= "fa-file-word-o";
                        break;
                    case '.docx':
                        iconClass= "fa-file-word-o";
                        break;
                    case '.xls':
                        iconClass= "fa-file-excel-o";
                        break;
                    case '.xlsx':
                        iconClass= "fa-file-excel-o";
                        break;
                    case '.ppt':
                        iconClass= "fa-file-powerpoint-o";
                        break;
                    case '.pptx':
                        iconClass= "fa-file-powerpoint-o";
                        break;
                    case '.pdf':
                        iconClass= "fa-file-pdf-o";
                        break;
                    case 'folder':
                        iconClass= "fa-folder";
                        break;
                    default:
                        iconClass= "fa-file-o";
                }
                return iconClass;
            }
        },
        closeFilePopup:function(){
            this.breadPath.pop();
            if(this.breadPath.length == 0){
                this.showFilePopup = false;
            }else{
                this.$vux.loading.show({
                  text: '加载中'
                });
                let lastFolder = this.breadPath[this.breadPath.length-1];

                this.curFloderName = lastFolder.folderName;
                axios.get(apiConfig.companyServer+apiConfig.getFolderFile+
                    "?userId="+globalData.user.guid +
                    "&tableName="+this.flowContent.tableName +
                    "&referFieldName="+this.flowContent.referFieldName +
                    "&referFieldValue="+this.flowContent.referFieldValue +
                    "&structId="+lastFolder.structId)
                .then((res)=>{
                    console.log(res.data);
                    this.curFolderFiles = res.data;
                    this.$vux.loading.hide();
                }).catch((msg)=>{
                    console.log(err);
                    this.$vux.loading.hide();
                });
            }
        }
    },
    beforeMount(){
        this.tableName = this.$route.query.tableName;
        this.referFieldName = this.$route.query.referFieldName;
        this.referFieldValue = this.$route.query.referFieldValue;
        this.type = this.$route.query.type;
        this.getFlowContent();
    },
    components:{
        HeaderBar, FlowTemplate, Group,
        Cell, XButton, XHeader, BodyContent,
        Flexbox, FlexboxItem, Popup, TableView,
        Previewer, Grid, GridItem, GroupTitle,
    }
}
</script>
<style scoped>
    .title{
        margin-top: 0.5rem;
    }
    .weui-group>.vux-no-group-title.weui-cells{
        margin-top: 0;
    }
    .weui-cells{
        margin-top: 0;
    }
</style>
<style>
  .p-flowInfoContent .vux-no-group-title{
      margin-top: 0 !important;
  }
</style>

