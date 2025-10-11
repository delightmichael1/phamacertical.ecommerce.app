import {
  FaBookmark,
  FaUserDoctor,
  FaHandHoldingMedical,
} from "react-icons/fa6";
import Image from "next/image";
import React, { useRef } from "react";
import { GrAdd } from "react-icons/gr";
import { ImFire } from "react-icons/im";
import Card from "@/components/ui/Card";
import AppLayout from "@/layouts/AppLayout";
import { BiCalendar } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiMedicines, GiStarsStack } from "react-icons/gi";
import { PiFlowerLotus, PiHeartbeatFill } from "react-icons/pi";

import cn from "@/utils/cn";
import Hero from "@/components/Hero";
import Product from "@/components/Product";
import { categories, products } from "@/utils/demodata";
import HomeProduct from "@/components/HomeProduct";
import ProductWithNoCart from "@/components/ProductWithNoCart";
import Courasel, { CarouselRef } from "@/components/ui/Carousel";

function Index() {
  return (
    <AppLayout>
      <div className="w-full bg-background flex flex-col space-y-8">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full container mx-auto h-fit">
          <div className="w-full lg:w-1/4">
            <LeftSide />
          </div>
          <div className="w-full lg:w-3/4">
            <RightSide />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function RightSide() {
  const salesListRef = useRef<CarouselRef>(null);
  const blogListRef = useRef<CarouselRef>(null);
  const healthListRef = useRef<CarouselRef>(null);
  const [listContainerWidth, setListContainerWidth] = React.useState(0);

  const blogs = [
    {
      title: "Blog 1",
      image: "/images/image1.jpg",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      date: "2023-01-01",
    },
    {
      title: "Blog 2",
      image: "/images/image1.jpg",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      date: "2023-01-01",
    },
    {
      title: "Blog 3",
      image: "/images/image1.jpg",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      date: "2023-01-01",
    },
    {
      title: "Blog 4",
      image: "/images/image1.jpg",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      date: "2023-01-01",
    },
    {
      title: "Blog 5",
      image: "/images/image1.jpg",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      date: "2023-01-01",
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-4">
      <Hero />
      <div className="w-full grid grid-cols-2 items-center gap-4">
        <HomeProduct
          className="bg-[url('/images/image1.jpg')] bg-cover bg-no-repeat text-gray-500 opacity-50"
          image={"/hero/image1.png"}
          name={"Medicine"}
          description={"up to 50% off"}
        />
        <HomeProduct
          className="bg-[url('/images/image2.jpg')] bg-cover bg-no-repeat text-white"
          image={"/hero/image1.png"}
          name={"Medicine"}
          description={"up to 50% off"}
        />
      </div>
      <Card
        variants={{
          whileInView: { opacity: 1, x: 0 },
          initial: { opacity: 0, x: 200 },
          exit: { opacity: 0, x: 200 },
          transition: { duration: 1, type: "spring" },
        }}
        className="relative p-8 space-y-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">Health Products</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={healthListRef.current?.prev}
              className="bg-white shadow-lg p-2 rounded-full hover:bg-gray-100 z-10 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                />
              </svg>
            </button>

            <button
              onClick={healthListRef.current?.next}
              className="bg-white shadow-lg p-2 rounded-full hover:bg-gray-100 z-10 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="w-full relative">
          <Courasel
            ref={healthListRef}
            itemsLength={products.length}
            isAutoSlide
            setListContainerWidth={setListContainerWidth}
          >
            {products.map((product) => (
              <Product
                key={product.id}
                product={product}
                width={listContainerWidth / 3}
              />
            ))}
          </Courasel>
          <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-card"></div>
          <div className="absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-card"></div>
        </div>
      </Card>
      <div className="w-full grid grid-cols-2 items-center gap-4">
        <HomeProduct
          className="bg-[url('/images/image3.jpg')] bg-cover bg-no-repeat text-white opacity-50"
          image={"/hero/image1.png"}
          name={"Medicine"}
          description={"up to 50% off"}
        />
        <HomeProduct
          className="bg-[url('/images/image2.jpg')] bg-cover bg-no-repeat text-white"
          image={"/hero/image1.png"}
          name={"Medicine"}
          description={"up to 50% off"}
        />
      </div>
      <Card
        variants={{
          whileInView: { opacity: 1, x: 0 },
          initial: { opacity: 0, x: 200 },
          exit: { opacity: 0, x: 200 },
          transition: { duration: 1, type: "spring" },
        }}
        className="relative p-8 space-y-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">Sale Products</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={salesListRef.current?.prev}
              className="bg-white shadow-lg p-2 rounded-full hover:bg-gray-100 z-10 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                />
              </svg>
            </button>

            <button
              onClick={salesListRef.current?.next}
              className="bg-white shadow-lg p-2 rounded-full hover:bg-gray-100 z-10 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="w-full relative">
          <Courasel
            ref={salesListRef}
            itemsLength={products.length}
            isAutoSlide
            setListContainerWidth={setListContainerWidth}
          >
            {products.map((product) => (
              <Product
                key={product.id}
                product={product}
                width={listContainerWidth / 3}
              />
            ))}
          </Courasel>
          <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-card"></div>
          <div className="absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-card"></div>
        </div>
      </Card>
      <Card
        variants={{
          whileInView: { opacity: 1, x: 0 },
          initial: { opacity: 0, x: 200 },
          exit: { opacity: 0, x: 200 },
          transition: { duration: 1, type: "spring" },
        }}
        className="relative p-8 space-y-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">From our Blog</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={blogListRef.current?.prev}
              className="bg-white shadow-lg p-2 rounded-full hover:bg-gray-100 z-10 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                />
              </svg>
            </button>

            <button
              onClick={blogListRef.current?.next}
              className="bg-white shadow-lg p-2 rounded-full hover:bg-gray-100 z-10 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="w-full relative">
          <Courasel
            ref={blogListRef}
            itemsLength={products.length}
            isAutoSlide
            setListContainerWidth={setListContainerWidth}
          >
            {blogs.map((blog, index) => (
              <div
                className={cn(
                  "w-full flex flex-col space-y-4",
                  index === 0 && "ml-4"
                )}
                style={{
                  width: `${listContainerWidth / 3}px`,
                  minWidth: `${listContainerWidth / 3}px`,
                }}
              >
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full aspect-video object-cover rounded-xl"
                />
                <div className="flex items-center space-x-2 text-primary">
                  <BiCalendar />
                  <span>{blog.date}</span>
                </div>
                <p>{blog.description}</p>
                <button className="mt-3 text-primary hover:text-white rounded-full hover:bg-primary flex space-x-2 items-center duration-300 w-fit pr-8 cursor-pointer transition-colors">
                  <GrAdd className="w-10 h-10 p-2 text-white rounded-full bg-primary" />
                  <span className="text-sm font-medium">Read more</span>
                </button>
              </div>
            ))}
          </Courasel>
          <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-card"></div>
          <div className="absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-card"></div>
        </div>
      </Card>
    </div>
  );
}

function LeftSide() {
  const hotListRef = useRef<CarouselRef>(null);
  const [listContainerWidth, setListContainerWidth] = React.useState(0);

  const popularBrands = [
    {
      name: "Brand 1",
      value: "brand-1",
    },
    {
      name: "Brand 2",
      value: "brand-2",
    },
    {
      name: "Brand 3",
      value: "brand-3",
    },
    {
      name: "Brand 4",
      value: "brand-4",
    },
    {
      name: "Brand 5",
      value: "brand-5",
    },
  ];

  const ads = [
    {
      name: "Medicine",
      icon: GiMedicines,
      color: "bg-primary",
      decription: "Over 2500 products",
    },
    {
      name: "Wellness",
      icon: PiFlowerLotus,
      color: "bg-secondary",
      decription: "Health products",
    },
    {
      name: "Diagnostic",
      icon: FaUserDoctor,
      color: "bg-accent",
      decription: "Book tests and checkups",
    },
    {
      name: "Health Corner",
      icon: PiHeartbeatFill,
      color: "bg-pink-500",
      decription: "Trending from health experts",
    },
    {
      name: "Others",
      icon: FaHandHoldingMedical,
      color: "bg-teal-500",
      decription: "More info",
    },
  ];

  const testimonials = [
    {
      name: "John Doe",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
      review:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, quos. The platform exceeded my expectations — from performance to customer support, everything was top-notch.",
      date: "2023-01-01",
    },
    {
      name: "Sarah Johnson",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
      review:
        "I’ve been using this system for several months now, and it has completely transformed how I manage my daily tasks. The interface is smooth, responsive, and beautifully designed. Highly recommended!",
      date: "2023-02-14",
    },
    {
      name: "Michael Brown",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
      review:
        "This service is incredibly reliable. I was impressed by how fast and secure it is compared to others I’ve tried. It saves me hours of work every week and makes collaboration effortless.",
      date: "2023-03-22",
    },
    {
      name: "Emily Davis",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
      review:
        "At first, I was skeptical, but after using it for a while, I can confidently say it’s worth every cent. The attention to detail, from user experience to backend performance, is simply excellent.",
      date: "2023-05-09",
    },
    {
      name: "Robert Wilson",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
      review:
        "This platform offers everything I need in one place. The features are thoughtfully built, and the support team responds almost instantly. It’s rare to find this level of quality and dedication.",
      date: "2023-07-15",
    },
  ];
  return (
    <div className="w-full flex flex-col space-y-4">
      <Card
        className="p-0"
        variants={{
          whileInView: { opacity: 1, x: 0 },
          initial: { opacity: 0, x: -200 },
          exit: { opacity: 0, x: -200 },
          transition: {
            duration: 1,
            type: "spring",
          },
        }}
      >
        <div className="p-4 border-b border-strokedark flex items-center space-x-4 text-lg font-semibold">
          <RxHamburgerMenu className="w-6 h-6" />
          <h2>Category</h2>
        </div>
        <div className="p-4">
          {categories.map((category) => (
            <div
              className="p-2 rounded-lg cursor-pointer hover:text-primary text-sm py-3"
              key={category.value}
            >
              {category.name}
            </div>
          ))}
        </div>
      </Card>
      <Card
        variants={{
          whileInView: { opacity: 1, x: 0 },
          initial: { opacity: 0, x: -200 },
          exit: { opacity: 0, x: -200 },
          transition: {
            duration: 1,
            type: "spring",
          },
        }}
        className="divide-y divide-strokedark"
      >
        {ads.map((ad) => (
          <div className="p-2 text-sm py-3" key={ad.name}>
            <div className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${ad.color}`}
              >
                <ad.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">{ad.name}</h2>
                <p className="text-sm text-gray-500">{ad.decription}</p>
              </div>
            </div>
          </div>
        ))}
      </Card>
      <Card
        variants={{
          whileInView: { opacity: 1, x: 0 },
          initial: { opacity: 0, x: -200 },
          exit: { opacity: 0, x: -200 },
          transition: { duration: 1, type: "spring" },
        }}
        className="p-0"
      >
        <div className="p-4 border-b border-strokedark flex items-center space-x-4 text-lg font-semibold">
          <ImFire className="w-6 h-6" />
          <h2>Hot Deals Day</h2>
        </div>
        <div className="p-4">
          <Courasel
            ref={hotListRef}
            itemsLength={products.length}
            isAutoSlide
            setListContainerWidth={setListContainerWidth}
          >
            {products.map((product) => (
              <Product
                key={product.id}
                product={product}
                width={listContainerWidth}
              />
            ))}
          </Courasel>
        </div>
      </Card>
      <Card
        className="p-0"
        variants={{
          whileInView: { opacity: 1, x: 0 },
          initial: { opacity: 0, x: -200 },
          exit: { opacity: 0, x: -200 },
          transition: {
            duration: 1,
            type: "spring",
          },
        }}
      >
        <div className="p-4 border-b border-strokedark flex items-center space-x-4 text-lg font-semibold">
          <FaBookmark className="w-6 h-6" />
          <h2>Popular Brands</h2>
        </div>
        <div className="p-4">
          {popularBrands.map((brand) => (
            <div
              className="p-2 rounded-lg cursor-pointer hover:text-primary text-sm py-3"
              key={brand.value}
            >
              {brand.name}
            </div>
          ))}
        </div>
      </Card>
      <Card
        variants={{
          whileInView: { opacity: 1, x: 0 },
          initial: { opacity: 0, x: -200 },
          exit: { opacity: 0, x: -200 },
          transition: { duration: 1, type: "spring" },
        }}
        className="p-0 pb-6"
      >
        <div className="p-4 border-b border-strokedark flex items-center space-x-4 text-lg font-semibold">
          <ImFire className="w-6 h-6" />
          <h2>Hot Products</h2>
        </div>
        <div className="p-4 flex flex-col space-y-4">
          {products.map((product) => (
            <ProductWithNoCart key={product.id} product={product} />
          ))}
        </div>
      </Card>
      <Card
        variants={{
          whileInView: { opacity: 1, x: 0 },
          initial: { opacity: 0, x: -200 },
          exit: { opacity: 0, x: -200 },
          transition: { duration: 1, type: "spring" },
        }}
        className="p-0 pb-6"
      >
        <div className="p-4 border-b border-strokedark flex items-center space-x-4 text-lg font-semibold">
          <GiStarsStack className="w-6 h-6" />
          <h2>Testimonials</h2>
        </div>
        <div className="p-4">
          <Courasel
            ref={hotListRef}
            itemsLength={products.length}
            isAutoSlide
            setListContainerWidth={setListContainerWidth}
          >
            {testimonials.map((testimonial) => (
              <div
                className="flex flex-col w-full items-center justify-center "
                style={{
                  width: `${listContainerWidth}px`,
                  minWidth: `${listContainerWidth}px`,
                }}
              >
                <div className="flex items-center space-y-4 flex-col">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div>
                    <h2 className="font-semibold">{testimonial.name}</h2>
                  </div>
                </div>
                <p className="mt-4 text-gray-500 text-center text-sm">
                  {testimonial.review}
                </p>
              </div>
            ))}
          </Courasel>
        </div>
      </Card>
    </div>
  );
}

export default Index;
