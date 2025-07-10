import React, { useContext, useState } from "react";
import Containar from "../../layouts/Containar";
import { Link } from "react-router-dom";
import { socialList } from "../constants";
import axios from "axios";
import ApiContext from "../baseapi/BaseApi";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const ContactInfo = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const baseApi = useContext(ApiContext);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await axios.post(`${baseApi}/send`, formData);
      setSuccessMsg("Your message has been sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setErrorMsg("Something went wrong. Please try again later.");
    }
    setIsSending(false);
  };

  return (
    <section className="py-12 bg-gray-50">
      <Containar>
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Information */}
          <div className="bg-white p-8 shadow-lg rounded-xl">
            <h3 className="text-2xl md:text-4xl text-texthead font-semibold mb-6">
              Contact Information
            </h3>
            <p className="text-base text-gray-600 mb-8">
              We will answer any questions you may have about our online sales,
              rights or partnership service right here.
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-medium text-texthead">
                  Chattogram Office
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Beside Shangbadik Housing Society Main Gate, Baizid Thana Road,
                  Nasirabad, Chittagong 4210
                </p>
              </div>
              <div>
                <h4 className="text-xl font-medium text-texthead mt-4">
                  Dhaka Office
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  House# 22, Road# 07, Block#B, Bosila City Developers, Dhaka,
                  Bangladesh
                </p>
              </div>
              <div>
                <h4 className="text-xl font-medium text-texthead mt-4">
                  Outlet Store
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Yunusco City Center shop no.316, 3rd Floor, Gec Mor,
                  Chattogram, Bangladesh
                </p>
              </div>
              <div className="mt-4">
                <a
                  href="mailto:contact@tuffersbd.com"
                  className="text-sm  flex items-center gap-x-1 text-blue-600 hover:underline"
                >
                  <MdEmail />

                  contact@tuffersbd.com
                </a>
                <a
                  href="tel:01810688090"
                  className="text-sm flex items-center gap-x-1 text-blue-600 hover:underline"
                ><FaPhoneAlt />

                  01810688090
                </a>
              </div>
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-2">Social Media</h4>
                <ul className="flex gap-4">
                  {socialList.map((item, index) => {
                    const Icon = item.logo;
                    return (
                      <li key={index}>
                        <Link
                          to={item.link}
                          className="text-gray-700 hover:text-blue-600"
                        >
                          <Icon size={22} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 shadow-lg rounded-xl">
            <h3 className="text-2xl font-semibold text-texthead mb-6">
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:ring focus:ring-blue-100"
                placeholder="Your Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:ring focus:ring-blue-100"
                placeholder="Your Email"
                required
              />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:ring focus:ring-blue-100"
                placeholder="Subject"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:ring focus:ring-blue-100"
                placeholder="Your Message"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-danger hover:bg-blue-700 text-white px-6 py-3 rounded w-full font-medium"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Message"}
              </button>
              {successMsg && <p className="text-green-600">{successMsg}</p>}
              {errorMsg && <p className="text-red-600">{errorMsg}</p>}
            </form>
          </div>
        </div>
      </Containar>
    </section>
  );
};

export default ContactInfo;