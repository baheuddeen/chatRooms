<style lang="scss">
  .ar-icon__lg.ar-player__play svg{
    position: relative;
    top: -5px;
  } 
  .ar-player {
    width: 380px;
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
      width: 55%;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    &__progress {
      width: 160px;
      margin: 0 8px;
    }

    &__time {
      color: rgba(84,84,84,0.5);
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

  @import '../scss/icons';
</style>



<script>
  import { computed, ref, defineComponent, onMounted } from 'vue'
  import IconButton    from './icon-button.vue'
  import LineControl   from './line-control.vue'
  import VolumeControl from './volume-control.vue'
  import { convertTimeMMSS } from '../lib/utils'

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
    },

    setup (props, { emit }) {
      let duration   = ref(convertTimeMMSS(0))
      let playedTime = ref(convertTimeMMSS(0))
      let progress   = ref(0)
      let isPlaying  = ref(false)
      const player = ref(null);
      const playerId = ref(props.playerUniqId);

      onMounted(() => {
      player.value = document.getElementById(props.playerUniqId);

      console.log('wow', player);
      player.value.addEventListener('ended', () => {
        isPlaying.value = false
      })

      player.value.addEventListener('loadeddata', (ev) => {
        _resetProgress()
        duration.value = convertTimeMMSS(player.value.duration)
      })

      player.value.addEventListener('timeupdate', _onTimeUpdate)

        // this.$eventBus.$on('remove-record', () => {
        //   this._resetProgress()
        // })
      })

      const playback = () => {
        console.log(audioSource.value);
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

      const audioSource = computed(() => {
        let url = props.src;
        if (url) {
          return (document.location.origin + props.src)
        } else   {
          url = props.record.url;
        }
        
        if (url) {
          return url
        } else {
          _resetProgress()
        }
      });
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
    <div class="ar-player-actions">
      <IconButton
        id="play"
        class="ar-icon ar-icon__lg ar-player__play"
        :name="playBtnIcon"
        :class="{'ar-player__play--active': isPlaying}"
        @click.native="playback"/>
    </div>

    <div class="ar-player-bar">
      <div class="ar-player__time">{{playedTime}}</div>
      <line-control
        class="ar-player__progress"
        ref-id="progress"
        :percentage="progress"
        @change-linehead="_onUpdateProgress"/>
      <div class="ar-player__time">{{duration}}</div>
      <volume-control @change-volume="_onChangeVolume"/>
    </div>
    <audio :id="playerId" :src="audioSource"></audio>
  </div>
</template>