export const tasks = [{
  id: 1,
  name: '开锁',
}, {
  id: 2,
  name: '关锁',
}, {
  id: 3,
  name: '上传图片',
}, {
  id: 4,
  name: '状态量',
}]
// -2:未通过审批，已驳回
// -1:已取消
// 0:审批中
// 1:执行中
// 2:审核中
// 3:确认中（审核完成，有序退出挂锁，确认锁状态）
// 4:已完成
export const OrderStatus = [
	{ id: -1, name: '已驳回', type: '' },
	{ id: 0, name: '初始值', type: '' },
  { id: 1, name: '审批中', type: '' },
  { id: 2, name: '已审批', type: 'success' },
  { id: 3, name: '执行中', type: 'error' },
  { id: 4, name: '审批驳回', type: 'warning' },
  { id: 5, name: '已执行', type: 'success' },
  { id: 6, name: '审核中', type: 'warning' },
  { id: 7, name: '审核通过', type: 'error' },
  { id: 8, name: '确认中', type: 'success' },
  { id: 9, name: '已确认', type: 'success' },
  { id: 9, name: '已完成', type: 'success' },
]
export const stationType = [
  { id: '1', name: '工厂' },
  { id: '2', name: '仓库' },
]
