<template>
  <div id="app">
    <div class="file-field">
      <input type="file" @change="selectFile" />
      <el-button type="primary" @click="uploadChunk">上传</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      // 2M
      chunkLimitSize: 2 * 1024 * 1024,
      chunkList: [],
      file: null
    }
  },
  methods: {
    request(method, url, data) {
      console.log(arguments)
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('post', 'http://localhost:8888/save_chunk', true)
        xhr.send(data)

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if ((xhr.status > 200 && xhr.status < 300) || xhr.status === 304) {
              resolve(xhr.responseText)
            }
          }
        }
      })
    },
    splitChunks(file) {
      const totalSize = file.size
      const chunkLimitSize = this.chunkLimitSize
      const chunkList = this.chunkList

      for (let start = 0; start < totalSize; start += chunkLimitSize) {
        const end = start + chunkLimitSize
        chunkList.push(file.slice(start, end))
      }
    },
    selectFile(e) {
      const [file] = e.target.files
      if (!file) return

      this.file = file
      this.splitChunks(file)
    },
    async uploadChunk() {
      const chunkList = this.chunkList

      const requestList = chunkList.map((val, idx) => {
        const formData = new FormData()
        formData.append('chunk', val)
        formData.append('filename', this.file.name + '_' + idx)
        return this.request('post', 'http://localhost:8888/save_chunk', formData)
      })

      await Promise.all(requestList)
    },
  }
}
</script>

<style lang="less"></style>
