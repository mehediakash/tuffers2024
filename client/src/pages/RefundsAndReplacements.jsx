import React, { useEffect } from "react";
import BradCumbs from "../components/bradcumbs/BradCumbs";
import Containar from "../layouts/Containar";

const RefundsAndReplacements = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-100">
      <BradCumbs title={"Refunds & Replacements"} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Refunds & Replacements</h1>
        <p className="mb-4">
          Welcome to tuffers ! We want you to be happy with your purchase, but
          we understand that sometimes things don’t work out as planned. Here’s
          everything you need to know about our refund and replacement policy:
        </p>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Refunds</h2>
          <p className="mb-4">
            If you’re not completely satisfied with your purchase, you can
            return it for a refund. Here’s how it works:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>
              <strong>Eligibility:</strong> To be eligible for a refund, your
              item must be unused, in its original packaging, and in the same
              condition you received it. You’ll need to return it within 30 days
              of the delivery date.
            </li>
            <li>
              <strong>How to Return:</strong> Contact our customer service team
              to get a return authorization. They’ll provide you with
              instructions on how to send the item back. Please make sure to
              include a copy of your receipt or order number in the return
              package.
            </li>
            <li>
              <strong>Refund Process:</strong> Once we receive your returned
              item, we’ll inspect it and process your refund. Refunds are
              usually issued to the original payment method within 5-7 business
              days. If you used a gift card, the refund will be applied to the
              card.
            </li>
          </ul>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Replacements</h2>
          <p className="mb-4">
            If you received a damaged or defective item, or if you’ve simply
            changed your mind, we offer replacements. Here’s what you need to
            know:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>
              <strong>Damaged or Defective Items:</strong> If your item arrives
              damaged or has a defect, please contact us right away. We’ll ask
              for a photo of the damage or defect to help us resolve the issue.
              We’ll then send you a replacement at no extra charge.
            </li>
            <li>
              <strong>Changed Your Mind:</strong> If you want to replace an item
              because you’ve changed your mind, you can still do so. Just return
              the original item in accordance with our return policy, and we’ll
              send you the replacement once we receive the returned item.
            </li>
          </ul>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Exceptions</h2>
          <ul className="list-disc list-inside mb-4">
            <li>
              <strong>Personalized Items:</strong> Items that are customized or
              personalized are not eligible for a refund or replacement unless
              they arrive damaged or defective.
            </li>
            <li>
              <strong>Sale Items:</strong> Sale items are generally
              non-refundable. However, if there’s an issue with the item, please
              let us know.
            </li>
          </ul>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions or need help with a return or replacement,
            please reach out to our customer service team. We’re here to assist
            you and ensure you have a great experience with tuffers .
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundsAndReplacements;
