<template>
    <div>
        <popup height="100%" v-model="searchBarVisible">
            <x-header :left-options="{showBack: false}" style="width:100%;position:absolute;left:0;top:0;z-index:100;">
                驳回人员选择
                <a slot="right" href="javascript:;" @click="toggleDialog"><i class="fa fa-close"></i></a>
            </x-header>
            <BodyContent :showBottomPadding="isMultiple">
                <div slot="content">
                    <div v-if="userList.length > 0" style="background-color: #fff;" :style="{'padding-top': '0rem'}">
                        <group>
                            <cell v-for="(item,index) in userList"
                                :key="index" :title="item.flowPosName + ' ' +item.userName"
                                @click.native="addUser(item)"
                            >
                            </cell>
                        </group>
                    </div>
                </div>
            </BodyContent>
            <div v-if="isMultiple" class="fixedBottom">
                <x-button type="warn" @click.native="returnSelectList" :disabled="!!!selectedList.length">确定人选({{selectedList.length}})</x-button>
            </div>
        </popup>
    </div>
</template>
<script>
import HeaderBar from '@/components/header/Header';
import BodyContent from "@/components/content/BodyContent";
import apiConfig from '../../../server/apiConfig';
import axios from 'axios';
import globalData from '../../../server/globalData'
import { Search, XButton, Group, Cell, Popup, TransferDom, XHeader, } from 'vux';
export default {
    data(){
        return{
            keyWord:null,
            userList:[],
            userName:[],
            searchBarVisible: this.isVisible,
            isMultiple: this.multiple,  // 是否多选
            selectedList: [], // 已选人员列表
        }
    },
    props:{ // 参数列表
        isVisible:{ // 父级传递当前dialog 是否可见状态
            type: Boolean,
            default: true,
        },
        flowInstanceId:null
    },
    methods:{
        getUser(){ // 搜索用户
            this.$vux.loading.show({
                text: '加载中'
            });
            axios.get(apiConfig.companyServer + apiConfig.GetDoneUserList + '?flowInstanceId=' + this.flowInstanceId)
                .then(res=>{
                    this.userList = res.data;
                    this.$vux.loading.hide();
                }).catch(err=>{
                    this.$vux.loading.hide();
                });
        },
        /**
         * 显示当前组件是否可见
         * 需要在父组件中监听listenToToggleRejectUser 用来更新父组件传到该组件的起始状态
         */
        toggleDialog(){
            this.searchBarVisible = !this.searchBarVisible;
            this.$emit('listenToToggleRejectUser',this.searchBarVisible);
        },// 选择人员
        addUser(userInfo){
            let dataInfo = null;
            if(this.isMultiple){ //多选
                this.selectedList.push(userInfo);
            } else { // 单选
                dataInfo = userInfo;
                this.exportDataToParent(dataInfo);
            }
        },
      /**
       * 提交人员到父组件 需在父组件监听 listenSelectedUserList
       * @param selectedUser
       */
        exportDataToParent(selectedUser){
            this.searchBarVisible = false;
            this.$emit('listenRejectUser',selectedUser);
            this.$emit('listenToToggleRejectUser',this.searchBarVisible);
        }
    },
    beforeMount(){
        if(this.$route.query.userName && this.$route.query.userName.length > 0){
            this.userName = this.$route.query.userName;
        }
        this.getUser();
    },
    directives: {
        TransferDom,
    },
    components:{
        HeaderBar, BodyContent, XHeader,
        Search, XButton, Cell, Group, Popup
    }
}
</script>
<style>
    .vux-search-fixed{
        position: static;
    }
</style>

