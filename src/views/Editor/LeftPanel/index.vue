<template>
  <div class="component-list">
    <el-row :gutter="8">
      <el-col v-for="(item, index) in state.componentList" :key="`component-item-${index}`" :span="12">
        <el-card shadow="hover" :data-index="index" :draggable="true" @dragstart="handleDragStart">
          <el-icon><Box /></el-icon>
          <span class="ml-1">{{ item.label }}</span>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { Box } from '@element-plus/icons-vue'
import componentList from './component-list'
import { mainStore } from '@/store'
const store = mainStore()

const state = reactive({
  componentList: componentList,
  componentData: []
})

const handleDragStart = (e) => {
  e.dataTransfer.setData('index', e.target.dataset.index)
  store.setCurComponent({ component: null, index: null })
  store.setIsDragInEditor(true)
  store.hideContextMenu()
}
</script>

<style lang="scss" scoped>
.component-list {
  padding: 0 10px;
  :deep(.el-col) {
    margin-top: 10px;
  }

  :deep(.el-card__body) {
    padding: 8px 14px;
    font-size: 14px;
    display: flex;
    align-items: center;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }
}
</style>
