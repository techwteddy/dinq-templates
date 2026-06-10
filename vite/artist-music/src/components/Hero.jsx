function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-overlay"></div>

      <div className="particles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="hero-content">
        <h1 className="hero-title">No fue Real</h1>
        <p className="hero-subtitle">** Chiara Oliver **</p>

        <button
          className="hero-btn"
          onClick={() =>
            window.open(
              "https://open.spotify.com/intl-es/artist/5zeSRJxJzaOyxt9p4kxMLg?si=iPH0KLoVSOObv9WLjk2HEg",
              "_blank",
            )
          }
        >
          Escuchar ahora
        </button>
      </div>
    </section>
  );
}

export default Hero;
