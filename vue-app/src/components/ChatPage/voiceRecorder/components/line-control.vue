<script lang="ts">
  import { computed, defineComponent } from 'vue'
  import { calculateLineHeadPosition } from '../lib/utils'
  export default defineComponent({
    props: {
      refId         : { type: String },
      eventName     : { type: String },
      percentage    : { type: Number, default: 0 },
      rowDirection  : { type: Boolean, default: true}
    },

    emits:['change-linehead', ],

    setup (props, { emit }) {
      const onMouseDown = (ev) => {
        const seekPos = calculateLineHeadPosition(ev, props.refId)
        emit('change-linehead', seekPos)
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
      };
      const onMouseUp = (ev) => {
        document.removeEventListener('mouseup', onMouseUp)
        document.removeEventListener('mousemove', onMouseMove)
        const seekPos = calculateLineHeadPosition(ev, props.refId)
        emit('change-linehead', seekPos)
      };
      const onMouseMove =  (ev) => {
        const seekPos = calculateLineHeadPosition(ev, props.refId)
        emit('change-linehead', seekPos)
      };
      const calculateSize = computed(() => {
        const value = props.percentage < 1 ? props.percentage * 100 : props.percentage
        return `${props.rowDirection ? 'width' : 'height'}: ${value}%`
      })

      return {
        onMouseDown,
        onMouseUp,
        onMouseMove,
        calculateSize,
      }
      }
    }
  )
</script>


<template>
  <div
    :ref="refId"
    class="ar-line-control"
    @mousedown="onMouseDown">
      <div class="ar-line-control__head" :style="calculateSize"></div>
  </div>
</template>

<style lang="scss">
  .ar-line-control {
    position: relative;
    height: 8px;
    border-radius: 5px;
    background-color: #616161;

    &__head {
      position: absolute;
      height: inherit;
      background-color: white;
      border-radius: inherit;
    }
  }
</style>