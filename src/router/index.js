import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/page/Login'
import Index from '@/page/Index';
import Home from '@/page/home/Home';
import Flow from '@/page/flow/Flow';
import Project from '@/page/project/Project';
import Setting from '@/page/setting/Setting';
import ProjectInfo from '@/page/project/ProjectInfo';
import Mix from '@/page/home/children/Mix';
import News from '@/page/home/children/News';
import Rookies from '@/page/home/children/Rookies';
import FlowContent from '@/page/flow/flowContent/FlowContent';
import FlowOpinion from '@/page/flow/flowContent/FlowOpinion';
import FlowAttachment from '@/page/flow/flowContent/FlowAttachment';
import FlowCheck from '@/page/flow/flowContent/FlowCheck';
import SelectUser from '@/page/flow/flowContent/SelectUser';
import NotifyUser from '@/page/flow/flowContent/NotifyUser';
import FlowSign from '@/page/flow/flowContent/FlowSign';
import FlowComment from '@/page/flow/flowContent/FlowComment';
Vue.use(Router);

const router = new Router({
  routes: [
    { // 登录页
      path:'/Login',
      name:'Login',
      component:Login
    },
    {
      path:'/',     // 路由默认页
      name:'Flow',
      component:Flow,
      redirect:'/Index/Flow'
    },
    { // 首页
      path: '/Index',
      name: 'Index',
      component: Index,
      children:[{ // 首页
        path: 'Home',
        name: 'Home',
        component: Home,
      },
        { // 审批中心
          path: 'Flow',
          name: 'Flow',
          component: Flow,
          children:[]
        },
        { // 项目
          path: 'Project',
          name: 'Project',
          component: Project
        },
        { // 设置
          path: 'Setting',
          name: 'Setting',
          component: Setting
        },]
    },
    { // 项目详情
      path: '/Project/:name/:engId',
      name: 'ProjectInfo',
      component: ProjectInfo
    },
    { // 新人与新闻
      path: '/Mix',
      name: 'Mix',
      component: Mix,
      children:[{
        path:'News/:name',
        name:'News',
        component: News
      },
        {
          path:'Rookies/:name',
          name:'Rookies',
          component: Rookies
        }]
    },
    {　// 流程详情页
      path: '/FlowContent',
      name: 'FlowContent',
      component: FlowContent
    },
    {  // 审批流程
      path:'/FlowCheck',
      name:'FlowCheck',
      component: FlowCheck
    },
    {  // 查看审批意见
      path: '/FlowOpinion',
      name: 'FlowOpinion',
      component: FlowOpinion
    },
    {  // 查看附件
      path: '/FlowAttachment',
      name: 'FlowAttachment',
      component: FlowAttachment
    },
    {
      path: '/SelectUser',
      name: 'SelectUser',
      component: SelectUser,
    },
    {
      path: '/NotifyUser',
      name: 'NotifyUser',
      component: NotifyUser,
    },
    {
      path: '/FlowSign',
      name: 'FlowSign',
      component: FlowSign,
    },
    {
      path: '/FlowComment',
      name: 'FlowComment',
      component: FlowComment,
    },
  ]
});
export default router
