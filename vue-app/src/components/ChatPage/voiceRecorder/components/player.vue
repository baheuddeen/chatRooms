<script lang="ts">
  import { computed, ref, defineComponent, onMounted, watch } from 'vue'
  import IconButton    from './icon-button.vue'
  import LineControl   from './line-control.vue'
  import VolumeControl from './volume-control.vue'
  import { convertTimeMMSS } from '../lib/utils'
  import Encryption from '../../../../utilites/Encryption'

  export default defineComponent({
    components: {
      IconButton,
      LineControl,
      VolumeControl
    },

    props: {
      src      : { type: String },
      record   : { type: Object },
      filename : { type: String },
      playerUniqId: { type: String },
      iv: {type: ArrayBuffer},
      symmetricKey: {type: ArrayBuffer},
      is_encrypted: {type: Number},
    },

    setup (props, { emit }) {
      let duration   = ref(convertTimeMMSS(0))
      let playedTime = ref(convertTimeMMSS(0))
      let progress   = ref(0)
      let isPlaying  = ref(false)
      const player = ref(null);
      const playerId = ref(props.playerUniqId);
      const audioSource = ref(null);

      onMounted(async () => {
      player.value = document.getElementById(props.playerUniqId);

      audioSource.value = await (async () => {
        let url = props.src || props.record.url;        
        if (props.is_encrypted == 1) {
          const res = await fetch(props.src);
          const encryptedBlob = await res.blob() as Blob;
          const iv = props.iv;
          const symmetricKeyEncrypted =  props.symmetricKey;          
          const symmetricKey = await Encryption.decryptMessage(symmetricKeyEncrypted);
          const decryptedData = await Encryption.decryptBinaryData({
            encryptedData: await encryptedBlob.arrayBuffer(),
            symmetricKeyBuffer: symmetricKey,
            iv, 
          });
          const blob = new Blob([decryptedData],{ type: "audio/ogg; codecs=opus" });
          url = URL.createObjectURL(blob);        
        }
        
        if (url) {
          return audioSource.value = url;
        } else {
          _resetProgress()
        }
      })();

      player.value.addEventListener('ended', () => {
        isPlaying.value = false
      });

      player.value.addEventListener('loadeddata', (ev) => {
        _resetProgress()
        duration.value = convertTimeMMSS(player.value.duration)
      });

      player.value.addEventListener('timeupdate', _onTimeUpdate)

        // this.$eventBus.$on('remove-record', () => {
        //   this._resetProgress()
        // })
      })

      const playback = () => {
        emit('stop-other-audios', props.playerUniqId);
        if (!audioSource.value) {
          return
        }

        if (isPlaying.value) {
          player.value.pause()
        } else {
          setTimeout(() => { player.value.play() }, 0)
        }

        isPlaying.value = !isPlaying.value
      };
      const _resetProgress = () => {
        if (isPlaying.value) {
          player.value.pause()
        }


      };
      const _onTimeUpdate = () => {
        playedTime.value = convertTimeMMSS(player.value.currentTime)
        progress.value = (player.value.currentTime / player.value.duration) * 100
      };
      const _onUpdateProgress = (pos) => {
        if (pos) {
          player.value.currentTime = pos * player.value.duration
        }
      };
      const _onChangeVolume = (val) => { 
        if (val) {
          player.value.volume = val
        }
      };

      const playBtnIcon = computed(() => {
        return isPlaying.value ? 'pause' : 'play'
      });


      return {
        isPlaying,
        duration,
        playedTime,
        progress,
        playback,
        _onChangeVolume,
        _onUpdateProgress,
        _onTimeUpdate,
        _resetProgress,
        audioSource,
        playBtnIcon,
        playerId,
      }
    }
})
</script>


<template>
  <div class="ar-player">
    <div class="ar-player-actions d-none">
      <IconButton
        id="play"
        class="ar-icon ar-icon__lg ar-player__play"
        :name="playBtnIcon"
        :class="{'ar-player__play--active': isPlaying}"
        @click.native="playback"/>
    </div>

    <div class="ar-player-bar d-none">
      <div class="ar-player__time">{{playedTime}}</div>
      <line-control
        class="ar-player__progress"
        ref-id="progress"
        :percentage="progress"
        @change-linehead="_onUpdateProgress"/>
      <div class="ar-player__time">{{duration}}</div>
      <volume-control @change-volume="_onChangeVolume"/>
    </div>
    <audio class="audio-player-native" controls :id="playerId" :src="audioSource"></audio>
  </div>
</template>

<style lang="scss">
  .ar-icon__lg.ar-player__play svg{
    position: relative;
    top: -5px;
  } 
  .ar-player {
    width: fit-content;
    height: unset;
    border: 0;
    border-radius: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: unset;
    font-family: 'Roboto', sans-serif;

    & > .ar-player-bar {
      border: 1px solid #E8E8E8;
      border-radius: 24px;
      margin: 0 0 0 5px;

      & > .ar-player__progress {
        width: 125px;
      }
    }

    &-bar {
      display: flex;
      align-items: center;
      height: 38px;
      padding: 0 12px;
      margin: 0 5px;
    }

    &-actions {
      display: flex;
      align-items: center;
    }

    &__progress {
      width: 160px;
      margin: 0 8px;
    }

    &__time {
      color: white;
      font-size: 16px;
      width: 41px;
    }

    &__play {
      width: 45px;
      height: 45px;
      background-color: #FFFFFF;
      box-shadow: 0 2px 11px 11px rgba(0,0,0,0.07);

      &--active {
        fill: white !important;
        background-color: #05CBCD !important;

        &:hover {
          fill: #505050 !important;
        }
      }
    }
  }

  @media (max-width: 766px) {
    .ar-player__progress {
      width: 80px !important;
    }

    .ar-player{
      justify-content: left;
    }
    .ar-volume__icon,
    .ar-volume-bar {
      display: none
    }
  }

  .audio-player-native {
    display: block;
    border: 1px solid white;
    border-radius: 30px;
    max-width: 100%;
    height: 50ox;
  }

  @import '../scss/icons';
</style>

