import { useEffect, useState } from "react";
import useAppStore from "@/stores/AppStore";
import { IoChevronUp } from "react-icons/io5";
import Footer from "@/components/navigation/Footer";
import TopNav from "@/components/navigation/TopNav";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import usePersistedStore from "@/stores/PersistedStored";

interface Props {
  title?: string;
  description?: string;
  isSupplier?: boolean;
  children: React.ReactNode;
}

function ShopLayout(props: Props) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const cart = usePersistedStore((state) => state.cart);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const controlScrollButton = () => {
    if (typeof window !== "undefined") {
      const currentScroll = window.scrollY;
      if (currentScroll < 100) {
        setShowScrollButton(false);
      } else {
        setShowScrollButton(true);
      }
    }
  };

  useEffect(() => {
    window?.addEventListener("scroll", () => controlScrollButton());
    return () => {
      window?.addEventListener("scroll", () => controlScrollButton());
    };
  }, []);

  return (
    <div className="flex flex-col w-full">
      <TopNav />
      <div className="mt-28 p-4 pb-20">{props.children}</div>
      <Footer />
      <button
        id="cart-icon"
        onClick={() =>
          useAppStore.setState({ showSideBar: { open: true, value: "cart" } })
        }
        className="bottom-6 left-6 fixed flex justify-center items-center bg-gray-900 hover:bg-gray-800 shadow-lg rounded-full w-12 h-12 text-white transition cursor-pointer"
      >
        <span className="-top-1 -right-1 absolute flex justify-center items-center bg-primary rounded-full w-6 h-6 text-white text-xs">
          {cart.reduce((acc, item) => acc + (item.quantity ?? 0), 0)}
        </span>
        <HiOutlineShoppingBag size={24} />
      </button>

      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.1, type: "spring" }}
            onClick={handleScrollToTop}
            className="right-6 bottom-6 fixed flex justify-center items-center bg-gray-900 hover:bg-gray-800 shadow-lg rounded-full w-12 h-12 text-white transition cursor-pointer"
          >
            <IoChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ShopLayout;
