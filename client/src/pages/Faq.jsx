import React, { useEffect, useState } from "react";
import Containar from "../layouts/Containar";
import BradCumbs from "../components/bradcumbs/BradCumbs";
import AccordianBox from "../components/faq/AccordianBox";
import * as Slider from "@radix-ui/react-slider";

const accordianList = [
  {
    title: "Delivery charges for orders from the Online Shop?",
    para: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates nihil maxime ad perferendis porro, voluptatem itaque iure saepe officiis ea fugit eos facere sit quis temporibus expedita quibusdam voluptatibus magni.",
  },
  {
    title: "How long will delivery take?",
    para: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates nihil maxime ad perferendis porro, voluptatem itaque iure saepe officiis ea fugit eos facere sit quis temporibus expedita quibusdam voluptatibus magni.Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum aperiam, aliquid quaerat iste at rem iusto blanditiis fugiat porro ullam. Eligendi, praesentium. Aliquid architecto esse, excepturi obcaecati deleniti ea. Similique.",
  },
  {
    title: "Do I receive an invoice for my order?",
    para: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates nihil maxime ad perferendis porro, voluptatem itaque iure saepe officiis ea fugit eos facere sit quis temporibus expedita quibusdam voluptatibus magni.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias, libero!",
  },
  {
    title: "Tellus ridicdiam eleifend id ullamcorper?",
    para: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates nihil maxime ad perferendis porro, voluptatem itaque iure saepe officiis ea fugit eos facere sit quis temporibus expedita quibusdam voluptatibus magni.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni incidunt amet sunt dolores, veniam sit corrupti reiciendis vero molestias ipsum illum similique voluptatum saepe atque numquam deleniti ullam est esse voluptate nesciunt excepturi repellendus. Velit eveniet accusantium repudiandae libero repellat suscipit explicabo assumenda, iste excepturi quam voluptate. Voluptate optio est amet iusto, ipsum molestias corrupti hic harum nesciunt quisquam perspiciatis eum, qui commodi ex officia nobis. Nihil sit illum quidem rem, voluptatum totam accusantium. Aut, distinctio ratione. Ipsa esse obcaecati quod magnam possimus, recusandae consectetur fugit assumenda. Obcaecati sed suscipit minus vitae, rerum, accusamus magnam, et sequi numquam eligendi distinctio?",
  },
];
const accordianList2 = [
  {
    title: "Delivery charges for orders from the Online Shop?",
    para: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates nihil maxime ad perferendis porro, voluptatem itaque iure saepe officiis ea fugit eos facere sit quis temporibus expedita quibusdam voluptatibus magni.",
  },
  {
    title: "How long will delivery take?",
    para: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates nihil maxime ad perferendis porro, voluptatem itaque iure saepe officiis ea fugit eos facere sit quis temporibus expedita quibusdam voluptatibus magni.Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum aperiam, aliquid quaerat iste at rem iusto blanditiis fugiat porro ullam. Eligendi, praesentium. Aliquid architecto esse, excepturi obcaecati deleniti ea. Similique.",
  },
  {
    title: "Do I receive an invoice for my order?",
    para: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates nihil maxime ad perferendis porro, voluptatem itaque iure saepe officiis ea fugit eos facere sit quis temporibus expedita quibusdam voluptatibus magni.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias, libero!",
  },
  {
    title: "Tellus ridicdiam eleifend id ullamcorper?",
    para: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates nihil maxime ad perferendis porro, voluptatem itaque iure saepe officiis ea fugit eos facere sit quis temporibus expedita quibusdam voluptatibus magni.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni incidunt amet sunt dolores, veniam sit corrupti reiciendis vero molestias ipsum illum similique voluptatum saepe atque numquam deleniti ullam est esse voluptate nesciunt excepturi repellendus. Velit eveniet accusantium repudiandae libero repellat suscipit explicabo assumenda, iste excepturi quam voluptate. Voluptate optio est amet iusto, ipsum molestias corrupti hic harum nesciunt quisquam perspiciatis eum, qui commodi ex officia nobis. Nihil sit illum quidem rem, voluptatum totam accusantium. Aut, distinctio ratione. Ipsa esse obcaecati quod magnam possimus, recusandae consectetur fugit assumenda. Obcaecati sed suscipit minus vitae, rerum, accusamus magnam, et sequi numquam eligendi distinctio?",
  },
];
const Faq = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BradCumbs title={"Frequently Asked Question"} />
      <div>
        <AccordianBox accordianList={accordianList} heading="Shopping" />
      </div>
      <div className="pb-20">
        <AccordianBox accordianList={accordianList2} heading="Payment" />
      </div>

    </>
  );
};

export default Faq;
