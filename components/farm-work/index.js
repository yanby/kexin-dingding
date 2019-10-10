import request from '/request/request'
import api from '/request/api'

Component({
  props: {
    activeTab: 0,
    tabs: [],
    onChoseFarmWorkItem: (id) => {}
  },
  methods: {
    tapTabItem(e) {
      console.log(e)
      const activeTab = e.target.dataset.recordId
      const category = e.target.dataset.category
      const farmingId = e.target.dataset.farmingId
      if (activeTab === this.data.activeTab) return
      this.props.onChoseFarmWorkItem(activeTab, category, farmingId)
    },
    tapRepeatFarmWork(e) {
      dd.navigateTo({
        url: `/pages/farm-work-repeat/index?recordId=${this.props.activeTab}`
      })
    }
  }
})