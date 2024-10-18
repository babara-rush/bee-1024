
const sources = ['./explosion.wav', './hit.wav']
class _AudioControl {
  audioList;

  constructor() {
    this.init()
  }

  init() {
    this.audioList = sources.map(source => {
      const audio = new Audio()
      audio.src = source;
      audio.load()
      return audio
    })

  }
  playExplosion() {
    this.audioList[0].play();
  }

  playShoot() {
    this.audioList[1].play();
  }
}

const _control = new _AudioControl()

const AudioControl = new Proxy(_AudioControl, {
  construct() {
    return _control;
  },
  get(_, prop) {
    return Reflect.get(_control, prop)
  }
})

export {
  AudioControl
}
