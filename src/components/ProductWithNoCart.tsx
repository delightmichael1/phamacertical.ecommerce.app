import Image from "next/image";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { RiMenu4Fill } from "react-icons/ri";

type Props = {
  product: IProduct;
};

const ProductWithNoCart: React.FC<Props> = ({ product }) => {
  return (
    <motion.div
      key={`${product.id}`}
      className="rounded-lg group p-4 hover:shadow-md hover:shadow-black/30 transition-shadow duration-300 bg-white flex flex-row w-full items-center justify-center space-x-2"
    >
      <div className="relative w-20 min-w-20 h-20 overflow-hidden rounded-xl">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 duration-700 transition-all"
          priority={true}
        />
        {product.discount && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
          >
            -{product.discount}%
          </motion.span>
        )}
      </div>
      <div className="w-full">
        <h3 className=" font-semibold text-sm">{product.name}</h3>
        <p className="text-xs text-gray-500 truncate">{product.category}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-gray-400 line-through text-sm">
            ${product.oldPrice.toFixed(2)}
          </span>
          <span className="text-primary font-bold">
            ${product.newPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductWithNoCart;
