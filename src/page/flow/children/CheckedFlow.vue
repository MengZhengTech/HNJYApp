<template>
    <div class="fullScreen">
        <div v-if="!loading" class="fullScreen">
            <mt-loadmore class="fullScreen" v-if="flowData.length > 0"
                :top-method="loadTop"
                :autoFill="false"
                ref="loadmore">
                <ul class="content"
                v-infinite-scroll="getFlowData"
                infinite-scroll-disabled="loadmore"
                infinite-scroll-immediate-check="false">
                    <li  v-for="(item,index) in flowData" :key="index">
                        <mt-cell
                        class="flow-cell" :title="item.flowName" :label="item.projName" is-link
                        @click.native="goFlowContent(item.tableName,item.referFieldName,item.referFieldValue)"
                        style="position:relative;">
                            {{item.StartDate}}
                            <div class="completeStatus">
                                <img v-if="item.curStatus == '已完成'" :src="completedIcon" />
                                <img v-else-if="item.curStatus == '审批中'" :src="uncompletedIcon" />
                                <img v-else-if="item.curStatus == '未发起'" :src="unsentIcon" />
                            </div>
                        </mt-cell>
                    </li>
                </ul>
                <divider class="mb55" v-if="allLoaded">已经到底啦</divider>
                <div class="spinner mb55" v-show="loadmore&&!allLoaded">
                    <spinner size="1.5rem"></spinner>
                    正在加载
                </div>

            </mt-loadmore>
            <div v-else class="p-no-data-panel">
                <divider>暂无数据</divider>
            </div>
        </div>
    </div>
</template>

<script>
import apiConfig from '../../../server/apiConfig';
import axios from 'axios'
import globalData from '../../../server/globalData'
import { Divider,LoadMore,Spinner } from 'vux'
export default {
    data(){
        return{
            flowData:[], // 页面数据
            type:1, // 数据类型
            loading:false,
            firstLoad:false, // 判断当前页是否为初次加载
            allLoaded:false, // 判断数据是否全部加载完成
            currentPage:0, // 数据页码
            pageSize:10, // 每页数据量
            loadmore:false, //判断页面底部是否正在加载更多
            completedIcon:require('../../../assets/images/icons/icon022.png'),
            uncompletedIcon: require('../../../assets/images/icons/icon001.png'),
            unsentIcon: require('../../../assets/images/icons/icon003.png'),
        }
    },
    methods:{
        getFlowData:function(refresh){
            if(!refresh){
                this.loadmore = true;
            }
            if(!this.firstLoad){
                this.firstLoad = true;
                this.loading = true;
                this.$vux.loading.show({
                    text: '加载中'
                });
            }
            this.currentPage += 1;
            if(globalData.beforeLoadCheckUser()) {
                axios.get(apiConfig.companyServer + apiConfig.flowData.pageUrl
                    + '?type='+this.type+'&userId=' + globalData.user.guid
                    + '&current=' + this.currentPage
                    + '&pageSize=' + this.pageSize)
                .then(res=>{
                    if(res.data.length == 0){
                      this.allLoaded = true;
                    } else{
                        if(refresh){
                          this.flowData = res.data;
                          this.allLoaded = false;
                        } else{
                          this.flowData = this.flowData.concat(res.data);
                        }

                        this.$nextTick(()=>{
                            if(this.$refs.loadmore){
                                this.$refs.loadmore.onTopLoaded();
                            }
                        });
                    }
                    this.loadmore = false;
                    this.loading = false;
                    this.$vux.loading.hide();
                }).catch(err=>{
                    console.log(err)
                    this.loadmore = false;
                    this.loading = false;
                    this.$vux.loading.hide();
                    this.$refs.loadmore.onTopLoaded();
                });
            }
        },
        goFlowContent(tableName,referFieldName,referFieldValue){
            const queryData = {
                tableName:tableName,
                referFieldName:referFieldName,
                referFieldValue:referFieldValue,
                type:this.type
            };
            globalData.setStorage("curFlowInfo",queryData,true);
            this.$router.push({name:'FlowContent',
                query: queryData
            });
        },
        loadTop(){
            this.currentPage = 0;
            this.getFlowData(true);
        },
        loadBottom(){
            this.getFlowData();
        },
    },
    created(){
        this.getFlowData();
    },
    mounted(){

    },
    components:{
        Divider,
        LoadMore,
        Spinner,
    }
}
</script>

<style>
    .completeStatus{
        position: absolute;
        right: 0rem;
        top: 0rem;
    }
</style>
