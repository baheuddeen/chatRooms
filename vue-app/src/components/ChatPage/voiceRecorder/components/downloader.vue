<style lang="scss">
  @import '../scss/icons';
</style>

<template>
  <icon-button
    id="download"
    class="ar-icon ar-icon__xs ar-icon--no-border"
    name="download"
    @click.native="download"/>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import IconButton from './icon-button.vue';

  export default defineComponent({
    props: {
      record    : { type: Object },
      filename  : { type: String }
    },
    components: {
      IconButton
    },

    setup (props) {
      const download = () => {
        if (!props.record || props.record.url) {
          return
        }

        const type = props.record.blob.type.split('/')[1]
        const link = document.createElement('a')
        link.href = props.record.url
        link.download = `${props.filename}.${type}`
        link.click()
      }

      return {
        download,
      }
    }
  })
</script>
