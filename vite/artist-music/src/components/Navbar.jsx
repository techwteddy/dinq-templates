import { useRef } from "react";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { useEffect } from "react";

function Navbar({ cart, setCart, setCartOpen, cartRef, cartOpen, bounce }) {

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if ( !cartRef.current || !cartRef.current.contains(e.target)) {
        setCartOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>{
        document.removeEventListener("mousedown", handleClickOutside);
    } 
  }, [cartRef, setCartOpen]);

  const totalPrice = cart.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0,
  );

  const removeItem = (id) => {
    //console.log("eliminando:", id);
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <>
      <nav>
        <img src="/images/cologo.jpg" alt="logo" className="logo"></img>

        <ul>
          <li><a href="#hero">Home</a></li>
          <li><a href="#music">Music</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#tour">Tour</a></li>
        </ul>

        <div ref={cartRef}>
          <div
            className="cart-container"
            onClick={() => setCartOpen(!cartOpen)}
          >
            <span className={`cart-icon ${bounce ? "cart-bounce" : ""}`}>
              <FaShoppingCart />
            </span>
            <span className="cart-count">{totalItems}</span>
          </div>

          {cartOpen && (
            <div className="cart-dropdown">
              <h3>Tu carrito</h3>
              
              {cart.length === 0 ? (
                <p>Vacío</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <span>{item.name}</span>
                    <span>x{item.quantity}</span>

                    <button onClick={(e) => {
                        e.stopPropagation()
                        removeItem(item.id)}}
                        >
                        <FaTrash />
                    </button>
                  </div>
                ))
              )}
              <h4>Total: ${totalPrice}</h4>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
