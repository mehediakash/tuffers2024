import React, { useEffect } from "react";
import BradCumbs from "../components/bradcumbs/BradCumbs";
import Containar from "../layouts/Containar";

const TermsCondition = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <BradCumbs title="Terms & Condition" />
      <div className="font-inter mb-20">
        <Containar>
          <div className="max-w-5xl mx-auto p-6">
            <p className="mb-4">
              Welcome to tuffers ! Before you start shopping, please take a
              moment to read our Terms & Conditions. These terms are here to
              ensure a smooth and enjoyable experience for everyone. By using
              our website and making a purchase, you agree to the following
              terms:
            </p>

            <h2 className="text-xl font-semibold mb-2">
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing or using the tuffers website, you agree to comply
              with and be bound by these Terms & Conditions. If you do not agree
              with any part of these terms, please do not use our site.
            </p>

            <h2 className="text-xl font-semibold mb-2">
              2. Products and Services
            </h2>
            <p className="mb-4">
              We strive to provide accurate descriptions and images of our
              products. However, we cannot guarantee that every product
              description or image is completely accurate. We may update or
              change product information at any time without notice.
            </p>

            <h2 className="text-xl font-semibold mb-2">
              3. Orders and Payments
            </h2>
            <p className="mb-4">
              When you place an order, you are making an offer to buy the
              products listed in your cart. We reserve the right to accept or
              reject your order for any reason. If we accept your order, we will
              confirm it by sending you an email. Payment must be made in full
              before we process and ship your order. We accept various forms of
              payment, including credit cards and other payment methods listed
              on our website.
            </p>

            <h2 className="text-xl font-semibold mb-2">
              4. Shipping and Delivery
            </h2>
            <p className="mb-4">
              We aim to process and ship your order as quickly as possible.
              Shipping times and costs vary depending on your location and the
              shipping method you choose. For more information, please refer to
              our Shipping Rates & Policies page. Once your order is shipped,
              you will receive a tracking number to monitor its progress.
            </p>

            <h2 className="text-xl font-semibold mb-2">
              5. Returns and Refunds
            </h2>
            <p className="mb-4">
              If you’re not satisfied with your purchase, you can return it for
              a refund according to our Returns & Replacements policy. Items
              must be returned in their original condition and packaging within
              the specified return period. Please review our Returns &
              Replacements page for detailed information on how to return items
              and request refunds.
            </p>

            <h2 className="text-xl font-semibold mb-2">
              6. Account Responsibility
            </h2>
            <p className="mb-4">
              If you create an account with us, you are responsible for
              maintaining the confidentiality of your account information and
              for all activities that occur under your account. Notify us
              immediately if you suspect any unauthorized use of your account.
              We are not liable for any loss or damage arising from your failure
              to protect your account information.
            </p>

            <h2 className="text-xl font-semibold mb-2">
              7. Intellectual Property
            </h2>
            <p className="mb-4">
              All content on the tuffers website, including text, graphics,
              logos, and images, is owned by or licensed to us and is protected
              by copyright and other intellectual property laws. You may not
              use, reproduce, or distribute any content from our site without
              our express written permission.
            </p>

            <h2 className="text-xl font-semibold mb-2">
              8. Limitation of Liability
            </h2>
            <p className="mb-4">
              tuffers is not liable for any indirect, incidental, or
              consequential damages arising from your use of our website or
              products. Our liability is limited to the maximum extent permitted
              by law. We are not responsible for any damages resulting from
              errors or omissions in our content or for any interruptions in our
              service.
            </p>

            <h2 className="text-xl font-semibold mb-2">9. Changes to Terms</h2>
            <p className="mb-4">
              We may update these Terms & Conditions from time to time. When we
              do, we will post the revised terms on our website and update the
              effective date. Your continued use of our website after any
              changes constitutes your acceptance of the new terms.
            </p>

            <h2 className="text-xl font-semibold mb-2">10. Governing Law</h2>
            <p className="mb-4">
              These Terms & Conditions are governed by and construed in
              accordance with the laws of Bangladesh. Any disputes arising from
              these terms or your use of our website will be resolved in the
              courts of Bangladesh.
            </p>

            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p className="mb-4">
              If you have any questions or concerns about these Terms &
              Conditions, please contact us at{" "}
              <a href="mailto:contact@tuffersbd.com" className="text-blue-500">
              contact@tuffersbd.com
              </a>
              . We are here to help and ensure you have a great experience with
              tuffers .
            </p>

            <p className="text-center font-semibold mt-6">
              Thank you for shopping with us! We appreciate your business and
              look forward to serving you.
            </p>
          </div>
        </Containar>
      </div>
    </>
  );
};

export default TermsCondition;
