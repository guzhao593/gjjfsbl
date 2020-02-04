const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const result = await cloud.openapi.subscribeMessage.send({
      touser: wxContext.OPENID,
      page: 'pages/orderList/index',
      data: {
        name1: {
          value: "梁志明"
        },
        phone_number2: {
          value: 18823282288
        },
        date3: {
          value: "2015-1-5 11:11"
        },
        thing4: {
          value: "萧山区龙湖天璞七幢2单元2602"
        }
      },
      templateId: 'lLx88JJ8yv7IaQP66YoToNewg5MDTQAZydw_L9tRO-4'
    })
    return result
  } catch (err) {
    return err
  }
}