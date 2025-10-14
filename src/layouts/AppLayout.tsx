import React from "react";
import useAppStore from "@/stores/AppStore";
import { useRouter } from "next/navigation";
import { IoChevronUp } from "react-icons/io5";
import TopNav from "@/components/navigation/TopNav";
import Footer from "@/components/navigation/Footer";
import { HiOutlineShoppingBag } from "react-icons/hi";

interface Props {
  children: React.ReactNode;
}

function AppLayout(props: Props) {
  const router = useRouter();
  const cart = useAppStore((state) => state.cart);
  const pageRef = React.useRef<HTMLDivElement>(null);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div ref={pageRef} className="w-full h-full flex flex-col">
      <TopNav />
      <div className="mt-32">{props.children}</div>
      <Footer />
      <button
        id="cart-icon"
        onClick={() => router.push("/cart")}
        className="fixed bottom-6 cursor-pointer left-6 bg-gray-900 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-800 transition shadow-lg"
      >
        <span className="absolute -top-1 -right-1 bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">
          {cart.reduce((acc, item) => acc + (item.quantity ?? 0), 0)}
        </span>
        <HiOutlineShoppingBag size={24} />
      </button>

      <button
        onClick={handleScrollToTop}
        className="fixed bottom-6 cursor-pointer right-6 bg-gray-900 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-800 transition shadow-lg"
      >
        <IoChevronUp size={24} />
      </button>
    </div>
  );
}

export default AppLayout;
