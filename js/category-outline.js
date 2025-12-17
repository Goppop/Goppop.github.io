document.addEventListener('DOMContentLoaded', function() {
  // 处理分类层级目录大纲的展开/折叠（分类页面）
  const toggles = document.querySelectorAll('.category-outline-toggle')
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.stopPropagation()
      const item = this.closest('.category-outline-item')
      const children = item.querySelector('.category-outline-children')
      
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
  
  // 点击节点也可以展开/折叠（分类页面）
  const nodes = document.querySelectorAll('.category-outline-node')
  nodes.forEach(node => {
    const toggle = node.querySelector('.category-outline-toggle')
    if (toggle) {
      node.addEventListener('click', function(e) {
        if (e.target.closest('.category-outline-link')) {
          return // 如果点击的是链接，不处理
        }
        toggle.click()
      })
    }
  })
  
  // 处理文章页面分类目录大纲的展开/折叠
  const postToggles = document.querySelectorAll('.post-outline-toggle')
  
  postToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.stopPropagation()
      const item = this.closest('.post-outline-category-item')
      const children = item.querySelector('.post-outline-category-children')
      
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
  
  // 点击节点也可以展开/折叠（文章页面）
  const postNodes = document.querySelectorAll('.post-outline-category-node')
  postNodes.forEach(node => {
    const toggle = node.querySelector('.post-outline-toggle')
    if (toggle) {
      node.addEventListener('click', function(e) {
        if (e.target.closest('.post-outline-category-link')) {
          return // 如果点击的是链接，不处理
        }
        toggle.click()
      })
    }
  })
})

// 支持 PJAX 重新加载
if (window.pjax) {
  document.addEventListener('pjax:complete', function() {
    // 重新绑定分类页面的展开/折叠
    const toggles = document.querySelectorAll('.category-outline-toggle')
    toggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.stopPropagation()
        const item = this.closest('.category-outline-item')
        const children = item.querySelector('.category-outline-children')
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
    
    const nodes = document.querySelectorAll('.category-outline-node')
    nodes.forEach(node => {
      const toggle = node.querySelector('.category-outline-toggle')
      if (toggle) {
        node.addEventListener('click', function(e) {
          if (e.target.closest('.category-outline-link')) return
          toggle.click()
        })
      }
    })
    
    // 重新绑定文章页面的展开/折叠
    const postToggles = document.querySelectorAll('.post-outline-toggle')
    postToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.stopPropagation()
        const item = this.closest('.post-outline-category-item')
        const children = item.querySelector('.post-outline-category-children')
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
    
    const postNodes = document.querySelectorAll('.post-outline-category-node')
    postNodes.forEach(node => {
      const toggle = node.querySelector('.post-outline-toggle')
      if (toggle) {
        node.addEventListener('click', function(e) {
          if (e.target.closest('.post-outline-category-link')) return
          toggle.click()
        })
      }
    })
  })
}





