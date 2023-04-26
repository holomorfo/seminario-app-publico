const { selectLineDown } = require('@codemirror/commands')

const LiveAudio = function () {
  var AudioContext = window.AudioContext || window.webkitAudioContext // esto será importante ?
  let audioCtx = new AudioContext()
  let oscilatorList = []
  // create Oscillator node
  const init = () => {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
      console.log('iniciar')
      g = audioCtx.createGain()
      g.gain.value = 0.1

    }
  }
  const registerOscilator = () => {
    const oscillator = audioCtx.createOscillator()
    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime) // value in hertz
    oscillator.connect(audioCtx.destination)
    oscillator.start()
    oscilatorList.push(oscillator)
  }

  return { init, registerOscilator }
}
module.exports = {
  LiveAudio
}
