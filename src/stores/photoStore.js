import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const usePhotoStore = defineStore('photos', () => {
  const allPhotos = ref([])
  const photos = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref(localStorage.getItem('searchQuery') || '')
  const darkMode = ref(JSON.parse(localStorage.getItem('darkMode') || 'false'))
  const currentPage = ref(1)
  const photosPerPage = ref(30)

  const visiblePhotos = computed(() => {
    const end = currentPage.value * photosPerPage.value
    return photos.value.slice(0, end)
  })

  async function fetchPhotos(albumIds = []) {
    loading.value = true
    error.value = null
    currentPage.value = 1
    
    try {
      let url = 'https://jsonplaceholder.typicode.com/photos'
      if (albumIds.length > 0) {
        const params = albumIds.map(id => `albumId=${id}`).join('&')
        url += `?${params}`
      }
      
      const response = await axios.get(url)
      allPhotos.value = response.data
      photos.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  function loadMore() {
    if (currentPage.value * photosPerPage.value < photos.value.length) {
      currentPage.value++
    }
  }

  function setSearchQuery(query) {
    searchQuery.value = query
    localStorage.setItem('searchQuery', query)
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    localStorage.setItem('darkMode', JSON.stringify(darkMode.value))
    document.documentElement.classList.toggle('dark', darkMode.value)
  }

  function sortPhotos(key, direction) {
    photos.value.sort((a, b) => {
      const aValue = a[key]
      const bValue = b[key]
      
      if (typeof aValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      return direction === 'asc'
        ? aValue - bValue
        : bValue - aValue
    })
  }

  return {
    allPhotos,
    photos,
    loading,
    error,
    searchQuery,
    darkMode,
    currentPage,
    photosPerPage,
    visiblePhotos,
    fetchPhotos,
    loadMore,
    setSearchQuery,
    toggleDarkMode,
    sortPhotos
  }
}) 