import React, { useEffect } from "react";
import BradCumbs from "../components/bradcumbs/BradCumbs";

// Define a Privacy Policy component
const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <BradCumbs title="Privacy Policiy" />
      <div className="container pb-28 flex justify-center font-inter">
        <div className="w-[1200px]">
          <p style={styles.paragraph}>
            Welcome to our Privacy Policy page! When you use our services, you
            trust us with your information. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you
            visit our website.
          </p>
          <h2 style={styles.subHeader}>Information We Collect</h2>
          <p style={styles.paragraph}>
            We may collect information about you in a variety of ways. The
            information we may collect includes:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              Personal Data: Personally identifiable information, such as your
              name, email address, and contact information that you voluntarily
              give to us when you register with the site or when you choose to
              participate in various activities related to the site.
            </li>
            <li style={styles.listItem}>
              Derivative Data: Information our servers automatically collect
              when you access the site, such as your IP address, your browser
              type, your operating system, your access times, and the pages you
              have previously viewed on the site.
            </li>
            <li style={styles.listItem}>
              Financial Data: Financial information, such as data related to
              your payment method (e.g., valid credit card number, card brand,
              expiration date) that we may collect when you purchase, order,
              return, exchange, or request information about our services from
              the site.
            </li>
          </ul>
          <h2 style={styles.subHeader}>How We Use Your Information</h2>
          <p style={styles.paragraph}>
            We may use information collected about you via the site to:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              Assist you in completing your purchase.
            </li>
            <li style={styles.listItem}>
              Monitor and analyze usage and trends to improve your experience
              with the site.
            </li>
            <li style={styles.listItem}>
              Notify you of updates to the site and our services.
            </li>
          </ul>
          <h2 style={styles.subHeader}>Disclosure of Your Information</h2>
          <p style={styles.paragraph}>
            We may share information we have collected about you in certain
            situations. Your information may be disclosed as follows:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              By Law or to Protect Rights: If we believe the release of
              information about you is necessary to respond to legal process, to
              investigate or remedy potential violations of our policies, or to
              protect the rights, property, and safety of others, we may share
              your information as permitted or required by any applicable law,
              rule, or regulation.
            </li>
            <li style={styles.listItem}>
              Business Transfers: We may share or transfer your information in
              connection with, or during negotiations of, any merger, sale of
              company assets, financing, or acquisition of all or a portion of
              our business to another company.
            </li>
          </ul>
          <h2 style={styles.subHeader}>Contact Us</h2>
          <p style={styles.paragraph}>
            If you have questions or comments about this Privacy Policy, please
            contact us at:
          </p>
          <p style={styles.paragraph}>
            <strong>Email:</strong> contact@tuffersbd.com
          </p>
          <p style={styles.paragraph}>
            <strong>Address:</strong> 
            Yunusco City Center shop no.316, 3rd Floor, Gec Mor, Chattogram, Chittagong, Bangladesh
          </p>
        </div>
      </div>
    </>
  );
};

// Define styles for the Privacy Policy page
const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    fontSize: "2rem",
    marginBottom: "10px",
  },
  subHeader: {
    fontSize: "1.5rem",
    marginTop: "20px",
    marginBottom: "10px",
  },
  paragraph: {
    marginBottom: "10px",
    lineHeight: "1.6",
  },
  list: {
    marginBottom: "10px",
    paddingLeft: "20px",
  },
  listItem: {
    marginBottom: "5px",
  },
};

export default PrivacyPolicy;
