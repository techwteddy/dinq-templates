import { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa"

function Merch({cart, setCart, cartRef, triggerBounce}){

    const products = [
        {
            id: 1,
            name: "Hoodie Chiara",
            price: 899,
            image: "/images/hoodieCO.png"
        },
        {
            id: 2,
            name: "Vinyl Edition",
            price: 499,
            image: "/images/vinylCO.png"
        },
        {
            id: 3,
            name: "Camiseta Track07",
            price: 399,
            image: "/images/camisaCO.png"
        }
    ]

    
    const [animatingId, setAnimatingId] = useState(null)
    
     const playSound = () => {
        const audio = new Audio("/sounds/pop.mp3")
        audio.volume = 0.2
        audio.play()
    }
    
    const addToCart = (product, event) => {

        
        // animación visual (+1)
        setAnimatingId(product.id)
        setTimeout(() => {
            setAnimatingId(null)
        }, 600)

        //Posicion incial
        const rect = event.currentTarget.getBoundingClientRect()
        const cartRect = cartRef.current.getBoundingClientRect()

        const img = document.createElement("img")
        img.src = product.image
        img.className = "flying-img"

        document.body.appendChild(img)

        //Pos inicial
        img.style.left = rect.left + "px"
        img.style.top = rect.top + "px"

        const deltaX = cartRect.left - rect.left
        const deltaY = cartRect.top - rect.top
   
        //animacion   
        requestAnimationFrame(() => {
            img.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`
            img.style.opacity = "0"
        })

        setTimeout(() => {
            img.remove()
        }, 800)

        //log carrito
        const existing = cart.find(item => item.id === product.id)
        
        if(existing){
           setCart(cart.map(item =>
            item.id === product.id
                ? { ...item, quantity: item.quantity + 1}
                : item
           ))
        }else{
            setCart([
                ...cart,
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                }
            ])
        }
        triggerBounce() 
        playSound()       
    }

    const removeFromCart = (product) => {

        const existing = cart.find(item => item.id === product.id)

        if(!existing) return
        
        if(existing.quantity === 1){
            setCart(cart.filter(item => item.id !== product.id))
        }else{
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ))
        }
    }

    
    return(
        <section id="merch" className="merch">

            <h2>Merch</h2>

            <div className="merch-grid">

                {products.map((product, index) => {

                    //const isAdded = cart.some(item => item.id === product.id)
                    const item = cart.find(item => item.id === product.id)
                    const quantity = item ? item.quantity : 0 
                    const isAnimating = animatingId === product.id

                    return(
                        <div className="merch-card" key={index}>

                            <img src={product.image} alt={product.name}/>

                            <div className="merch-info">
                                <h3>{product.name}</h3>
                                <p>{product.price}</p>

                                <div className={`cart-controls ${isAnimating ? "pulse" : ""}`}>
                                    <button onClick={() => removeFromCart(product)}>
                                        <FaMinus />
                                    </button>

                                    <span>{quantity}</span>

                                    <button onClick={(e) => addToCart(product, e)}>
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>

                            {isAnimating && <div className="added-popup">+1</div>}
                            
                        </div>
                    )
                })}

            </div>

        </section>
    )
}

export default Merch