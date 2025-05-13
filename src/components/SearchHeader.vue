<template>
  <div class="mb-6 flex gap-4 items-center">
    <input
      :value="modelValue"
      @input="handleInput"
      type="text"
      placeholder="Введите ID альбомов через пробел"
      class="input-field flex-1"
    />
    <button
      @click="$emit('search')"
      class="btn"
      :disabled="loading"
    >
      {{ loading ? 'Загрузка...' : 'Поиск' }}
    </button>
    <button
      @click="$emit('toggleTheme')"
      class="btn"
    >
      {{ darkMode ? '🌞' : '🌙' }}
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// Пропсы компонента
const props = defineProps({
  // Значение поля ввода
  modelValue: {
    type: String,
    required: true
  },
  // Состояние загрузки
  loading: {
    type: Boolean,
    default: false
  },
  // Режим темной темы
  darkMode: {
    type: Boolean,
    default: false
  }
})

// События компонента
const emit = defineEmits(['update:modelValue', 'search', 'toggleTheme'])

// Обработчик ввода с валидацией
const handleInput = (event) => {
  const value = event.target.value
  // Оставляем только цифры и пробелы
  const filteredValue = value.replace(/[^\d\s]/g, '')
  emit('update:modelValue', filteredValue)
}
</script> 