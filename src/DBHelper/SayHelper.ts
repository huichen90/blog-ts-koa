import { Info, Say } from '../models/'

interface IPayload {
  pageSize: string
  pageIndex: string
}
export default class SayHelper {
  public static findSay = async (payload: IPayload) => {
    const { pageIndex, pageSize } = payload
    const Skip =
      Number.parseInt(pageIndex) * Number.parseInt(pageSize) -
      Number.parseInt(pageSize)
    const say = await Say.find({})
      .sort({ create_at: -1 })
      .limit(Number.parseInt(pageSize))
      .skip(Skip)
    const total = await Say.count({})
    return { say, total }
  }
  public static deleteSay = async (payload: object) => {
    const response = await Say.remove(payload)
    if (response.ok === 1) {
      return { message: '删除成功' }
    } else {
      return { message: '删除失败', type: 'error' }
    }
  }
  public static addSay = async (say: object) => {
    const response = await Say.create({ ...say, create_at: Date.now() })
    const info: any = await Info.find({})
    if (Array.isArray(info[0].data)) {
      info[0].data.forEach((item: any) => {
        if (Number.parseInt(item.month) === new Date().getMonth() + 1) {
          item.say += 1
        }
      })
      await Info.update({ _id: info[0]._id }, { data: info[0].data })
    }
    if (response) {
      return { message: '说说发表成功' }
    }
  }
}
