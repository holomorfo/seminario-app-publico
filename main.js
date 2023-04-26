
import { LiveAudio } from "./liveaudio/LiveAudio";

const {init,  registerOscilator} = LiveAudio()


console.log('init')

// registerOscilator()
const activar = document.getElementById( 'activar');
activar.addEventListener('click', init);

const reproducirSine = document.getElementById( 'reproducirSine' );
reproducirSine.addEventListener( 'click', registerOscilator );