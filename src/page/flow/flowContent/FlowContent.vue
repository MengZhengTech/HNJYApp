<template>
    <div class="fullScreen">
        <!-- <HeaderBar title="审批中心" :showBackBtn="true"></HeaderBar> -->
        <FlowTemplate v-if="!loading">
            <div slot="flowInfo" v-if="flowContent.showFields.length > 0">
                <group class="weui-group p-flowInfoContent">
                    <cell v-for="(item,index) in flowContent.showFields" :key="index"
                        :title="item.showName">
                        <div slot="inline-desc" v-html="item.showValue"></div>
                    </cell>
                </group><!--.replace(/<[^>]+>/g, '').replace(/&nbsp;/g,'')-->
            </div>
            <div slot="flowAttachment" v-if="flowContent.fileList.length > 0">
                <div class="p-title">相关附件</div>
                <grid :cols="3">
                    <grid-item class="p-file-grid-item aa" v-for="(item,index) in flowContent.fileList" :key="index" @on-item-click="handleClickItem(item,$event)">
                        <!--<div @click="goFlowAttachment(item)">-->
                            <i slot="icon" :class="getFileTypeClass(item.ext)" class="fa p-file" @click="goFlowAttachment(item)"></i>
                            <span slot="label" @click="goFlowAttachment(item)">{{item.name + (item.ext=="folder"?"":item.ext)}}</span>
                        <!--</div>-->
                        <a v-if="canDownload(item)" mini plain class="mt5" :href="item.url">下载</a>
                    </grid-item>
                </grid>
            </div>
            <!-- 审批操作按钮 -->
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
        <!-- 表格显示 -->
        <popup height="100%" v-model="showPopup">
            <x-header :left-options="{showBack: false}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
                {{curPopupTitle}}
                <a slot="right" href="javascript:;" @click="toggleDialog"><i class="fa fa-close"></i></a>
            </x-header>
            <BodyContent :showBottomPadding="false">
                <iframe v-if="curTableUrl" slot="content" :src="curTableUrl" width="100%" height="100%" frameborder="0"></iframe>
                <div v-else slot="content" class="p-no-data-panel">
                    <divider>文件未上传成功！请稍后重试</divider>
                </div>
            </BodyContent>
        </popup>
        <div v-transfer-dom>
            <previewer @on-close="picClose" :list="picList" ref="previewer" :options="options"></previewer>
        </div>
        <!-- 附件弹层 -->
        <popup height="100%" v-model="showFilePopup">
            <x-header :left-options="{showBack: false}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
              {{curFloderName}}
              <a slot="right" href="javascript:;" @click="closeFilePopup" style="font-size: 24px;"><i class="fa fa-close"></i></a>
            </x-header>
            <BodyContent :showBottomPadding="false">
                <!--<div v-else slot="content">暂无数据</div>-->
                <grid :cols="3" slot="content">
                    <grid-item class="p-file-grid-item" v-for="(item,index) in curFolderFiles" :key="index" @on-item-click="handleClickItem(item,$event)">
                        <div slot="icon" @click="goFlowAttachment(item)">
                            <i :class="getFileTypeClass(item.ext)" class="fa p-file"></i>
                        </div>
                        <span slot="label">{{item.name + (item.ext=="folder"?"":item.ext)}}</span>
                        <a v-if="canDownload(item)" mini plain class="mt5" :href="item.url">下载</a>
                    </grid-item>
                </grid>
            </BodyContent>
        </popup>
        <!-- 附件预览 -->
        <popup height="100%" v-model="showFileReaderPopup">
            <x-header :left-options="{showBack: false}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
                {{curShowFileName}}
                <a slot="right" href="javascript:;" @click="closeFileReaderPopup"><i class="fa fa-close"></i></a>
            </x-header>
            <BodyContent :showBottomPadding="false">
                <iframe style="border: none;" width="100%" height="100%" slot="content" v-if="curFileReaderPath" :src="curFileReaderPath" frameborder="0"></iframe>
                <div v-else slot="content" class="p-no-data-panel" :test="curFileReaderPath">
                    <divider>文件未上传成功！请稍后重试</divider>
                </div>
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
import { Group, Cell, XButton, Flexbox, FlexboxItem, Popup, XHeader, Previewer, TransferDom, Grid, GridItem, GroupTitle, Divider } from 'vux';
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
            backToRefuserStepId:null,   // 驳回流程Id
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
            curShowFileName: '', // pdf附件预览名称
            curFileReaderPath: '',
            showFileReaderPopup: false,
            stepRemark: '', // 转存待办 内容
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
            // console.log(this.tableName)
            // console.log(this.referFieldValue)
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
                    this.backToRefuserStepId = res.data.backToRefuserStepId;
                    this.loading = false;
                    this.$vux.loading.hide();
                    globalData.setStorage('curFlowContentInfo', res.data, true);
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
                });
                this.$refs.previewer.show(0);
            }else if(globalData.fileType.other.indexOf(item.ext.toLowerCase())!== -1){ // office pdf
                this.curShowFileName = item.name;

                this.curFileReaderPath = item.onlineShowUrl;
                this.showFileReaderPopup = true;
            }else{ // 未知文件格式
                this.$vux.alert.show({
                    title: '未知文件类型',
                    content: '系统暂未支持该类型文件预览！'
                });
            }
        },
        handleClickItem:function(item,event){
            if(item.ext === "folder"){
                this.goFlowAttachment(item);
            }
            console.log(event);
        },
        goFlowCheck(){
            globalData.flow.actList = this.actList;
            globalData.flow.flowId = this.flowId;
            globalData.flow.flowInstanceId = this.flowInstanceId;
            globalData.flow.stepId = this.stepId;
            globalData.flow.backToRefuserStepId = this.backToRefuserStepId;
            this.$router.push({name:'FlowCheck',query:{data:this.flowContent}});
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
            console.log(this.breadPath.join("-"));
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
                    this.curFolderFiles = res.data;
                    this.$vux.loading.hide();
                }).catch((msg)=>{
                    console.log(err);
                    this.$vux.loading.hide();
                });
            }
        },
        // 关闭预览弹窗
        closeFileReaderPopup:function(){
            this.showFileReaderPopup = false;
            this.curFileReaderPath = "";
        },
        canDownload:function(item){
            return item.ext === "folder"?false:true;
        },
        downloadFile(item){
            console.log(item)
        },
        /**
         * 防止图片缓存
         */
        picClose(){
            this.picList = [];
        },
    },
    beforeMount(){
        const initData = JSON.parse(globalData.getStorage('curFlowInfo').data);

        this.tableName = this.$route.query.tableName || initData.tableName;
        this.referFieldName = this.$route.query.referFieldName || initData.referFieldName;
        this.referFieldValue = this.$route.query.referFieldValue || initData.referFieldValue;
        this.type = this.$route.query.type || initData.type;

        if(this.$route.query.guid){
            globalData.user.guid = this.$route.query.guid;
        };
        if(globalData.beforeLoadCheckUser()){
            this.getFlowContent();
        }
    },
    components:{
        HeaderBar, FlowTemplate, Group, Divider,
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

