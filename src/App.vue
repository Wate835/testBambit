<template>
  <div class="h-screen bg-gray-100 dark:bg-gray-800 p-4 box-border">
    <div class="h-full max-w-4xl mx-auto flex flex-col">
      <SearchHeader
        v-model="albumInput"
        :loading="store.loading"
        :dark-mode="store.darkMode"
        @search="fetchPhotos"
        @toggle-theme="store.toggleDarkMode"
      />

      <PhotoTable
        :photos="store.visiblePhotos"
        :sort-config="sortConfig"
        :dark-mode="store.darkMode"
        @sort="handleSort"
        @load-more="store.loadMore"
      />

      <div v-if="store.error" class="mt-4 text-red-500">
        {{ store.error }}
      </div>
    </div>

    <Loader :show="store.loading" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePhotoStore } from './stores/photoStore'
import SearchHeader from './components/SearchHeader.vue'
import PhotoTable from './components/PhotoTable.vue'
import Loader from './components/Loader.vue'

// Инициализация хранилища
const store = usePhotoStore()

// Состояние компонента
const albumInput = ref(store.searchQuery)
const sortConfig = ref({ key: null, direction: 'asc' })

// Инициализация приложения
onMounted(() => {
  // Установка темной темы
  if (store.darkMode) {
    document.documentElement.classList.add('dark')
  }
  // Загрузка данных при наличии сохраненного поиска
  if (albumInput.value) {
    fetchPhotos()
  } else {
    store.fetchPhotos()
  }
})

// Загрузка фотографий
const fetchPhotos = async () => {
  const albumIds = albumInput.value.split(' ').filter(id => id.trim())
  store.setSearchQuery(albumInput.value)
  await store.fetchPhotos(albumIds)
}

// Обработка сортировки
const handleSort = (key) => {
  if (sortConfig.value.key === key) {
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortConfig.value = { key, direction: 'asc' }
  }
  store.sortPhotos(key, sortConfig.value.direction)
}
</script>