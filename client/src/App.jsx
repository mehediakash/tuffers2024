import React, { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import ApiContext from "./components/baseapi/BaseApi";
import RootLayout from "./layouts/RootLayout";
import CategoryShop from "./components/shop/CategoryShop";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Header = lazy(() => import("./components/shared/header/Header"));
const Footer = lazy(() => import("./components/shared/footer/Footer"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Shop = lazy(() => import("./pages/Shop"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const TermsCondition = lazy(() => import("./pages/TermsCondition"));
const Faq = lazy(() => import("./pages/Faq"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const ShopLayouts = lazy(() => import("./layouts/ShopLayouts"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const BrandShop = lazy(() => import("./components/shop/BrandShop"));
const Subcategory = lazy(() => import("./components/shop/Subcategory"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ShippingRates = lazy(() => import("./pages/ShippingRates"));
const DeliveryInfo = lazy(() => import("./pages/DeliveryInfo"));
const RefundsAndReplacements = lazy(() =>
  import("./pages/RefundsAndReplacements")
);
const MegaSale = lazy(() => import("./components/shop/MegaSale"));
const LatestSale = lazy(() => import("./components/shop/LatestSale"));
const OfferSale = lazy(() => import("./components/shop/OfferSale"));

// const baseApi = "http://localhost:8000/api/v1";
const baseApi = "https://server.tuffersbd.com/api/v1";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route
        index
        element={
          <Suspense fallback={<div></div>}>
            <Home />
          </Suspense>
        }
      />

      
      <Route
        path="shop"
        element={
          <Suspense fallback={<div></div>}>
            <ShopLayouts />
          </Suspense>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<div></div>}>
              <Shop />
            </Suspense>
          }
        />
        <Route
          path="mega-sale"
          element={
            <Suspense fallback={<div></div>}>
              <MegaSale />
            </Suspense>
          }
        />
        <Route
          path="latest-sale"
          element={
            <Suspense fallback={<div></div>}>
              <LatestSale />
            </Suspense>
          }
        />
        <Route
          path="offer-sale"
          element={
            <Suspense fallback={<div></div>}>
              <OfferSale />
            </Suspense>
          }
        />
        <Route
          path="category/:categoryId"
          element={
            <Suspense fallback={<div></div>}>
              <CategoryShop />
            </Suspense>
          }
        />
        <Route
          path="subcategory/:subcategoryId"
          element={
            <Suspense fallback={<div></div>}>
              <Subcategory />
            </Suspense>
          }
        />
        <Route
          path="brand/:brandId"
          element={
            <Suspense fallback={<div></div>}>
              <BrandShop />
            </Suspense>
          }
        />
      </Route>





      <Route
        path="about"
        element={
          <Suspense fallback={<div></div>}>
            <About />
          </Suspense>
        }
      />
      <Route
        path="contact"
        element={
          <Suspense fallback={<div></div>}>
            <Contact />
          </Suspense>
        }
      />
      <Route
        path="terms-condition"
        element={
          <Suspense fallback={<div></div>}>
            <TermsCondition />
          </Suspense>
        }
      />
      {/* <Route
        path="faq"
        element={
          <Suspense fallback={<div></div>}>
            <Faq />
          </Suspense>
        }
      /> */}
      <Route
        path="cart"
        element={
          <Suspense fallback={<div></div>}>
            <Cart />
          </Suspense>
        }
      />
      <Route
        path="productdetail/:slug/:id"
        element={
          <Suspense fallback={<div></div>}>
            <ProductDetail />
          </Suspense>
        }
      />
      <Route
        path="checkout"
        element={
          <Suspense fallback={<div></div>}>
            <Checkout />
          </Suspense>
        }
      />
      <Route
        path="thankyou"
        element={
          <Suspense fallback={<div></div>}>
            <ThankYou />
          </Suspense>
        }
      />
      <Route
        path="privacy"
        element={
          <Suspense fallback={<div></div>}>
            <PrivacyPolicy />
          </Suspense>
        }
      />
      <Route
        path="shipingrates-policy"
        element={
          <Suspense fallback={<div></div>}>
            <ShippingRates />
          </Suspense>
        }
      />
      <Route
        path="delivery-info"
        element={
          <Suspense fallback={<div></div>}>
            <DeliveryInfo />
          </Suspense>
        }
      />
      <Route
        path="refund-replace"
        element={
          <Suspense fallback={<div></div>}>
            <RefundsAndReplacements />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <Suspense fallback={<div></div>}>
            <NotFound />
          </Suspense>
        }
      />
    </Route>
  )
);

function App() {
  return (
    <ApiContext.Provider value={baseApi}>
      <RouterProvider router={router} />
    </ApiContext.Provider>
  );
}

export default App;
