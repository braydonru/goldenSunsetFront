import React from 'react';
import { Route, Routes } from "react-router-dom";


import GoldenSunsetApp from "./components/GoldenSunsetApp";
import Orders from "./components/Orders";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import CreateProduct from "./components/Manage/CreateProduct";
import CreateCategory from "./components/Manage/CreateCategory";
import Manage from "./components/Manage/Manage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import ShowOrder from "./components/Orders/ShowOrder";
import ForCups from "./components/Designs/ForCups";
import ForPullover from "./components/Designs/ForPullover";
import ForThermos from "./components/Designs/ForThermos";
import AboutUs from "./components/Home/AboutUs";
import ForPlates from "./components/Designs/ForPlates";
import ListProducts from "./components/Manage/ListProducts";
import ListOrders from "./components/Manage/ListOrders";
import ListCategories from "./components/Manage/ListCategories";
import ListColors from "./components/Manage/ListColors";
import ListVariants from "./components/Manage/ListVariants";
import AllReviews from "./components/Home/AllReviews";
import Reviews from "./components/Home/Reviews";
import Designs from "./components/Home/Designs";
import ListDesigns from "./components/Manage/ListDesign";
import ListUsers from "./components/Manage/ListUsers";
import ForCaps from "./components/Designs/ForCaps";
import OrdersUser from "./components/Home/OrdersUser";


const App = () => {
    return (
        <Routes>

            {/* 🌍 PUBLICAS */}
            <Route path="/" element={<GoldenSunsetApp />} />
            <Route path="/us" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/allreviews" element={<AllReviews/>} />
            <Route path="alldesigns" element={<Designs/>}/>
            {/* 🔐 PRIVADAS (cualquier usuario logueado) */}

            <Route path="/orders_ready"
                   element={
                       <ProtectedRoute>
                           <OrdersUser/>
                       </ProtectedRoute>
                   }/>
            <Route path="/designer/shirt/:id" element={
                <ProtectedRoute>
                <ForPullover/>
                </ProtectedRoute>
                } />
            <Route path="/designer/plates/:id" element={
                <ProtectedRoute>
                    <ForPlates/>
                </ProtectedRoute>
            }/>
            <Route path="/designer/caps/:id" element={
                <ProtectedRoute>
                    <ForCaps/>
                </ProtectedRoute>
            } />
            <Route path="/designer/mug/:id" element={
                <ProtectedRoute>
                    <ForCups/>
                </ProtectedRoute>
            } />
            <Route path="/designer/thermo/:id" element={
                <ProtectedRoute>
                    <ForThermos />
                </ProtectedRoute>
            } />
            <Route
                path="/showorder/:orderId"
                element={
                    <ProtectedRoute>
                        <ShowOrder />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                }
            />

            {/* 👑 SOLO SUPERUSER */}
            <Route
                path="/createProduct"
                element={
                    <AdminRoute>
                        <CreateProduct />
                    </AdminRoute>
                }
            />

            <Route
                path="/createCategory"
                element={
                    <AdminRoute>
                        <CreateCategory />
                    </AdminRoute>
                }
            />

            <Route
                path="/Manage"
                element={
                    <AdminRoute>
                        <Manage />
                    </AdminRoute>
                }
            />
            <Route
                path="/Manage/listorders"
                element={
                    <AdminRoute>
                        <ListOrders />
                    </AdminRoute>
                }
            />
            <Route
                path="/Manage/listcategories"
                element={
                    <AdminRoute>
                        <ListCategories />
                    </AdminRoute>
                }
            />
            <Route
                path="/Manage/listproducts"
                element={
                    <AdminRoute>
                        <ListProducts />
                    </AdminRoute>
                }
            />
            <Route
                path="/Manage/listcolors"
                element={
                    <AdminRoute>
                        <ListColors />
                    </AdminRoute>
                }
            />
            <Route
                path="/Manage/listvariants"
                element={
                    <AdminRoute>
                        <ListVariants />
                    </AdminRoute>
                }
            />
            <Route
                path="/Manage/listdesigns"
                element={
                    <AdminRoute>
                        <ListDesigns />
                    </AdminRoute>
                }
            />
            <Route
                path="/Manage/listusers"
                element={
                    <AdminRoute>
                        <ListUsers/>
                    </AdminRoute>
                }
            />

        </Routes>
    );
};

export default App;
