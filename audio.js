document.addEventListener("DOMContentLoaded", () => {
    // Set up audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext

    const audioContext = new AudioContext()

    const audioElement = document.querySelector("audio")
    
    const track = audioContext.createMediaElementSource(audioElement)

    // Set up Play/Pause button
    const playButton = document.querySelector("#play-btn")

    playButton.addEventListener(
        "click",
        () => {
            if (audioContext.state === "suspended") {
                audioContext.resume()
            }

            if (playButton.dataset.playing === "false") {
                audioElement.play()
                playButton.dataset.playing = "true"
            } else if (playButton.dataset.playing === "true") {
                audioElement.pause()
                playButton.dataset.playing = "false"
            }
        },
        false,
    )

    // Change playing attribute to false if ended
    audioElement.addEventListener(
        "ended",
        () => {
            playButton.dataset.playing = "false"
        },
        false,
    )


    // Create volume control
    const gainNode = audioContext.createGain()

    const volumeControl = document.querySelector("#volume")

    volumeControl.addEventListener(
        "input",
        ()  => {
            gainNode.gain.value = volumeControl.value
        }
    )

    // Create oscillator
    const oscillator = audioContext.createOscillator()

    const oscillatorControl = document.querySelector("#oscillator")

    const oscillatorType = document.querySelector("#oscillator-type")
    oscillatorType.addEventListener(
        "input",
        () => {
            oscillator.type = oscillatorType.value
        }
    )
    oscillatorControl.addEventListener(
        "input",
        () => {
            oscillator.frequency.setValueAtTime(oscillatorControl.value, audioContext.currentTime)
        }
    )

    const oscillatorOffBtn = document.querySelector('#off-oscillator')

    oscillatorOffBtn.addEventListener(
        "click",
        () => {
            oscillator.stop(audioContext.currentTime)
            // oscillator.disconnect(audioContext.destination)
        }
    )

    const oscillatorOnBtn = document.querySelector('#on-oscillator')

    oscillatorOnBtn.addEventListener(
        "click",
        () => {
            
            oscillator.start(audioContext.currentTime)
        }
    )

    // Create distortion
    const distortion = audioContext.createWaveShaper()
    function makeDistortionCurve(amount) {
        const k = typeof amount === "number" ? amount : 50;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        
        // Math...
        for (let i = 0; i < n_samples; i++) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;
        }
        
        const distortionControl = document.querySelector("#distortion") 

        distortionControl.addEventListener(
        "input",
        () => {
            distortion.curve = makeDistortionCurve(distortionControl.value)
            distortion.oversample = "4x";
        }
        )
    

    // Create compressor
    const compressor = audioContext.createDynamicsCompressor();

        // Compressor ratio
    const ratioControl = document.querySelector("#ratio") 
    const ratioVal = document.querySelector("#ratio-val") 
    
    ratioControl.addEventListener(
        "input",
        () => {
            compressor.ratio.setValueAtTime(ratioControl.value, audioContext.currentTime)
            ratioVal.innerHTML = ratioControl.value
        }
    )

        // Compressor threshold
    const thresholdControl = document.querySelector("#threshold") 
    const thresholdVal = document.querySelector("#threshold-val") 

    thresholdControl.addEventListener(
        "input",
        () => {
            compressor.threshold.setValueAtTime(thresholdControl.value, audioContext.currentTime)
            thresholdVal.innerHTML = thresholdControl.value
        }
    )    
        
        // Compressor knee
    const kneeControl = document.querySelector("#knee") 
    const kneeVal = document.querySelector("#knee-val") 

    kneeControl.addEventListener(
        "input",
        () => {
            compressor.knee.setValueAtTime(kneeControl.value, audioContext.currentTime)
            kneeVal.innerHTML = kneeControl.value
        }
    )

        // Compressor Attack
    const attackControl = document.querySelector("#attack") 
    const attackVal = document.querySelector("#attack-val") 
    
    attackControl.addEventListener(
        "input",
        () => {
            compressor.ratio.setValueAtTime(attackControl.value, audioContext.currentTime)
            attackVal.innerHTML = attackControl.value
        }
    )
        
        // Compressor release
    const releaseControl = document.querySelector("#release") 
    const releaseVal = document.querySelector("#release-val") 
    
    releaseControl.addEventListener(
        "input",
        () => {
            compressor.release.setValueAtTime(releaseControl.value, audioContext.currentTime)
            releaseVal.innerHTML = releaseControl.value
        }
    )

    // Create Panner
    const panner = audioContext.createStereoPanner()
    const pannerControl = document.querySelector("#panner")
    const pannerVal = document.querySelector("#panner-val")
    pannerControl.addEventListener(
        "input",
        () => {
            panner.pan.setValueAtTime(pannerControl.value, audioContext.currentTime)
            pannerVal.innerHTML = pannerControl.value
        }
    )

    // Create Low Pass Filter
    const lowPass = audioContext.createBiquadFilter()

    lowPass.type = "lowpass"
    // lowPass.frequency.setValueAtTime(1000, audioContext.currentTime)
    // lowPass.gain.setValueAtTime(25, audioContext.currentTime)
    
    const lowPassFreqControl = document.querySelector("#low-pass")
    const lowPassFreqVal = document.querySelector('#low-pass-val')
    lowPassFreqControl.addEventListener(
        "input",
        () => {
            lowPass.frequency.setValueAtTime(lowPassFreqControl.value, audioContext.currentTime)
            lowPassFreqVal.innerHTML = lowPassFreqControl.value
        }
    )

    const lowPassQControl = document.querySelector("#low-pass-q")
    const lowPassQVal = document.querySelector("#low-pass-q-val")
    lowPassQControl.addEventListener(
        "input",
        () => {
            lowPass.Q.setValueAtTime(lowPassQControl.value, audioContext.currentTime)
            lowPassQVal.innerHTML = lowPassQControl.value
        }
    )

    //Create High pass filter
        // Create Low Pass Filter
        const highPass = audioContext.createBiquadFilter()

        highPass.type = "highpass"
        // highPass.frequency.setValueAtTime(1000, audioContext.currentTime)
        // highPass.gain.setValueAtTime(25, audioContext.currentTime)
        
        const highPassFreqControl = document.querySelector("#high-pass")
        const highPassFreqVal = document.querySelector('#high-pass-val')
        highPassFreqControl.addEventListener(
            "input",
            () => {
                highPass.frequency.setValueAtTime(highPassFreqControl.value, audioContext.currentTime)
                highPassFreqVal.innerHTML = highPassFreqControl.value
            }
        )
    
        const highPassQControl = document.querySelector("#high-pass-q")
        const highPassQVal = document.querySelector("#high-pass-q-val")
        highPassQControl.addEventListener(
            "input",
            () => {
                highPass.Q.setValueAtTime(highPassQControl.value, audioContext.currentTime)
                highPassQVal.innerHTML = highPassQControl.value
            }
        )

        // ROYGBIV
        const toneColors = {
            "ab": "#ff0000",
            "a": "#f72905",
            "bb": "#f75e05",
            "b": "#f78e05",
            "c": "#f7db05",
            "db": "#b7f705",
            "d": "#31f705",
            "eb": "#05f7bf",
            "e": "#052df7",
            "f": "#5605f7",
            "gb": "#8605f7",
            "g": "#f705cf"      
        }

        const visualSelector =  document.querySelector("#visual-select")
        const customControls = document.querySelector("#custom-controls")
        
        visualSelector.addEventListener(
            "input",
            () => {
                if (visualSelector.value === "custom") {
                    customControls.classList.remove("hidden")
                } else {
                    customControls.classList.add("hidden")
                }
            }
        )
        
        // Visuals attempt
        const createVisual = (keyId) => {
            
            const visContainer = document.querySelector("#visuals")
            const visual = document.createElement("div")
            visual.style.height = "5px"
            visual.style.width = "5px"

            visual.classList.add("visual")
            if (visualSelector.value === "custom") {
                customControls.classList.remove("hidden")

                const finishColor = document.querySelector("#finish-color").value

                const startHeight = document.querySelector("#start-height").value
                const finishHeight = document.querySelector("#finish-height").value

                const startWidth = document.querySelector("#start-width").value
                const finishWidth = document.querySelector("#finish-width").value

                const startDegrees = document.querySelector("#start-degrees").value + "deg"
                const finishDegrees = document.querySelector("#finish-degrees").value + "deg"
                
                const startBordRadius = document.querySelector("#start-bord-radius").value + "%"
                const finishBordRadius = document.querySelector("#finish-bord-radius").value + "%"
                const finishColorToggle = document.querySelector("#finish-color-toggle")

                const customKeyFrames = new KeyframeEffect(
                    visual,
                    [
                        {
                            transform: `scale(${startWidth}, ${startHeight})`,
                            rotate: startDegrees,
                            borderRadius: startBordRadius,
                            marginLeft: "5%"
                        },
                        {
                            marginLeft: "90%"
                        },
                        {
                            
                            transform: `scale(${finishWidth}, ${finishHeight})`,
                            rotate: finishDegrees,
                            marginLeft: "5%",
                            borderRadius: finishBordRadius,
                            backgroundColor: finishColorToggle.checked && finishColor
                        }                      
                    ],
                    { duration: 10000, }
                )
                
                
                const customAnimation = new Animation(
                    customKeyFrames,
                    document.timeline
                )
                
                customAnimation.play()
                // Can modify keyframes made this way with:
                // custom.setKeyframes([
                //     { borderRadius: "0%"},
                //     { borderRadius: "50%"}
                // ])
            } else {
                customControls.classList.add("hidden")
                visual.style.animationName = visualSelector.value
            }
            
            visual.id = `${keyId}-visual`
            var toneColorId
            if (keyId.length === 3) {
                toneColorId = keyId.substring(0, 2)
            } else {
                toneColorId = keyId[0]
            }
            visual.style.backgroundColor = toneColors[toneColorId]
            // visual.style.marginLeft = "-200px"
            visContainer.append(visual)
        }   

        const removeVisual = (keyId) => {
            const visToRemove = document.querySelector(`#${keyId}-visual`)
            visToRemove.remove()
        }



        // A=440 key attempt
        
        var tone
        // const a4Key = document.querySelector("#a4-key")
        const startTone = (key) => {
            tone = audioContext.createOscillator()
            tone.frequency.setValueAtTime(parseFloat(key.dataset.tone), audioContext.currentTime)
            tone.connect(gainNode)
            .connect(distortion)
            .connect(compressor)
            .connect(panner)
            .connect(lowPass)
            .connect(highPass)
            .connect(audioContext.destination)
            tone.start(audioContext.currentTime)
        }

        const keys = document.querySelectorAll(".key")
        keys.forEach(key => key.addEventListener(
            "mouseenter",
            () => {
                startTone(key)
                createVisual(key.id.split("-")[0])
            }
        ))
        keys.forEach(key => key.addEventListener(
            "mouseleave",
            () => {
                tone.stop(audioContext.currentTime)
                setTimeout(() => removeVisual(key.id.split("-")[0]), 10000) 
            }
        ))

        keys.forEach(key => key.addEventListener(
            "ontouchstart",
            () => {
                startTone(key)
                createVisual(key.id.split("-")[0])
                tone.stop()
                setTimeout(() => removeVisual(key.id.split("-")[0]), 10000)
            }
        ))
        // keys.forEach(key => key.addEventListener(
        //     "ontouchend",
        //     () => {
        //         tone.disconnect()
        //         tone.stop(audioContext.currentTime)
        //         setTimeout(() => removeVisual(key.id.split("-")[0]), 10000) 
        //     }
        // ))
        // keys.forEach(key => key.addEventListener(
        //     "ontouchmove",
        //     () => {
        //         tone.stop(audioContext.currentTime)
        //         setTimeout(() => removeVisual(key.id.split("-")[0]), 10000) 
        //     }
        // ))
        // keys.forEach(key => key.addEventListener(
        //     "ontouchcancel",
        //     () => {
        //         tone.stop(audioContext.currentTime)
        //         setTimeout(() => removeVisual(key.id.split("-")[0]), 10000) 
        //     }
        // ))
    

    const audioInput = document.querySelector("#audio-file")
    const audioArea = document.querySelector("#audio-area")
    audioInput.addEventListener(
        "input",
        () => {
            // This is the file name
            console.log(audioInput.files[0].name)
            const audio = document.createElement("audio")
            // if the filename is in local files, this works:            
            audio.src = audioInput.files[0].name
            // Ultimately, will need to save file to db and retrieve it
            audio.controls = true
            audioArea.append(audio)
        }
    )
    // Connect all the nodes to both oscillator and track,
    // send to destination
    oscillator.connect(gainNode)
        .connect(distortion)
        .connect(compressor)
        .connect(panner)
        .connect(lowPass)
        .connect(highPass)
        .connect(audioContext.destination)

    track.connect(gainNode)
        .connect(distortion)
        .connect(compressor)
        .connect(panner)
        .connect(lowPass)
        .connect(highPass)
        .connect(audioContext.destination)


    
}
)