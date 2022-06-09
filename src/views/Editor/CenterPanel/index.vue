<template>
  <div id="editor" class="editor" :class="{ edit: props.isEdit }" @mousedown="handleMouseDown">
    <!-- 网格线 -->
    <Grid />
    <Shape
      v-for="(item, index) in componentData"
      :key="item.id"
      :default-style="item.style"
      :style="getShapeStyle(item.style)"
      :active="item.id === (curComponent || {}).id"
      :element="item"
      :index="index"
      :class="{ lock: item.isLock }"
    >
      <component
        :is="item.component"
        :id="'component' + item.id"
        class="component"
        :style="getComponentStyle(item.style)"
        :prop-value="item.propValue"
        :element="item"
      />
    </Shape>
  </div>
</template>

<script setup>
import { computed, reactive, onMounted } from 'vue'
import Grid from './Grid'
import Shape from './Shape'
import { getStyle } from '@/utils/style'
import { mainStore } from '@/store'
const store = mainStore()

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: true
  }
})

const state = reactive({
  editorX: 0,
  editorY: 0,
  start: {
    // 选中区域的起点
    x: 0,
    y: 0
  },
  width: 0,
  height: 0,
  isShowArea: false
})

const componentData = computed(() => store.componentData)
const curComponent = computed(() => store.curComponent)

// 点击空白画板
const handleMouseDown = (e) => {
  // 如果没有选中组件 在画布上点击时需要调用 e.preventDefault() 防止触发 drop 事件
  if (!store.curComponent) {
    e.preventDefault()
  }
}

// 单击鼠标右键
const handleContextMenu = (e) => {
  e.stopPropagation()
  e.preventDefault()

  // 计算菜单相对于编辑器的位移
  let target = e.target
  let top = e.offsetY
  let left = e.offsetX
  while (target instanceof SVGElement) {
    target = target.parentNode
  }

  while (!target.className.includes('editor')) {
    left += target.offsetLeft
    top += target.offsetTop
    target = target.parentNode
  }

  store.showContextMenu({ top, left })
}

// 外层包裹组件样式
const getShapeStyle = (style) => {
  const result = {}
  ;['width', 'height', 'top', 'left', 'rotate'].forEach((attr) => {
    if (attr != 'rotate') {
      result[attr] = style[attr] + 'px'
    } else {
      result.transform = 'rotate(' + style[attr] + 'deg)'
    }
  })
  return result
}

// 组件样式
const getComponentStyle = (style) => {
  return getStyle(style, ['top', 'left', 'width', 'height', 'rotate'])
}

onMounted(() => {
  store.getEditor() // 获取编辑器元素
})
</script>

<style lang="scss" scoped>
$headerHeight: 50px;
$padding: 10px;

.editor {
  height: 100%;
  width: 100%;
  position: relative;
  background: #fff;
  margin: auto;

  .lock {
    opacity: 0.5;

    &:hover {
      cursor: not-allowed;
    }
  }
}

.edit {
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>