import { useEffect, useRef } from "react";

const FacebookPixel = ({ pixelId, userData }) => {
  const isInitialized = useRef(false); // prevent duplicate init

  useEffect(() => {
    if (!window.fbq) {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = "https://connect.facebook.net/en_US/fbevents.js";
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, "script");
    }
  }, []);

  useEffect(() => {
    if (
      pixelId &&
      userData?.email &&
      !isInitialized.current &&
      typeof window.fbq === "function"
    ) {
      const advancedMatching = {
        em: userData.email,
        ph: userData.phone,
        fn: userData.firstName,
        ln: userData.lastName,
        ge: userData.gender,
        db: userData.dateOfBirth,
        ct: userData.city,
        st: userData.state,
        zp: userData.zip,
        country: userData.country || "BD",
        external_id: userData.externalId,
      };

      console.log("✅ Initializing Pixel with:", advancedMatching);

      window.fbq("init", pixelId, advancedMatching);
      window.fbq("track", "PageView");
      isInitialized.current = true;
    }
  }, [pixelId, userData]);

  return null;
};

export default FacebookPixel;
