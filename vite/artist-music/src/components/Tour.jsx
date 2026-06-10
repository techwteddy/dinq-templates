import { useState } from "react";

function Tour() {
  const [selectedCity, setSelectedCity] = useState(null);

  const shows = [
    {
      id: 1,
      city: "Madrid",
      venue: "Palacio Vistalegre",
      date: "12 Oct 2026",
      map: "https://www.google.com/maps?q=WiZink+Center+Madrid&output=embed",
    },
    {
      id: 2,
      city: "Barcelona",
      venue: "Palau Sant Jordi",
      date: "15 Oct 2026",
      map: "https://www.google.com/maps?q=Palau+Sant+Jordi+Barcelona&output=embed",
    },
    {
      id: 3,
      city: "CDMX",
      venue: "Foro Indie Rocks",
      date: "30 Sep 2026",
      map: "https://www.google.com/maps?q=Foro+Indie+Rocks+CDMX&output=embed",
      isNext: true,
    },
  ];

  return (
    <section id="tour" className="tour">
      <h2>Tour</h2>

      <div className="tour-list">
        {shows.map((show) => (
          <div
            key={show.id}
            className={`tour-card ${selectedCity === show.id ? "active" : ""} ${show.isNext ? "next-show" : ""}`}
          >
            <div className="tour-content">
              <div className="tour-info">
                {show.isNext && <span className="tour-badge">Next show</span>}
                <h3>{show.city}</h3>
                <p>{show.venue}</p>
                <span>{show.date}</span>
              </div>

              <button
                className="buy-btn"
                onClick={() =>
                  setSelectedCity(selectedCity === show.id ? null : show.id)
                }
              >
                Ver ubicacion
              </button>

              {selectedCity === show.id && (
                <div className="map-wrap">
                  <iframe
                    src={show.map}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Tour;
