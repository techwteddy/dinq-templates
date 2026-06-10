import { useState, useRef } from "react";
import { useEffect } from "react";
import {FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";

function MusicPlayer(){
    {/* COMPONENTES */}
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const audioRef = useRef(null)

    const songs = [
        {
            title: "puzzle", 
            file: "/music/puzzle.mp3",
            cover: "/images/coverpuzzle.jpg"
        },
        {
            title: "no fue real",
            file: "/music/nofuereal.mp3",
            cover: "/images/nfrcover.jpg"
        },
        {
            title: "margaritas",
            file: "/music/margaritas.mp3",
            cover: "/images/margaritascover.jpg"
        }
    ]

    const[currentSong, setCurrentSong] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    const togglePlay = () => {
        if(isPlaying){
            audioRef.current.pause()
        }else{
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }
    
    const nextSong = () => {
        const next = (currentSong + 1) % songs.length
        setCurrentSong(next)
        setIsPlaying(true)
    }

    const prevSong = () => {
        const prev = (currentSong - 1 + songs.length) % songs.length
        setCurrentSong(prev)
        setIsPlaying(true)
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)

        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }

    useEffect(() => {
        if(isPlaying){
            audioRef.current.play()
        }
    }, [currentSong])

    return(
        <section id="music" className="player">
            <h2>Música</h2>
            <h3>{songs[currentSong].title}</h3>

            {/* <p>{isPlaying ? "Reproduciendo..." : "Pausado"}</p> */}

             <img
                src={songs[currentSong].cover}
                alt="cover"
                className={`cover ${isPlaying ? "playing" : ""}`}
            />

            <div className={`waveform ${isPlaying ? "active" : ""}`}
                style={{"--progress": duration ? currentTime /duration : 0}}>
                {Array.from({ length: 20 }).map((_, i) => (
                    <span key={i}></span>
                ))}
            </div>

            <div className="controls">
              <button onClick={prevSong}>
                <FaBackward />
                </button>

              <button onClick={togglePlay} className="play-btn">
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <button onClick={nextSong}><FaForward /></button>
            </div>

            <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                className="progress-bar"
                style={{background: `linear-gradient(to right, ##7db5f9 ${(currentTime /duration) * 100}%, #ccc ${(currentTime / duration) * 100}%)`
                }}  
                onChange={(e) => {
                    audioRef.current.currentTime = e.target.value
                    setCurrentTime(e.target.value)
                }}
            />

            <p>
                {formatTime(currentTime)} / {formatTime(duration)}
            </p>

            {/* AUDIO REAL */}
            <audio
            ref={audioRef}
            src= {songs[currentSong].file}

            onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
            onLoadedMetadata={() => setDuration(audioRef.current.duration)}
            />

             <div className="song-list">
                {songs.map((song, index) => (
                    <p
                        key={index}
                        onClick={() => {
                             setCurrentSong(index)
                             setIsPlaying(true)
                    }}
                    className={currentSong === index ? "active" : ""}
                    >
                    {song.title}
                </p>
                ))}
            </div>
         
        </section> 

    )
}

export default MusicPlayer