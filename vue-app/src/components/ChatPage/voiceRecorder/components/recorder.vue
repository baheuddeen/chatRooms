

<script lang="ts">
  import { defineComponent, computed, onMounted, onBeforeUnmount, ref  } from 'vue';
  import AudioPlayer from './player.vue';
  import Downloader  from './downloader.vue';
  import IconButton  from './icon-button.vue';
  import Recorder    from '../lib/recorder';
  import Uploader    from './uploader.vue';
  import UploaderPropsMixin from '../mixins/uploader-props'
  import { convertTimeMMSS }  from '../lib/utils';
  import fixWebmDuration from 'fix-webm-duration';

  export default defineComponent({
    components: {
      AudioPlayer,
      Downloader,
      IconButton,
      Uploader
    },

    props: {
      attempts : { type: Number },
      time     : { type: Number },

      bitRate    : { type: Number, default: 128   },
      sampleRate : { type: Number },

      showDownloadButton : { type: Boolean, default: true },
      showUploadButton   : { type: Boolean, default: true },

      micFailed        : { type: Function },
      beforeRecording  : { type: Function },
      pauseRecording   : { type: Function },
      afterRecording   : { type: Function },
      failedUpload     : { type: Function },
      beforeUpload     : { type: Function },
      successfulUpload : { type: Function },
      selectRecord     : { type: Function },
      activeConversationId: {type: Object},
    },
    mixins: [UploaderPropsMixin],

    setup (props, { emit }) {
      const _initRecorder = () => {
        return new Recorder({
          beforeRecording : props.beforeRecording,
          afterRecording  : props.afterRecording,
          pauseRecording  : props.pauseRecording,
          micFailed       : props.micFailed,
          bitRate         : props.bitRate,
          sampleRate      : props.sampleRate,
          format          : 'mp3', // set to wav
        })
      }

      const isUploading   = ref(false);
      const  recorder      = ref(_initRecorder());
      let  recordList    = ref([]);
      let  selected      = ref({} as any);
      const  uploadStatus = ref(null);

      const attemptsLeft = computed (() => {
        return props.attempts - recordList.value.length
      });

      const iconButtonType = computed(() => {
        return isRecording.value && isPause.value ? 'mic' : isRecording.value ? 'pause' : 'mic'
      });

      const isPause = computed(() => {
        return recorder.value.isPause
      }); 
      const isRecording = computed(() => {        
        return recorder.value.isRecording;
      });
      const recordedTime = computed(() => {        
        if (props.time && recorder.value?.duration/1000 >= props.time * 60) {
          stopRecorder()
        }
        return convertTimeMMSS(recorder.value.duration);
      });

      const volume = computed(() => {
        return parseFloat(recorder.value.volume)
      });

      const toggleRecorder = () => {     
        emit('stop-other-audios');   
        if (props.attempts && recorder.value.records.length >= props.attempts) {
          return
        }        

        if (!isRecording.value || (isRecording.value && isPause.value)) {
          selected.value = {};
          recorder.value.start()
        } else {
          // no pause just stop!
          // recorder.value.pause()
          recorder.value.stop();
          const timeout = 100;
          let counter = 0;
          const waitForRecord = setInterval((async () => {
            selected.value = recorder.value.recordList().pop();
            if(!selected.value && counter++ < timeout) {
              return;
            }
            const [minutes, seconds] = selected.value.duration.split(':').map(Number);
            const totalMilliseconds = (minutes * 60 + seconds) * 1000;
            const fixedBlob = await fixWebmDuration(selected.value.blob, totalMilliseconds);
            const fixedBlobUrl = URL.createObjectURL(fixedBlob);   
            selected.value = {
              url: fixedBlobUrl,
              blob: fixedBlob,
              duration: selected.value.duration,
              id: selected.value.id,
              fixed: true,
            };     
            console.log('selected.value:', selected.value);
            clearInterval(waitForRecord);
          }), 200)
          // so that i can play before i send it !
        }
      };
      // not used
      const stopRecorder = () => {
        if (!isRecording) {
          return
        }

        recorder.value.stop()
        recordList.value = recorder.value.recordList()
      };
      const removeRecord  = (idx) => {
        recordList.value.splice(idx, 1)
        // this.$set(selected, 'url', null)
        // this.$eventBus.$emit('remove-record')
      };
      const choiceRecord = (record) => {
        if (selected.value === record) {
          return
        }
        selected.value = record
        props.selectRecord && props.selectRecord(record)
      };

      const resetRecord = () => {
        selected.value = {};
      }

      onBeforeUnmount(() => {
        stopRecorder()
      });


      onMounted(() => {
         // this.$eventBus.$on('start-upload', () => {
      //   this.isUploading = true
      //   this.beforeUpload && this.beforeUpload('before upload')
      // })

      // this.$eventBus.$on('end-upload', (msg) => {
      //   this.isUploading = false

      //   if (msg.status === 'success') {
      //     this.successfulUpload && this.successfulUpload(msg.response)
      //   } else {
      //     this.failedUpload && this.failedUpload(msg.response)
      //   }
      // })
      });

      const stopOtherAudios = (args) => {
        emit('stop-other-audios', args);
      }



      return {
        isUploading,
        recorder,
        recordList,
        selected,
        uploadStatus,
        attemptsLeft,
        iconButtonType,
        volume,
        recordedTime,
        isRecording,
        isPause,
        activeConversationId: props.activeConversationId,
        toggleRecorder,
        stopRecorder,
        removeRecord,
        choiceRecord,
        stopOtherAudios,
        resetRecord
      }
    }
  });
