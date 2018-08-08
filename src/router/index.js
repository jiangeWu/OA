import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/login/login'
import Home from '../pages/home/home'
import mailList from '../pages/mailList/mailList'
import department from '../pages/department/department'
import token from '../pages/token/token'

import Notice from '../pages/notice/notice'
import NoticeContent from '../pages/notice/content'

import Mailbox from '../pages/mailbox/mailbox'
import MailboxContent from '../pages/mailbox/mailboxContent'
import SendMailbox from '../pages/mailbox/sendMailbox'

import memberInfo from '../pages/memberInfo/memberInfo'
import duanXin from '../pages/DuanXin/duanxin'
import faDuanXin from '../pages/faDuanXin/faduanxin'
import daiBanFaWen from '../pages/daiBanFaWen/daiBanFaWen'
import daiBanShouWen from '../pages/daiBanShouWen/daiBanShouWen'
import faWenXiangQing from '../pages/faWenXiangQing/faWenXiangQing'
import faWenXiangQing2 from '../pages/faWenXiangQing/faWenXiangQing2'
import faWenXiangQing3 from '../pages/faWenXiangQing/faWenXiangQing3'
import shouWenXiangQing from '../pages/shouWenXiangQing/shouWenXiangQing'
import shouWenXiangQing2 from '../pages/shouWenXiangQing/shouWenXiangQing2'

import workFlow from '../pages/workFlow/workFlow'
import newFlow from '../pages/workFlow/newFlow'
import Flow from '../pages/workFlow/flow'
import test from '../pages/test/test'
Vue.use(Router)
const router = new Router({
  routes: [
    {
      //应用页
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: '移动OA'
      }
    },
    //登录页
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: 'OA登录'
      }
    },
    //应用页
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        title: '移动OA'
      }
    },
    //测试页
    {
      path: '/test',
      name: 'test',
      component: test,
      meta: {
        title: '测试'
      }
    },
    //公告页
    {
      path: '/notice',
      name: 'notice',
      component: Notice,
      meta: {
        title: '公告'
      },
    },
    //公告内容页
    {
      name: 'noticeContent',
      path: '/noticeContent',
      component: NoticeContent,
      meta: {
        title: '公告内容',
        body: '#fff'
      }
    },
    //邮箱页
    {
      path: '/mailbox',
      name: 'mailbox',
      component: Mailbox,
      meta: {
        title: '邮箱'
      },
    },
    //邮箱内容页
    {
      path: '/mailboxContent',
      name: 'mailboxContent',
      component: MailboxContent,
      meta: {
        title: '邮箱内容'
      },
    },
    //发邮箱页
    {
      path: '/sendMailbox',
      name: 'sendMailbox',
      component: SendMailbox,
      meta: {
        title: '发邮箱'
      },
    },
    // //通讯录页
    // {
    //   path: '/mailList',
    //   name: 'mailList',
    //   component: mailList,
    //   meta: {
    //     title: '通讯录'
    //   }
    // },
    //通讯录页
    {
      path: '/department',
      name: 'department',
      component: department,
      meta: {
        title: '通讯录'
      }
    },
    // 通讯录用户详情页
    {
      path: '/memberInfo',
      name: 'memberInfo',
      component: memberInfo,
      meta: {
        title: '通讯录'
      }
    },
    //短信页
    {
      path: '/duanxin',
      name: 'duanXin',
      component: duanXin,
      meta: {
        title: '短信'
      }
    },
    //发短信页
    {
      path: '/faduanxin',
      name: 'faDuanXin',
      component: faDuanXin,
      meta: {
        title: '发短信'
      }
    },
    //待办发文页
    {
      path: '/daibanfawen',
      name: 'daiBanFaWen',
      component: daiBanFaWen,
      meta: {
        title: '待办发文'
      }
    },
    //待办收文页
    {
      path: '/daibanshouwen',
      name: 'daiBanShouWen',
      component: daiBanShouWen,
      meta: {
        title: '待办收文'
      }
    },
    //发文详情页
    {
      path: '/fawenxiangqing',
      name: 'faWenXiangQing',
      component: faWenXiangQing,
      meta: {
        title: '发文详情'
      }
    },
    {
      path: '/fawenxiangqing2',
      name: 'faWenXiangQing2',
      component: faWenXiangQing2,
      meta: {
        title: '发文详情'
      }
    },
    {
      path: '/fawenxiangqing3',
      name: 'faWenXiangQing3',
      component: faWenXiangQing3,
      meta: {
        title: '发文详情'
      }
    },
    //收文详情页
    {
      path: '/shouwenxiangqing',
      name: 'shouWenXiangQing',
      component: shouWenXiangQing,
      meta: {
        title: '收文详情'
      }
    },
    {
      path: '/shouwenxiangqing2',
      name: 'shouWenXiangQing2',
      component: shouWenXiangQing2,
      meta: {
        title: '收文详情'
      }
    },
    {
      path: '/workflow',
      name: 'workFlow',
      component: workFlow,
      meta: {
        title: '流程办理'
      }
    },
    {
      path: '/newflow',
      name: 'newFlow',
      component: newFlow,
      meta: {
        title: '新建流程'
      }
    },
    {
      path: '/flow',
      name: 'flow',
      component: Flow,
      meta: {
        title: '流程'
      }
    },
    // {
    //   path: '/token',
    //   name: 'shouWenXiangQing',
    //   component: token,
    //   meta: {
    //     title: '获取token'
    //   }
    // }
  ]
})
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }if(to.meta.body) {
    document.body.style.backgroundColor = to.meta.body
  }else {
    document.body.style.backgroundColor = '#F8F8F8'
  }
  next()
})
export default router
