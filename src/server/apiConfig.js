/**
 * Created by Administrator on 2017/11/9.
 */
'use strict';
const useStaticData = false;
const serverDebug = 'http://192.168.1.19:8000/';
// const serverRelease = 'http://192.168.1.178:9012/';
// const companyServer = 'https://bird.ioliu.cn/v1/?url=http://61.136.122.228:82/'; //建业正式地址
// const companyServer = 'http://192.168.1.115:9023/';
const companyServer = 'https://bird.ioliu.cn/v1/?url=http://123.52.55.88:8080/';
// const companyServer = 'http://192.168.1.7:8030/';
// const companyServer = 'http://123.52.55.88:8080/';
// const companyServer = '/api';
// const companyServer = 'https://bird.ioliu.cn/v1/?url=http://192.168.1.115:9023/';
// const webViewServer = 'http://192.168.1.115:9023/';  // 测试
const webViewServer = 'http://123.52.55.88:8080/';
// const webViewServer = 'http://61.136.122.228:82/';  // 正式

/**
 *  build时需要更改本页的 companyServer  webViewServer 切换为正式的数据
 *
 */
export default {
    companyServer,
    webViewServer,
    // 登录
    login: '/Account/AjaxMobileLogin',
    // 首页
    homeIndexData: '/home/HomeIndexJson', // 首页图片及新闻数据
    newsDetailData: '/home/NewsDetailsJson', // 新闻详情
    brideList: '/home/EmpListJson', // 新人列表
    allNewsList: '/home/NewsListJson', // 完整新闻列表

    // 项目列表数据
    projectData: {
        pageKey: 'projectData',
        pageUrl: useStaticData?serverDebug+'appData/indexData.json':'/home/CityEngList',
    },
    projectInfoPageUrl: '/home/EngineerInfo',
    projectSummaryUrl: '/home/ProjectSummaryJson',
    projectIntroduce: '/home/ProjectIndxSummaryJson',
    projectDesigner: '/home/ProjectDesignerJson',

    // 审批
    flowData:{
        historyFlowKey: 'historyFlowKey',
        currentFlowKey: 'currentFlowKey',
        pageUrl: '/home/GetApprovalList', // 获取审批列表（1 已审 2 待审 3 已发 4 待发）
    },
    flowContent:{
        pageKey: 'flowContent',
        pageUrl: '/home/GetCommonPeddingInstance', // 查看流程详情（包含各个操作接口）
    },
    commonApproveLogUrl: '/home/GetApproveLog', // 查看审批意见 参数　flowInstanceId
    SelectUserPage: {
        pageKey: 'SelectUserPage',
        pageUrl: '/home/CityEnglish',
    },
    selectUserGroup: '/Home/GetFlowPosition', // 参数 flowInstanceId
    searchSysUser: '/home/SearchSysUserList', // 参数 keyWord  GET请求
    GetDoneUserList:'/home/GetDoneUserList', // 获取流程已审人员，用于回退操作，参数 flowInstanceId

    doAction:'/Home/DoAction', // 部分操作接口 attitude: 1,  动作的属性值：1（已阅2，通过1，不通过0）
    //ForceCompleteInstance:'/Home/ForceCompleteInstance', // 终止流程
    ForceAbandonInstance:'/Home/ForceAbandonInstance/', // 不同意并终止流程
    AddCounterSignStep:'/Home/AddCounterSignStep', // 当前会签
    AddAuditStep:'/Home/AddAuditStep', // 加签
    TurnOnToUser:'/Home/TurnOnToUser/', // 转办
    CirculateComplete:'/Home/CirculateComplete',   // 提交
    BackSpaceAction:'/Home/BackSpaceAction', // 回退
    CirculateToUser:'/Home/CirculateToUser/', // 知会
    Trans2Standby: '/Home/SaveStepUserDraft/', // 转存待办 参数 flowInstanceId  ｛remark，stepId｝
    // 知会 参数
    // flowId: this.props.auditData.flowId,
    // givenUserIds: Object.keys(this.state.selectedUsers.toObject()).join(','),
    // grantUserId: GlobalData.user.userId,
    // remark: this.state.remark,

    // 设置
    changeUserPwdData: '/home/ChangeAppUserPwd',
    getFolderFile: '/home/GetApprovalFilesStruct' // 参数string userId, string tableName, string referFieldName, string referFieldValue, int structId)
}
