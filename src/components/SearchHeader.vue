<template>
  <div class="mb-6 flex gap-4 items-center">
    <input
      :value="modelValue"
      @input="handleInput"
      @keydown="handleKeyDown"
      type="text"
      placeholder="Введите ID альбомов через пробел"
      class="input-field flex-1"
    />
    <button
      @click="handleSearch"
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

// Функция для удаления дубликатов
const removeDuplicates = (value) => {
  const numbers = value.trim().split(/\s+/)
  return [...new Set(numbers)].join(' ')
}

// Обработчик нажатия клавиш
const handleKeyDown = (event) => {
  // Разрешаем: цифры, пробел, backspace, delete, стрелки, tab
  const allowedKeys = [
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' '
  ]
  
  if (!allowedKeys.includes(event.key)) {
    event.preventDefault()
  }
}

// Обработчик ввода с валидацией
const handleInput = (event) => {
  const value = event.target.value
  
  // Если последний символ - пробел, проверяем на дубликаты
  if (value.endsWith(' ')) {
    const uniqueNumbers = removeDuplicates(value)
    emit('update:modelValue', uniqueNumbers + ' ')
  } else {
    emit('update:modelValue', value)
  }
}

// Обработчик поиска
const handleSearch = () => {
  const uniqueNumbers = removeDuplicates(props.modelValue)
  emit('update:modelValue', uniqueNumbers)
  emit('search')
}
</script> 