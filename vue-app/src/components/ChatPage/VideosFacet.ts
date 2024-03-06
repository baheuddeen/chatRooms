import { Ref, ref, watch } from "vue";

export interface IMediaStream extends MediaStream {
    isMainStream: boolean;
}

export default class VideosFacet {
    public streams: Ref<IMediaStream[]>;

    onVideoClick(id: string) {
        this.streams.value = this.streams.value.map((stream) => {            
            if(`${stream.id}`== `${id}`) {
                stream.isMainStream = true;
                return stream;
            }
            stream.isMainStream = false;
            return stream;
        });
    }

    setup() {
        this.streams = ref([]);

        watch(() => this.streams, () => {
            console.log('streams', this.streams.value);
        }, { deep: true });

        return {
            streams: this.streams,
            onVideoClick: this.onVideoClick.bind(this),
        }
    }
}