<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script> 