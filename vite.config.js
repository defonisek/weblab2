import { defineConfig } from 'vite'
import { resolve } from 'path'

export default {
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        churchCalendar: resolve(__dirname, 'src/html/holiday.html'),
        europeana: resolve(__dirname, 'src/html/europeana.html'),
        facts: resolve(__dirname, 'src/html/facts.html'),
        weather: resolve(__dirname, 'src/html/weather.html')
      }
    }
  }
}
