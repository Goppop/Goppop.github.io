document.addEventListener('DOMContentLoaded', function() {
  // 处理知识地图的展开/折叠
  const toggles = document.querySelectorAll('.knowledge-map-toggle')
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.stopPropagation()
      const node = this.closest('.knowledge-map-node')
      const children = node.parentElement.querySelector('.knowledge-map-children')
      
      if (children) {
        const isExpanded = this.classList.contains('expanded')
        
        if (isExpanded) {
          this.classList.remove('expanded')
          children.style.display = 'none'
        } else {
          this.classList.add('expanded')
          children.style.display = 'block'
        }
      }
    })
  })
  
  // 点击节点也可以展开/折叠
  const nodes = document.querySelectorAll('.knowledge-map-node.has-children')
  nodes.forEach(node => {
    node.addEventListener('click', function(e) {
      if (e.target.closest('.knowledge-map-link')) {
        return // 如果点击的是链接，不处理
      }
      const toggle = this.querySelector('.knowledge-map-toggle')
      if (toggle) {
        toggle.click()
      }
    })
  })
})
