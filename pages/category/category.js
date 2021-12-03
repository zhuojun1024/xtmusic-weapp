Page({
  data: {
    items: [{
      text: '手机数码',
      children: [
        { id: '1-1', text: '手机' },
        { id: '1-2', text: '笔记本电脑' },
        { id: '1-3', text: '相机' },
        { id: '1-4', text: '投影仪' },
        { id: '1-5', text: '打印机' },
        { id: '1-6', text: '路由器' },
        { id: '1-7', text: '显示器' },
        { id: '1-8', text: '主机' },
        { id: '1-9', text: '键鼠' },
        { id: '1-10', text: '显卡' },
        { id: '1-11', text: '硬盘' },
        { id: '1-12', text: '内存' },
        { id: '1-13', text: '电源' },
        { id: '1-14', text: '无人机' },
        { id: '1-15', text: '光驱' }
      ]
    }, {
      text: '日用百货',
      children: [
        { id: '2-1', text: '清洁用品' },
        { id: '2-2', text: '洗漱用品' },
        { id: '2-3', text: '其他用品' }
      ]
    }, {
      text: '其他',
      children: [
        { id: '3-1', text: '其他' }
      ]
    }],
    mainActiveIndex: 0,
    activeId: '1-2'
  },
  onShow: function () {
    this.getTabBar().init()
  },
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },
  onClickItem({ detail = {} }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id;

    this.setData({ activeId });
  }
})