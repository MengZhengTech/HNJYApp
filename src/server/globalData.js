/**
 * Created by Administrator on 2017/11/13.
 */
/****系统全局数据****/
export default {
    isLogin: false,
    user:{
        // 曲留兵
        guid: "58ace6cf61607c55e0865aa2",//"58b77e6f9f5d0113e8f0f1cc",
        userId: 847, // 用户Id
        name: 'QLB',  // 用户名
        avatar: null,  //头像
        // admin
        // guid:"5406bebbb0909c60e47752df",
        // //guid:'58acf79761607c05280164a5',
        // userId: 1, // 用户Id
        // name: 'admin',  // 用户名
        // avatar: null,  //头像
    },
    tabSelected:0,
    fileType:{
        img:['.png','.jpg','.gif','.bmp','.jpeg'],
        other:['.pdf','.doc','.xls','.ppt','.docx','.xlsx','.pptx']
    },
    flow:{
        actList:null, // 流程操作列表，例如：通过，驳回，加签...
        flowId:null,
        flowInstanceId:null,
        stepId:null,
        actId:null,
    },

    getUrlKey:function(name){
        return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
    },
}
