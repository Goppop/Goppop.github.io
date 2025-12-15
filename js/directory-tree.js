/**
 * 目录树渲染脚本
 * 从directory-tree.json加载数据并渲染目录树
 */

(function() {
  'use strict';

  function loadDirectoryTree() {
    console.log('开始加载目录树数据...');
    const container = document.getElementById('directory-tree-container');
    if (!container) {
      console.error('目录树容器不存在');
      return;
    }

    // 显示加载状态
    container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">正在加载目录树...</p>';

    fetch('/directory-tree.json')
      .then(response => {
        console.log('目录树数据响应状态:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: 无法加载目录树数据`);
        }
        return response.json();
      })
      .then(data => {
        console.log('目录树数据加载成功:', data);
        if (data && data.name) {
          renderDirectoryTree(data);
          console.log('目录树渲染完成');
        } else {
          throw new Error('目录树数据格式错误');
        }
      })
      .catch(error => {
        console.error('加载目录树失败:', error);
        const container = document.getElementById('directory-tree-container');
        if (container) {
          container.innerHTML = `
            <div style="color: #f56c6c; padding: 20px; text-align: center; background: #fef0f0; border-radius: 4px;">
              <p style="margin: 0 0 10px 0;">❌ 目录树数据加载失败</p>
              <p style="margin: 0; font-size: 12px; color: #999;">错误信息: ${error.message}</p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">请检查控制台获取更多信息</p>
            </div>
          `;
        }
      });
  }

  // 计算目录下的文件总数（包括子目录）
  function countFiles(node) {
    let count = (node.files && node.files.length) || 0;
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        count += countFiles(child);
      });
    }
    return count;
  }

  function renderDirectoryTree(node, container, level = 0) {
    if (!container) {
      container = document.getElementById('directory-tree-container');
      if (!container) {
        console.error('找不到目录树容器');
        return;
      }
      container.innerHTML = ''; // 清空容器
    }

    const item = document.createElement('div');
    item.className = `directory-tree-item ${node.type}`;
    item.setAttribute('data-level', level);
    
    if (node.type === 'directory') {
      // 目录节点
      const hasChildren = (node.children && node.children.length > 0) || 
                         (node.files && node.files.length > 0);
      
      // 计算文件总数
      const fileCount = countFiles(node);
      
      if (hasChildren) {
        const toggle = document.createElement('span');
        toggle.className = 'directory-tree-toggle';
        toggle.addEventListener('click', function(e) {
          e.stopPropagation();
          toggleChildren(item, toggle);
        });
        item.appendChild(toggle);
      } else {
        // 即使没有子节点，也添加一个占位符以保持对齐
        const spacer = document.createElement('span');
        spacer.className = 'directory-tree-spacer';
        item.appendChild(spacer);
      }
      
      const nameWrapper = document.createElement('span');
      nameWrapper.className = 'directory-tree-name-wrapper';
      
      const name = document.createElement('span');
      name.className = 'directory-tree-name';
      name.textContent = node.name;
      nameWrapper.appendChild(name);
      
      // 显示文件数量
      if (fileCount > 0) {
        const countBadge = document.createElement('span');
        countBadge.className = 'directory-tree-count';
        countBadge.textContent = `(${fileCount})`;
        nameWrapper.appendChild(countBadge);
      }
      
      item.appendChild(nameWrapper);
      
      // 点击目录名也可以展开/折叠
      if (hasChildren) {
        nameWrapper.style.cursor = 'pointer';
        nameWrapper.addEventListener('click', function(e) {
          e.stopPropagation();
          const toggle = item.querySelector('.directory-tree-toggle');
          if (toggle) {
            toggle.click();
          }
        });
      }
      
      container.appendChild(item);
      
      // 子节点容器
      if (hasChildren) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'directory-tree-children';
        // 默认展开前两级
        if (level < 2) {
          childrenContainer.classList.add('expanded');
          const toggle = item.querySelector('.directory-tree-toggle');
          if (toggle) {
            toggle.classList.add('expanded');
          }
        }
        item.appendChild(childrenContainer);
        
        // 渲染子目录
        if (node.children && node.children.length > 0) {
          node.children.forEach(child => {
            renderDirectoryTree(child, childrenContainer, level + 1);
          });
        }
        
        // 渲染文件
        if (node.files && node.files.length > 0) {
          node.files.forEach(file => {
            renderFile(file, childrenContainer);
          });
        }
      } else {
        const empty = document.createElement('div');
        empty.className = 'directory-tree-empty';
        empty.textContent = '（空目录）';
        item.appendChild(empty);
      }
    } else {
      // 文件节点（不应该直接调用，应该通过renderFile）
      renderFile(node, container);
    }
  }

  function renderFile(file, container) {
    const item = document.createElement('div');
    item.className = 'directory-tree-item file';
    
    const name = document.createElement('a');
    name.className = 'directory-tree-name';
    name.textContent = file.title || file.name;
    name.href = file.url || '#';
    name.title = file.description || file.title || file.name;
    item.appendChild(name);
    
    // 文件元信息
    if (file.date || file.description) {
      const meta = document.createElement('div');
      meta.className = 'directory-tree-file-meta';
      
      if (file.date) {
        const dateSpan = document.createElement('span');
        dateSpan.textContent = `📅 ${formatDate(file.date)}`;
        meta.appendChild(dateSpan);
      }
      
      if (file.description) {
        const descSpan = document.createElement('span');
        descSpan.textContent = `📝 ${file.description}`;
        meta.appendChild(descSpan);
      }
      
      item.appendChild(meta);
    }
    
    container.appendChild(item);
  }

  function toggleChildren(item, toggle) {
    const children = item.querySelector('.directory-tree-children');
    if (children) {
      const isExpanded = toggle.classList.contains('expanded');
      if (isExpanded) {
        toggle.classList.remove('expanded');
        children.classList.remove('expanded');
      } else {
        toggle.classList.add('expanded');
        children.classList.add('expanded');
      }
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  }

  // 等待 DOM 完全加载后再执行
  function init() {
    const container = document.getElementById('directory-tree-container');
    if (container) {
      console.log('目录树容器已找到，开始加载数据...');
      loadDirectoryTree();
    } else {
      console.warn('目录树容器未找到，等待 DOM 加载...');
      // 如果容器不存在，等待一段时间后重试
      setTimeout(init, 100);
    }
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM 已经加载完成，直接执行
    setTimeout(init, 0);
  }

  // 支持PJAX重新加载
  if (typeof window !== 'undefined' && window.pjax) {
    document.addEventListener('pjax:complete', function() {
      if (document.getElementById('directory-tree-container')) {
        console.log('PJAX 完成，重新加载目录树...');
        loadDirectoryTree();
      }
    });
  }
})();

