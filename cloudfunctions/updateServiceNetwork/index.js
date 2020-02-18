// 云函数入口文件
const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event, 'evnt')
  const NOW_DATE = Date.now()
  const { _id, ...ret } = event.form
  return await db.collection('serviceNetworkAccount')
    .doc(_id)
    .update({
      data: {
        ...ret,
        lastUpdateTime: NOW_DATE
      }
    })
}
