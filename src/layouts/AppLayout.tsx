import React from "react";
import TopNav from "@/components/navigation/TopNav";
import Footer from "@/components/navigation/Footer";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { IoChevronUp } from "react-icons/io5";
import { AiOutlineArrowRight } from "react-icons/ai";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

function AppLayout(props: Props) {
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
      <div className="mt-52">{props.children}</div>
      <div className="w-full bg-[url('/images/email.webp')] bg-cover bg-no-repeat bg-top mt-8">
        <div className="w-full bg-background/90 flex flex-col items-center justify-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 1, type: "spring" }}
            className="flex flex-col items-center justify-center space-y-8 w-full"
          >
            <span className="text-2xl font-bold text-primary">
              Subscribe to our newsletter
            </span>
            <p className="text-center max-w-96">
              Join 60.000+ Subscribers and get a new discount coupon every
              Saturday.
            </p>
            <div
              className={
                "bg-card rounded-full flex items-center space-x-2  w-full max-w-[40rem] p-1"
              }
            >
              <input
                type="text"
                className={
                  "bg-transparent outline-none w-full px-6 placeholder:text-gray-500"
                }
                placeholder="Enter email..."
              />
              <button
                type="button"
                className={
                  "rounded-full bg-primary text-white p-3 px-6 cursor-pointer flex space-x-2 items-center duration-100"
                }
              >
                <span>Subscribe</span>
                <AiOutlineArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
      <button className="fixed bottom-6 cursor-pointer left-6 bg-gray-900 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-800 transition shadow-lg">
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
