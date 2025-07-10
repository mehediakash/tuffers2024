import React, { useState } from "react";
import Containar from "../../layouts/Containar";

const ParagraphtoList = ({ paragraph }) => {
  const [activeTab, setActiveTab] = useState("details");

  // Sample content for tabs - replace with your actual content
  const tabsContent = {
    details: {
      title: "Product Details",
      content: paragraph,
    },
    return: {
      title: "Return Policy",
      content: `
        <h3>Our Return Policy</h3>
        <ul>
          <li>চট্টগ্রাম  সিটি থেকে রিটার্ন করার নিয়মঃ পণ্য রিসিভ করার সময় অবশ্যই ডেলিভারি ম্যানের সামনে দেখে বুজে নিতে হবে, ডেলিভারি ম্যান চলে আসার পর কোন কমপ্লেইন গ্রহণ যোগ্য হবে না। পণ্য পছন্দ না হলেও চার্জ প্রযোজ্য হবে।</li>
          <li>চট্টগ্রাম  বাইরে থেকে রিটার্ন করার নিয়মঃ কুরিয়ার থেকে পণ্য রিসিভ করার সময় অবশ্যই কুরিয়ার অফিস থেকে চেক করে নিতে হবে, কোন প্রবলেম থাকলে আমাদের কল সেন্টার 01810688090 এ জানাতে হবে, হোম ডেলিভারির ক্ষেত্রে ডেলিভারি ম্যানের সামনে দেখে বুজে নিতে হবে, ডেলিভারি ম্যান চলে আসার পর কোন কমপ্লেইন গ্রহণ যোগ্য হবে না। পণ্য পছন্দ না হলেও চার্জ প্রযোজ্য হবে।</li>
          <li>বৃহস্পতিবার ব্যাতীত সপ্তাহে ছয় দিন আমাদের শোরুম খোলা থাকবে, শপে এসেও পণ্য চেঞ্জ করা যাবে, সেক্ষেত্রে গ্রহণযোগ্য করন থাকতে হবে অথবা আনবক্সিং ভিডিও দেখাতে হবে।* আমাদের থেকে কোন পণ্য ভুল সাইজ বা ত্রুটিপূর্ণ দেয়া হলে সেটার চার্জ পাঞ্জাবি শপ লিমিটেড বহন করবে আর সঠিক পণ্য দেয়া সত্তে চেঞ্জ বা পরিবর্তন করতে চাইলে সকল খরচ কাস্টোমারকে বহন করতে হবে। সর্বোচ্চ ৭দিনের মধ্যে পণ্য পরিবর্তন করা যাবে।</li>
          
  
        </ul>
        
        
      `,
    },
    refunds: {
      title: "Refunds & Replacements",
      content: `
        <h3>Our Refund Policy</h3>
        <ul>
          <li>Items must be unused and in original packaging</li>
          <li>Refunds processed within 5-7 business days</li>
        </ul>
        
        <h3 class="mt-6">Replacement Policy</h3>
        <ul>
          <li>Free replacements for damaged or defective items</li>
          <li>Request must be made within 3 days of delivery</li>
          <li>Provide photos of damaged items for verification</li>
        </ul>
      `,
    },
    shipping: {
      title: "Shipping Rates & Policies",
      content: `
        <h3>Domestic Shipping</h3>
        <ul>
          <li>Inside Chattogram: ৳80 (1-3 business days)</li>
          <li>Outside Chattogram: ৳130 (3-5 business days)</li>
          <li>Free shipping on orders over ৳2000</li>
        </ul>
        
        <h3 class="mt-6">International Shipping</h3>
        <ul>
        
          <li>Shipping costs calculated at checkout</li>
          <li>Delivery times vary by destination</li>
        </ul>
        
    
      `,
    },
  };

  return (
    <section className="pb-16 pt-10 xl:pt-10">
      <Containar>
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          {Object.keys(tabsContent).map((tabKey) => (
            <button
              key={tabKey}
              className={`px-6 py-3 font-medium text-sm md:text-base transition-colors duration-200 ${
                activeTab === tabKey
                  ? "text-danger border-b-2 border-danger"
                  : "text-gray-600 hover:text-danger"
              }`}
              onClick={() => setActiveTab(tabKey)}
            >
              {tabsContent[tabKey].title}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-medium text-texthead mb-6">
            {tabsContent[activeTab].title}
          </h2>
          <div
            className="default_behave prose max-w-none"
            dangerouslySetInnerHTML={{ __html: tabsContent[activeTab].content }}
          />
        </div>

        {/* Additional Help Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-texthead mb-4">
            Need more help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Contact Customer Support</h4>
              <p className="text-gray-600">
                Email us at: contact@tuffersbd.com
                <br />
                Call us: 01810688090
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Live Chat</h4>
              <p className="text-gray-600">
                Available Monday-Friday, 9AM-6PM
              </p>
             <a 
        href="https://m.me/tuffersbd" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 text-sm"
      >
        Chat on Messenger
      </a>
            </div>
          </div>
        </div>
      </Containar>
    </section>
  );
};

export default ParagraphtoList;