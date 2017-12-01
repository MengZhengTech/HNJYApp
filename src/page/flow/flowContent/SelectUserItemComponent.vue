<template>
    <div>
        <div @click="toggleChild" class="p-userItemHeader">
            <i class="fa" :class="temp_ivData?'fa-plus':'fa-minus'"></i>
            <span style="width:calc(100% - 60px)">{{titleName}}</span>
            <badge :text="selectedList.length" :style="{background: activeColor}"></badge>
        </div>
        <!-- 人员列表 -->
        <group v-if="!!!temp_ivData">
            <!-- 已选人员列表 单选的时候必须设置 max=1 -->
            <checklist v-if="selectedList.length>0" label-position="right" required v-model="defaultSelectAry"
                       :options="selectedList" @on-change="changeItem" :max="1"
            ></checklist>
            <cell is-link >
                <div slot="title" style="color:green;">
                    <p style="vertical-align:middle;" @click="showSearchBar">选择指定人员</p>
                </div>
            </cell>
        </group>
        <div v-if="userSelectModal">
            <SelectUser
              @listenToToggleSearchBar="syncToggleState"
              @listenSelectedUserList="getUserFromSearchBar"
              :multiple="false"
            />
        </div>
    </div>
</template>

<script>
  import { Cell, Group, Badge, Radio, CheckIcon, Checklist, } from 'vux';
  import SelectUser from './SelectUser.vue';
  export default {
    data () {
        return {
            temp_ivData: this.itemVisible, //  当前是否收折
            selectedList: this.userList, //　子组件中存的已选人员列表 用来渲染选择人员的列表
            selectedUserAry: [], // 回传到父级的当前组件已选人员（加减）
            userSelectModal: false, //　是否处于用户选择模式下
            curFlowPosId: this.flowPosId, //当前组件负责人岗位Id
            defaultSelectAry: [], // 默认选中的项
        }
    },
    props:{
        itemVisible:{
            type: Boolean,
            default: true,
        },
        titleName:{
            type: String,
            default: '',
        },
        userList:{
            default:[],
        },
        flowPosId:{
            default: ""
        }
    },
    computed: {
        activeColor:function(){
            return this.selectedList.length ? '#f74c31': '#ccc';
        }
    },
    components: {
        Cell, Group, Badge, SelectUser, Radio, CheckIcon, Checklist
    },
    beforeMount(){
        this.sendMsgToParent(0); // 初始化当前组件状态时需先同父组件同步状态
    },
    methods:{
        toggleChild:function(){
            this.temp_ivData = !this.temp_ivData;
        },
        sendMsgToParent(){ // 将当前选择的人员返回父组件中
            this.$emit('listenToChildEvent',{flowPosId:this.curFlowPosId,data:this.selectedUserAry});
        },
        showSearchBar: function(){
            this.userSelectModal = !this.userSelectModal;
        },
        syncToggleState: function(newState){ // 同步用户选择状态
            this.userSelectModal = newState;
        },
        getUserFromSearchBar: function(data){ // 渲染选取人员列表
            if(Object.prototype.toString.call(data) == "[object Array]" && data.length>1){ // 数组
                this.selectedList = data;
            }else{
                //单选模式 值 用户Id--部门Id
                this.selectedList = [{'key':JSON.stringify(data),'value':data.userName+'--'+data.orgName}];
            }
            let initVal = [];
            this.selectedList.forEach((item)=>{
                initVal.push(item.key);
            });
            this.updateInitAry(initVal); // 选取人员后 默认选中项
        }, // 选择后操作
        changeItem(val, label){ // val 与label 均为数组
            this.selectedUserAry = []; // 将当前数据置空
            val.forEach((item,index)=>{
                this.selectedUserAry.push(JSON.parse(item));
            });
            this.sendMsgToParent(); // 同步
        },
        // 更细初始选中项
        updateInitAry(newAry){
            this.defaultSelectAry = newAry||[];
        }
    }
  }
</script>
<style>
  .p-userItemHeader {
      display:flex;
      align-items: center;
      flex-direction: row;
      background-color: #f6f6f6;
  }
  .p-userItemHeader>i{
      margin: 8px;
      color: #cccccc;
  }
  #vux_view_box_body .weui-cells{
      margin-top: 0!important;
  }
</style>
