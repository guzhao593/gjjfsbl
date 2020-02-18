// 云函数入口文件
const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()


async function updateServiceProvider (lastUpdateTime, form) {
  const { _id, account, password, serviceProviderCode, ...ret } = form
  return await db.collection('serviceProvider')
    .doc(_id)
    .update({
      data: {
        ...ret,
        lastUpdateTime
      }
    })
}

async function updateServiceProviderAccount (lastUpdateTime, form) {
  const { _id, account, password, serviceProviderCode, ...ret } = form
  return await db.collection('serviceProviderAccount')
    .where({
      serviceProviderCode,
      isMainAccount: 'Y'
    })
    .update({
      data: {
        account,
        password,
        lastUpdateTime
      }
    })
}
async function deleteServiceProviderAccount(form) {
  const { serviceProviderCode, ...ret } = form
  return await db.collection('serviceProviderAccount')
    .where({
      serviceProviderCode
    })
    .remove()
}

// 云函数入口函数
exports.main = (event, context) => {
  const NOW_DATE = Date.now()
  return Promise.all([
    updateServiceProvider(NOW_DATE, event.form),
    event.form.isDelete === 'N' 
      ? updateServiceProviderAccount(NOW_DATE, event.form) 
      : deleteServiceProviderAccount(event.form)
  ])
}
