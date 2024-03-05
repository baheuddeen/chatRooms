import { Ref, ref, watch } from "vue";

export default class VideosFacet {
    public streams: Ref<MediaStream[]>;;

    setup() {
        this.streams = ref([]);

        watch(() => this.streams.value.length, () => {
            console.log('streams', this.streams.value);
        });

        return {
            streams: this.streams,
        }
    }
}