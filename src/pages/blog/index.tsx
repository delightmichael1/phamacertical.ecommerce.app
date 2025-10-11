import Card from "@/components/ui/Card";
import AppLayout from "@/layouts/AppLayout";
import { posts } from "@/utils/demodata";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiCalendar } from "react-icons/bi";
import { GrAdd } from "react-icons/gr";

function Index() {
  return (
    <AppLayout>
      <div className="container mx-auto flex flex-col space-y-8">
        <h1 className="text-4xl font-bold">Latest Blogs</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[posts[1], posts[0]].map((post) => (
            <Card className="p-0">
              <Image
                src={post.image}
                alt={post.title}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full aspect-video rounded-t-lg object-cover"
              />
              <div className="p-6 flex flex-col space-y-4">
                <Link href={"#"} className="hover:text-primary duration-300">
                  {post.title}
                </Link>
                <p className="w-full truncate font-normal text-gray-600 text-sm">
                  {post.excerpt}
                </p>
                <div className="items-center justify-between flex space-x-4">
                  <div className="flex items-center space-x-2 text-primary">
                    <BiCalendar />
                    <span>{post.date}</span>
                  </div>
                  <button className="mt-3 text-primary hover:text-white rounded-full hover:bg-primary flex space-x-2 items-center duration-300 w-fit pr-8 cursor-pointer transition-colors">
                    <GrAdd className="w-10 h-10 p-2 text-white rounded-full bg-primary" />
                    <span className="text-sm font-medium">Read more</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[posts[2], posts[3], posts[4]].map((post) => (
            <Card className="p-0">
              <Image
                src={post.image}
                alt={post.title}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full aspect-video rounded-t-lg object-cover"
              />
              <div className="p-6 flex flex-col space-y-4">
                <Link href={"#"} className="hover:text-primary duration-300">
                  {post.title}
                </Link>
                <p className="w-full truncate font-normal text-gray-600 text-sm">
                  {post.excerpt}
                </p>
                <div className="items-center justify-between flex space-x-4">
                  <div className="flex items-center space-x-2 text-primary">
                    <BiCalendar />
                    <span>{post.date}</span>
                  </div>
                  <button className="mt-3 text-primary hover:text-white rounded-full hover:bg-primary flex space-x-2 items-center duration-300 w-fit pr-8 cursor-pointer transition-colors">
                    <GrAdd className="w-10 h-10 p-2 text-white rounded-full bg-primary" />
                    <span className="text-sm font-medium">Read more</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

export default Index;
