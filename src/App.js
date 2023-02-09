import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/login";
import ForgetPassword from "./pages/ForgetPassword";

import { GoogleOAuthProvider } from "@react-oauth/google";

import ProductTypes from "./pages/productTypes";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails";
import ProductCategories from "./pages/ProductCategories";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Whishlist";
import Dashboard from "./pages/dashboard";
import AddProduct from "./pages/AddProduct";
import AddGift from "./pages/AddGift";
import GiftDetails from "./pages/GiftDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgetPassword",
    element: <ForgetPassword />,
  },
  {
    path: "/:type",
    element: <ProductTypes />,
  },
  {
    path: "/:type/:category",
    element: <ProductCategories />,
  },
  {
    path: "/product/details/:id",
    element: <ProductDetails />,
  },
  {
    path: "/gift/details/:id",
    element: <GiftDetails />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/wishlist",
    element: <Wishlist />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/dashboard/addProduct",
    element: <AddProduct />,
  },
  {
    path: "/dashboard/addGift",
    element: <AddGift />,
  },
]);

function App() {
  return (
    <div className="App">
      <GoogleOAuthProvider clientId="39796629098-4gbk8vjjlu6uj3d75rgvcbc5031cf5m0.apps.googleusercontent.com">
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
      ;
    </div>
  );
}

export default App;
