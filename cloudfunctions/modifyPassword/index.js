// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { accountForm, databaseName } = event
  const { account, newPassword: password } = accountForm
  console.log(password, 'password')
  return await db.collection(databaseName)
    .where({
      account
    })
    .update({
      data: {
        account,
        password,
        lastUpdateTime: Date.now()
      }
    })
}
