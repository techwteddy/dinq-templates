import { useEffect, useState, useRef } from "react";
import { MdClose } from "react-icons/md";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function Gallery() {
  const touchStartX = useRef(0);
  const images = [
    {
      src: "/images/cokiki.jpg",
      title: "☆",
    },
    {
      src: "/images/cokiki2.jpg",
      title: "☆",
    },
    {
      src: "/images/cokiki5.jpg",
      title: "☆",
    },
    {
      src: "/images/cokiki4.jpg",
      title: "☆",
    },
    {
      src: "/images/cokiki3.jpg",
      title: "☆",
    },
    {
      src: "/images/cokiki6.jpg",
      title: "☆",
    },
    {
      src: "/images/cokiki7.jpg",
      title: "☆",
    },
    {
      src: "/images/cokiki8.jpg",
      title: "☆",
    },
    {
      src: "/images/cokiki9.jpg",
      title: "☆",
    },
    {
      src: "/images/cokiki10.jpg",
      title: "☆",
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(null);

  //Teclado gallery
  useEffect(() => {
    const handleKey = (e) => {
      if (selectedIndex === null) return;

      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }

      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }

      if (e.key === "Escape") {
        setSelectedIndex(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex]);

  return (
    <section id="gallery" className="gallery">
      <h2>Universo Visual</h2>

      <div className="gallery-grid">
        {images.map((img, index) => (
          <div
            className="gallery-item"
            key={index}
            onClick={() => setSelectedIndex(index)}
          >
            <img src={img.src} alt={img.title} />

            <div className="overlay">
              <p>{img.title}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="gallery-modal"
          onClick={() => setSelectedIndex(null)}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const delta = e.changedTouches[0].clientX - touchStartX.current;

            if (delta > 50) {
              //swipe der
              setSelectedIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1,
              );
            }

            if (delta < -50) {
              //swipe izq
              setSelectedIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1,
              );
            }
          }}
        >
          <span className="close-btn">
            <MdClose />
          </span>

          <button
            className="nav left"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1,
              );
            }}
          >
            <FaArrowLeft />
          </button>

          <img
            src={images[selectedIndex].src}
            className="modal-img"
            onClick={(e) => e.stopPropagation()}
          ></img>

          <button
            className="nav right"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1,
              );
            }}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </section>
  );
}

export default Gallery;
