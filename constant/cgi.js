const sdkCGI = require('../components/dgd-sdk/config/cgi');
const htUrl = 'https://heshiwork.com'

module.exports = Object.assign({
  // 首页数据
  getIndexData: htUrl + '/api/index',
  // 填写个人信息
  set_info: htUrl + '/api/index/set_info',
  //上传图片
  upload: htUrl + '/api/upload/upload',
  //广告位
  getadvertisement: htUrl + '/api/index/advertisement',
  //查看我的信息列表
  get_info_list: htUrl + '/api/index/get_info_list',
  //专业
  getmajor: htUrl + '/api/index/getmajor',
  // 职位发布
  getjob_create: htUrl + '/api/index/job_create',
  //所属行业
  getindustry: htUrl + '/api/index/getindustry',
  //审核设置
  get_eav: htUrl + '/api/index/get_eav',
  //职位类型
  get_type: htUrl + '/api/index/get_type',
  //开放群体
  get_open_groups: htUrl + '/api/index/get_open_groups',
  // 岗位体验设置
  getjob_repair: htUrl + '/api/index/job_repair',
  // 职位管理
  getjob_list: htUrl + '/api/index/job_list',
  //我的预约
  getmyorders: htUrl + '/api/index/myorders',
  // //预约详情
  // getorder_detail: htUrl + '/api/index/order_detail',
  // 企业认证
  getcompany_create: htUrl + '/api/index/company_create',
  //企业认证审核
  getcompany_status: htUrl + '/api/index/company_status',
  // 撤销企业认证审核
  getdel_ask: htUrl + '/api/index/del_ask',
  // 余额
  getbalance_log: htUrl + '/api/index/balance_log',
  // 申请提现
  getcash_out: htUrl + '/api/index/cash_out',
  // 岗位详情
  getjob_detail: htUrl + '/api/index/job_detail',
  //职位名称
  get_jobname: htUrl + '/api/index/get_jobname',
  //加入取消收藏
  getaddcollect: htUrl + '/api/index/addcollect',
  //收藏列表
  getcollectlist: htUrl + '/api/index/collectlist',
  //企业预定
  getcompany_order: htUrl + '/api/index/company_order',
  //预订
  getcreate_order: htUrl + '/api/Wxpay/create_order',
  //我的消息
  getmessage_list: htUrl + '/api/index/message_list',
  // 订单详情
  getorderdetail: htUrl + '/api/index/orderdetail',
  // 审核职位
  getexa_order: 'https://heshiwork.com/api/index/exa_order',
  //上传用户头像
  getset_userinfo:'https://heshiwork.com/api/index/set_userinfo',
  // 当前日期是否可以预定
  getjobday:'https://heshiwork.com/api/index/jobday',
  // 获取城市
  getAllCity:'https://heshiwork.com/api/index/getAllCity',
  getuserAgreement:'https://heshiwork.com/api/index/userAgreement',
  // 北京的区
  getBjprodistrictvince:'https://heshiwork.com/api/index/getBjprodistrictvince',
  //服务条款
  getpcst:'https://heshiwork.com/api/index/getpcst'
}, sdkCGI);