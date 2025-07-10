import React from "react";
import { Link } from "react-router-dom";
import Containar from "../../layouts/Containar";
import { socialList } from "../constants";

const AboutInfo = () => {
  return (
    <section>
      <Containar>
        <div className="relative">
          <div className="sticky px-10 top-0 text-center h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-200 to-black-200">
            <h2 className="text-4xl font-bold max-w-screen-md mx-auto">
              Welcome to tuffers
            </h2>
            <p className="mt-2 max-w-screen-md mx-auto">
              Welcome to tuffers , your destination for traditional and modest
              fashion. We specialize in offering a curated selection of
              high-quality cloth & footwear , crafted to reflect both cultural heritage and
              contemporary style. Our products are designed to make you feel
              confident and comfortable, whether you're at a family gathering or
              a formal event.
            </p>
            <div className="my-5 max-w-screen-md mx-auto">
              <strong> What we really do? At tuffers</strong> , <br /> we are
              passionate about providing our customers with authentic and
              stylish cloth & footwear  collections. Our mission is to blend tradition with
              modernity, offering a diverse range of products that cater to all
              occasions. We are committed to delivering quality and
              craftsmanship in every piece we offer, ensuring that you always
              look and feel your best.
            </div>
          </div>
          <div className="px-5 text-center sticky top-0 h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-800 to-purple-800 text-white">
            <h2 className="max-w-screen-md mx-auto text-xl xl:text-3xl">
              <strong>Our Vision</strong>
            </h2>
            <div className="max-w-screen-md mx-auto">
              <br /> Our vision is to be a leading provider of traditional and
              modest fashion, creating and footwear a platform where culture meets
              contemporary trends. We aim to make tuffers a household name for
              anyone seeking quality cloth, with a focus on sustainability and
              ethical production practices.
            </div>
          </div>
          <div className="sticky top-0 text-center h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-800 to-pink-800 text-white ">
            <h2 className="max-w-screen-md mx-auto text-xl xl:text-3xl">
              <strong>Our Mission</strong>
            </h2>
            <div className="max-w-screen-md mx-auto">
              <br /> Our mission is to provide our customers with an exceptional
              shopping experience, offering a wide selection of footwear and
              cloth that cater to both traditional and modern tastes. We are
              dedicated to promoting modest fashion and ensuring that every
              piece we sell is of the highest quality.
            </div>
          </div>
          <div className="sticky text-center top-0 h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-200 to-indigo-100 text-black">
            <h2 className="text-4xl font-bold">Follow us via Social Media</h2>
            <div className="flex list-none gap-10 mt-20">
              {socialList.map((item, index) => {
                const Icon = item?.logo;
                return (
                  <li key={index}>
                    <Link to={item?.link}>
                      <Icon className="w-10 h-10 bg-gray-600 p-2 text-white hover:scale-105 rounded-md transition-all ease-linear duration-200 " />
                    </Link>
                  </li>
                );
              })}
            </div>
          </div>
        </div>
      </Containar>
    </section>
  );
};

export default AboutInfo;
