const getMediaBtn = document.querySelector('.container .getMedia');
const startWaveBtn = document.querySelector('.container .startWave');
const endWaveBtn = document.querySelector('.container .endWave');
let stream;

class instanceWaveSurfer {
    constructor(container) {
        this.wave;
        this.micContext;
        this.mediaStreamSource;
        this.levelChecker;
        this.container = container;
    }

     createWaveSurfer = (stream) => {
        if (this.wave) this.wave.destroy();
    
        this.wave = WaveSurfer.create({
            container: this.container,
            waveColor: 'rgb(31,159,252)',
            barHeight: 3,
            barGap: 2,
            backgroundColor: "rgba(0,0,0,0)",
            cursorColor: "rgba(0,0,0,0)",
            audioRate: 1,
            barWidth: 2,
            interact: false, 
        });
    
        this.micContext = this.wave.backend.getAudioContext();
        this.mediaStreamSource = this.micContext.createMediaStreamSource(stream);
        this.levelChecker = this.micContext.createScriptProcessor(4096, 1, 1);
    
        this.mediaStreamSource.connect(this.levelChecker);
        this.levelChecker.connect(this.micContext.destination);
    
        this.levelChecker.onaudioprocess = (event) => {
            this.wave.empty();
            this.wave.loadDecodedBuffer(event.inputBuffer);
        };
    };

    destroyWaveSurfer = () => {
        if (this.wave) {
            this.wave.destroy();
            document.querySelector(this.container).innerHTML = "";
            this.wave = undefined;
        }
    
        if (this.mediaStreamSource) {
            this.mediaStreamSource.disconnect();
            this.mediaStreamSource = undefined;
        }
    
        if (this.levelChecker) {
            this.levelChecker.disconnect();
            this.levelChecker.onaudioprocess = undefined;
            this.levelChecker = undefined;
        }
    };
}

let instance;
document.querySelector('audio').onloadeddata = (e) => {
    stream = e.currentTarget.captureStream(25);
}

startWaveBtn.onclick = () => {
    instance = new instanceWaveSurfer("#waveform");
    instance.createWaveSurfer(stream);
}

endWaveBtn.onclick = () => {
    if(instance) instance.destroyWaveSurfer();
}