<template>
  <div class="table-container">
    <div class="table-scroll overflow-x-hidden" @scroll="handleScroll">
      <table class="w-full">
        <thead class="table-header">
          <tr>
            <th
              v-for="(label, key) in columns"
              :key="key"
              @click="$emit('sort', key)"
              class="table-cell cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {{ label }}
              <span class="absolute" v-if="sortConfig.key === key">
                {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="photo in photos"
            :key="photo.id"
            class="border-t dark:border-gray-600"
          >
            <td class="table-cell">{{ photo.id }}</td>
            <td class="table-cell">{{ photo.albumId }}</td>
            <td class="table-cell group relative">
              <span 
                class="truncate block"
                @mouseenter="showTooltip($event, photo.title)"
                @mouseleave="startHideTimer"
              >{{ photo.title }}</span>
            </td>
            <td class="table-cell group relative">
              <a 
                :href="photo.url" 
                target="_blank" 
                class="text-blue-500 hover:underline truncate block"
                @mouseenter="showTooltip($event, photo.url)"
                @mouseleave="startHideTimer"
              >{{ photo.url }}</a>
            </td>
            <td class="table-cell group relative">
              <a 
                :href="photo.thumbnailUrl" 
                target="_blank" 
                class="text-blue-500 hover:underline truncate block"
                @mouseenter="showTooltip($event, photo.thumbnailUrl)"
                @mouseleave="startHideTimer"
              >{{ photo.thumbnailUrl }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div 
      v-if="tooltipVisible" 
      class="tooltip"
      :class="darkMode ? 'dark' : 'light'"
      :style="tooltipStyle"
      @mouseenter="cancelHideTimer"
      @mouseleave="startHideTimer"
    >
      <div class="tooltip-content">{{ tooltipText }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'

// Пропсы компонента
const props = defineProps({
  // Массив фотографий для отображения
  photos: {
    type: Array,
    required: true
  },
  // Конфигурация сортировки
  sortConfig: {
    type: Object,
    required: true
  },
  // Режим темной темы
  darkMode: {
    type: Boolean,
    default: false
  }
})

// События компонента
const emit = defineEmits(['sort', 'loadMore'])

// Состояние для попапа
const tooltipVisible = ref(false)
const tooltipText = ref('')
const tooltipStyle = ref({
  left: '0px',
  top: '0px'
})
let hideTimer = null

// Заголовки столбцов таблицы
const columns = {
  id: 'ID',
  albumId: 'Альбом',
  title: 'Название',
  url: 'Ссылка',
  thumbnailUrl: 'Миниатюра'
}

// Показать попап
const showTooltip = (event, text) => {
  cancelHideTimer()
  const rect = event.target.getBoundingClientRect()
  tooltipStyle.value = {
    left: `${rect.left}px`,
    top: `${rect.bottom + 5}px`
  }
  tooltipText.value = text
  tooltipVisible.value = true
}

// Начать таймер скрытия
const startHideTimer = () => {
  hideTimer = setTimeout(() => {
    tooltipVisible.value = false
  }, 100)
}

// Отменить таймер скрытия
const cancelHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const handleScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target
  if (scrollHeight - scrollTop <= clientHeight * 1.5) {
    emit('loadMore')
  }
}
</script> 