</script>

<template>
  <div class="ar">
    <div class="ar__overlay" v-if="isUploading"></div>
    <div class="ar-spinner" v-if="isUploading">
      <div class="ar-spinner__dot"></div>
      <div class="ar-spinner__dot"></div>
      <div class="ar-spinner__dot"></div>
    </div>

    <div class="ar-content" :class="{'ar__blur': isUploading,  'ar-content-uploader': selected.id}">
      <div class="ar-recorder">
        <icon-button
          class="ar-icon ar-icon__lg"
          :name="iconButtonType"
          :class="{
            'ar-icon--rec': isRecording,
            'ar-icon--pulse': isRecording && volume > 0.02
          }"
          @click.native="toggleRecorder"/>
        <!-- <icon-button
          class="ar-icon ar-icon__sm ar-recorder__stop"
          name="stop"
          @click.native="stopRecorder"/> -->
      </div>

      <!-- <div class="ar-recorder__records-limit" v-if="attempts">Attempts: {{attemptsLeft}}/{{attempts}}</div> -->
      <div v-if="recordedTime != '00:00'" class="ar-recorder__duration">{{recordedTime}}</div>
      <!-- <div class="ar-recorder__time-limit" v-if="time">Record duration is limited: {{time}}m</div> -->
<!-- 
      <div class="ar-records">
        <div
          class="ar-records__record"
          :class="{'ar-records__record--selected': record.id === selected.id}"
          :key="record.id"
          v-for="(record, idx) in recordList"
          @click="choiceRecord(record)">
        </div>
      </div> -->

      <uploader
              v-if="selected.id && selected.fixed"
              class="ar__uploader"
              @reset-record="resetRecord"
              :activeConversationId="activeConversationId"
              :record="selected"
              :filename="selected.url"
              :upload-url="uploadUrl"/>

      <audio-player v-if="selected.url && selected.fixed" :playerUniqId="`main-recorder`" :record="selected"  @stop-other-audios="stopOtherAudios"/>
    </div>
  </div>
</template>

<style lang="scss">
  .ar {
      width: fit-content;
      font-family: Roboto,sans-serif;
      border-radius: 16px;
      background-color: #171717e5;
      box-shadow: 0 4px 18px #0000002b;
      box-sizing: content-box;
      margin-left: auto;
      margin-right: auto;
      height: fit-content;

      position: relative;

    &-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &-records {
      height: 138px;
      padding-top: 1px;
      overflow-y: auto;

      &__record {
        width: 320px;
        height: 45px;
        padding: 0 10px;
        margin: 0 auto;
        line-height: 45px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #E8E8E8;
        position: relative;

        &--selected {
          border: 1px solid #E8E8E8;
          border-radius: 24px;
          background-color: #FFFFFF;
          margin-top: -1px;
          padding: 0 34px;
        }
      }
    }

    &-recorder {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;

      &__duration {
        font-size: 15px;
        font-weight: 500;
        position: absolute;
        top: -44px;
        color: white;
        background: #ff0000eb;
        border-radius: 50px;
        padding: 5px;
      }

      &__stop {
        position: absolute;
        top: 10px;
        right: -52px;
      }

      &__time-limit {
        position: absolute;
        color: #AEAEAE;
        font-size: 12px;
        top: 128px;
      }

      &__records-limit {
        position: absolute;
        color: #AEAEAE;
        font-size: 13px;
        top: 78px;
      }
    }

    &-spinner {
      display: flex;
      height: 30px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 144px;
      z-index: 10;

      &__dot {
        display: block;
        margin: 0 8px;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        background: #05CBCD;
        animation-name: blink;
        animation-duration: 1.4s;
        animation-iteration-count: infinite;
        animation-fill-mode: both;

        &:nth-child(2) { animation-delay: .2s; }

        &:nth-child(3) { animation-delay: .4s; }

        @keyframes blink {
          0%    { opacity: .2; }
          20%   { opacity: 1;  }
          100%  { opacity: .2; }
        }
      }
    }

    &__text {
      color: rgba(84,84,84,0.5);
      font-size: 16px;
    }

    &__blur {
      filter: blur(2px);
      opacity: 0.7;
    }

    &__overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 10;
    }

    &__upload-status {
      text-align: center;
      font-size: 10px;
      padding: 2px;
      letter-spacing: 1px;
      position: absolute;
      bottom: 0;

      &--success {
        color: green;
      }

      &--fail {
        color: red;
      }
    }

    &__rm {
      cursor: pointer;
      position: absolute;
      width: 6px;
      height: 6px;
      padding: 6px;
      line-height: 6px;
      margin: auto;
      left: 10px;
      bottom: 0;
      top: 0;
      color: rgb(244, 120, 90);
    }

    &__downloader,
    &__uploader {
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
    }

    &__downloader {
      right: 115px;
    }

    &__uploader {
      right: 85px;
    }
  }
  .ar-recorder svg {
    position: relative;
    top: -4px;
  }

  .ar-content-uploader {
    position: fixed;
    left: 27%;
    bottom: 10px;
    background: black;
    width: 53%;
  }

  @media (max-width: 768px){
    .ar-content-uploader {
    position: fixed;
    left: 0px;
    bottom: 15px;
    background: #000;
    border: #313131;
    width: 100%;
  }

  .ar-content-uploader .ar-player {
    justify-content: center;
  } 
  }
  @import '../scss/icons';
</style>

