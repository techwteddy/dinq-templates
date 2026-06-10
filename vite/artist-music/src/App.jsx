// Componentes
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import MusicPlayer from "./components/MusicPlayer"
import Gallery from "./components/Gallery"
import Merch from "./components/Merch"
import Tour from "./components/Tour"
import { useRef, useState } from "react"
import { SocialIcon } from 'react-social-icons';

function App() {

  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const cartRef = useRef()
  const [bounce, setBounce] = useState(false)

  const triggerBounce = () => {
    setBounce(false)
    setTimeout(() => {
      setBounce(true)
      setTimeout(() => setBounce(false),400)
    }, 10)
  }

  return (
    <>
      <Navbar 
      cart={cart}
      setCart={setCart}
      cartRef={cartRef}
      cartOpen={cartOpen}
      setCartOpen={setCartOpen}
      bounce={bounce}
      />
      <Hero />
      <MusicPlayer />
      <Gallery />
      <Merch 
      cart={cart} 
      setCart={setCart} 
      cartRef={cartRef}
      triggerBounce={triggerBounce}
      />
      <Tour />

      <footer className="footer">
        <div className="footer-content">

          <h3>Chiara Oliver</h3>
          <p>© 2026 All rights reserved</p>

          <div className="footer-socials">
            <a href="https://open.spotify.com/intl-es/artist/5zeSRJxJzaOyxt9p4kxMLg?si=2fh3GgtZRVeoixVUdHachA">Spotify</a>
            <a href="https://www.instagram.com/chiaraoliver/">Instagram</a>
            <a href="https://www.youtube.com/@chiaraoliver4045">YouTube</a>
          </div>

        </div>

      </footer>

      
    </>
  )
}

export default App