import React, { useEffect, useState } from "react";

interface Props {
  productImage: string;
  buttonId: string;
}

interface FlyingItemStyle {
  left: string;
  top: string;
  animation: string;
  "--end-x": string;
  "--end-y": string;
}

function FlyingToCart(props: Props) {
  const [flyingItems, setFlyingItems] = useState<any[]>([]);

  useEffect(() => {
    const cart = document.getElementById("cart-icon");
    const cartRect = cart?.getBoundingClientRect();
    if (!cartRect) return;

    const button = document.getElementById(props.buttonId);
    const buttonRect = button?.getBoundingClientRect();
    if (!buttonRect) return;

    const flyingItem = {
      id: Date.now(),
      startX: buttonRect.left + buttonRect.width / 2,
      startY: buttonRect.top + buttonRect.height / 2,
      endX: cartRect.left + cartRect.width / 2,
      endY: cartRect.top + cartRect.height / 2,
      image: props.productImage,
    };

    setFlyingItems((prev) => [...prev, flyingItem]);

    setTimeout(() => {
      setFlyingItems((prev) =>
        prev.filter((item) => item.id !== flyingItem.id)
      );
    }, 1000);
  }, []);

  return (
    <>
      {flyingItems.map((item) => (
        <div
          key={item.id}
          className="fixed pointer-events-none z-50"
          style={
            {
              left: `${item.startX}px`,
              top: `${item.startY}px`,
              animation:
                "flyToCart 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
              "--end-x": `${item.endX - item.startX}px`,
              "--end-y": `${item.endY - item.startY}px`,
            } as FlyingItemStyle
          }
        >
          <img
            src={item.image}
            alt="Flying product"
            className="w-20 h-20 object-cover rounded-lg shadow-2xl"
            style={{
              animation:
                "shrinkAndFade 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
            }}
          />
        </div>
      ))}
    </>
  );
}

export default FlyingToCart;
