<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const started = ref(false)
const finished = ref(false)
const startTime = ref(0)
const currentTime = ref(0)
const listenerRef = ref()

onMounted(() => {
  resetTime()

  listenerRef.value = document.addEventListener('keydown', (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Backspace':
        resetTime()

        return
      case ' ':
        if (!started.value && !finished.value) {
          startTimer()
        } else if (!finished.value) {
          stopTimer()
        }
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', listenerRef.value)
})

const startTimer = () => {
  started.value = true
  startTime.value = getNewTime()
  updateTime()
}
const stopTimer = () => {
  started.value = false
  finished.value = true
}
const updateTime = () => {
  requestAnimationFrame(() => {
    updateStopwatch()

    if (started.value) {
      updateTime()
    }
  })
}
const resetTime = () => {
  requestAnimationFrame(() => {
    started.value = false
    finished.value = false
  })
  requestAnimationFrame(() => {
    startTime.value = 0
    currentTime.value = 0
  })
}
const updateStopwatch = () => {
  currentTime.value = getNewTime()
}
const getNewTime = () => Date.now()
const time = computed(() => currentTime.value - startTime.value)
const formattedTime = computed(
  () =>
    `${Math.floor(time.value / 60_000)
      .toString()
      .padStart(2, '0')}:${((time.value % 60_000) / 1_000).toFixed(2).padStart(5, '0')}`
)
</script>

<template>
  <main>
    Press <kbd>space</kbd> to start and stop the timer. <kbd>Backspace</kbd> to reset.

    <h1 class="time">{{ formattedTime }}</h1>
  </main>
</template>

<style scoped>
.time {
  font-size: 6rem;
}

kbd {
  font-family: monospace;
  border: 1px solid gray;
  border-radius: 2px;
  padding: 1px;
  text-transform: uppercase;
}
</style>
