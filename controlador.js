const SptmAudio = function () {
  var AudioContext = window.AudioContext || window.webkitAudioContext // esto será importante ?
  let audioCtx = new AudioContext()

  let randomNoiseNode
  let sineNode
  let microphone
  let video = document.getElementById('videoElement')
  let sources = []
  let gainNoise, gainSine

  function init() {

    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
      console.log('iniciar')
    }

    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          microphone = audioCtx.createMediaStreamSource(stream)
          // samples()
          // `microphone` can now act like any other AudioNode
        })
        .catch((err) => {
          console.log(err)
          // browser unable to access microphone
        })
    } else {
      // browser unable to access media devices
      // (update your browser)
    }

    start()
    startSine()

    sliderRuidoBlanco.onchange = function () {
      gainNoise.setValueAtTime(sliderRuidoBlanco.value, audioCtx.currentTime)
    }

    sliderSine.onchange = function () {
      gainSine.setValueAtTime(sliderSine.value, audioCtx.currentTime)
    }
  }

  async function start() {
    await audioCtx.audioWorklet.addModule('js/random-noise-processor.js')
    randomNoiseNode = new AudioWorkletNode(audioCtx, 'random-noise-processor')
    gainNoise = randomNoiseNode.parameters.get('customGain')
    gainNoise.setValueAtTime(0, audioCtx.currentTime)
  }

  async function startSine() {
    await audioCtx.audioWorklet.addModule('js/sine-processor.js')
    sineNode = new AudioWorkletNode(audioCtx, 'sine-processor')
    gainSine = sineNode.parameters.get('customGain')
    gainSine.setValueAtTime(0, audioCtx.currentTime)
  }

  function suspend() {
    audioCtx.suspend()
  }

  function reproducirRuidoFunc() {
    randomNoiseNode.connect(audioCtx.destination)
  }

  function detenerRuidoFunc() {
    randomNoiseNode.disconnect(audioCtx.destination)
  }

  function reproducirSineFunc() {
    sineNode.connect(audioCtx.destination)
  }

  function detenerSineFunc() {
    sineNode.disconnect(audioCtx.destination)
  }

  function reproducirMicFunc() {
    microphone.connect(audioCtx.destination)
  }

  function detenerMicFunc() {
    microphone.disconnect(audioCtx.destination)
  }

  function encenderCamaraFunc() {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }

  function detenerCamaraFunc() {
    video.srcObject = null
  }

  function iniciarAF1(audioFile1) {
    var reader = new FileReader()
    reader.onload = function (ev) {
      audioCtx.decodeAudioData(ev.target.result).then(function (buffer) {
        sources[0] = audioCtx.createBufferSource()
        sources[0].buffer = buffer
        sources[0].connect(audioCtx.destination)
        sources[0].start(0)
      })
    }
    reader.readAsArrayBuffer(audioFile1.files[0])
  }

  function iniciarAF2(audioFile2) {
    var reader = new FileReader()
    reader.onload = function (ev) {
      audioCtx.decodeAudioData(ev.target.result).then(function (buffer) {
        sources[1] = audioCtx.createBufferSource()
        sources[1].buffer = buffer
        sources[1].connect(audioCtx.destination)
        sources[1].start(0)
      })
    }
    reader.readAsArrayBuffer(audioFile2.files[0])
  }
    
    function chgainNoise(value){
	gainNoise.setValueAtTime(value, audioCtx.currentTime);
    }

    function chgainSine(value){
	gainSine.setValueAtTime(value, audioCtx.currentTime);
    }

    
  return {
    init,
    start,
    startSine,
    suspend,
    reproducirRuidoFunc,
    detenerRuidoFunc,
    reproducirSineFunc,
    detenerSineFunc,
    reproducirMicFunc,
    detenerMicFunc,
    encenderCamaraFunc,
    detenerCamaraFunc,
    iniciarAF1,
    iniciarAF2,
    chgainNoise,
    chgainSine
  }
}

module.exports = {
  SptmAudio
}
