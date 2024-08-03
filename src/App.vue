<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const started = ref(false)
const currentTime = ref(0)
const startTime = ref(0)
const accumulatedTime = ref(0)

onMounted(() => {
  resetTime()

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Backspace':
        started.value = false

        resetTime()
        return
      case ' ':
        started.value = !started.value

        if (started.value) {
          restartTimer()
          updateTime()
        } else {
          pauseTimer()
        }
    }
  })
})

const pauseTimer = () => {
  accumulatedTime.value += partTime.value
  startTime.value = currentTime.value
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
    startTime.value = 0
    currentTime.value = 0
    accumulatedTime.value = 0
  })
}

const updateStopwatch = () => {
  currentTime.value = getNewTime()
}

const restartTimer = () => {
  startTime.value = getNewTime()
}

const getNewTime = () => Date.now()

const partTime = computed(() => currentTime.value - startTime.value)
const time = computed(() => partTime.value + accumulatedTime.value)
const formattedTime = computed(
  () =>
    `${Math.floor(time.value / 60_000)
      .toString()
      .padStart(2, '0')}:${((time.value % 60_000) / 1_000).toFixed(2).padStart(5, '0')}`
)
</script>

<template>
  <main>
    Press <kbd>space</kbd> to toggle the timer. <kbd>Backspace</kbd> to reset.

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
