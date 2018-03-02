<template>
  <div>
      <!-- <HeaderBar title="选择加签人员" :showBackBtn="true" ></HeaderBar> -->
      <BodyContent :showTopPadding="false" :showBottomPadding="true">
          <div slot="content">
              <SelectUserItemComponent
                  v-for="(item,index) in groupList" :itemVisible="!!item.itemVisible"
                  :key="index" :titleName="item.name" :userList="item.userList" :flowPosId="item.flowPosId"
                  @listenToChildEvent="getAryFromChild"
              ></SelectUserItemComponent>
          </div>
      </BodyContent>
      <div class="fixedBottom">
          <x-button type="warn" @click.native="makeSureFlowSign" :disabled="!!!selectedList.length">确定人选({{selectedList.length}})</x-button>
      </div>
      <div v-if="flowCommentModal">
        <FlowComment 
            :actType="actType"
            :selectedList="selectedList"
            @listenToToggleComment="syncToggleComment"
        />
      </div>
  </div>
</template>

<script>
import HeaderBar from "@/components/header/Header";
import BodyContent from "@/components/content/BodyContent";
import axios from "axios";
import SelectUserItemComponent from "./SelectUserItemComponent.vue";
import FlowComment from "./FlowComment";
import { XButton } from "vux";

import apiConfig from "../../../server/apiConfig";
export default {
  data() {
    return {
      groupList: [],
      selectedList: [], //已选人员总列表
      flowCommentModal:false,
      actType:null, // 操作类型
    };
  },
  methods: {
    /**
           * 数据格式：{flowPosId: '21',name:'集团-成本部负责人',order:'',orgLevel:"1",userList:[],itemVisible: true,}
           *  flowPosId: 负责人岗位Id
           *  userList: 已选成员
           */
    fetchGroupItem: function() {
      this.$vux.loading.show({
        text: "加载中"
      });
      axios
        .get(
          apiConfig.companyServer +
            apiConfig.selectUserGroup +
            "?flowInstanceId=" +
            this.$route.query.flowInstanceId
        )
        .then(res => {
          this.groupList = res.data;
          this.groupList.forEach(v => {
            v.itemVisible = true;
          });
          this.$vux.loading.hide();
        })
        .catch(err => {
          this.$vux.loading.hide();
        });
    },
    /**
         *  更新选取人员数组
         */
    updateSelectAry: function() {
      this.selectedList = []; // 清空
      this.groupList.forEach((item, index) => {
        if (item.userList.length > 0) {
          this.selectedList = this.selectedList.concat([{name:item.name,userList:item.userList,flowPosId:item.flowPosId}]);
        }
      });
    },
    getAryFromChild: function(data) {
      let flowPosId = data.flowPosId;
      this.groupList.forEach((item, index) => {
        if (item.flowPosId == flowPosId) {
          item.userList = []; //赋值前先置空
          item.userList = data.data;
        }
      });
      this.updateSelectAry();
    },
    makeSureFlowSign: function() {
      console.log("获取的人员列表");
      console.log(this.selectedList);
      this.flowCommentModal = true;
    },
    syncToggleComment(newState) {
      this.flowCommentModal = newState;
    }
  },
  components: {
    HeaderBar,
    BodyContent,
    SelectUserItemComponent,
    XButton,
    FlowComment
  },
  beforeMount() {
    this.fetchGroupItem();
    this.actType = this.$route.query.actType;
  }
};
</script>
