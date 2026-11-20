import React, { Suspense, lazy } from 'react';
import Home from './components/home/Home';
import Login from './components/home/Login';
import Terms from './components/pages/Terms';
import Privacy from './components/pages/Privacy';
import ScannerPage from './components/pages/ScannerPage';
import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import Layout from './components/Layout';
import { Box, CircularProgress } from '@mui/material';

const Admin = lazy(() => import('./components/pages/Admin'));
const Manufacturer = lazy(() => import('./components/pages/Manufacturer'));
const Supplier = lazy(() => import('./components/pages/Supplier'));
const Retailer = lazy(() => import('./components/pages/Retailer'));
const AddAccount = lazy(() => import('./components/pages/AddAccount'));
const ManageAccount = lazy(() => import('./components/pages/ManageAccount'));
const AddProduct = lazy(() => import('./components/pages/AddProduct'));
const Profile = lazy(() => import('./components/pages/Profile'));
const UpdateProduct = lazy(() => import('./components/pages/UpdateProduct'));
const Product = lazy(() => import('./components/pages/Product'));
const AuthenticProduct = lazy(() => import('./components/pages/AuthenticProduct'));
const FakeProduct = lazy(() => import('./components/pages/FakeProduct'));
const UpdateProductDetails = lazy(() => import('./components/pages/UpdateProductDetails'));
const ProductsPage = lazy(() => import('./components/pages/ProductsPage'));

const RouteLoader = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
    <CircularProgress size={20} sx={{ color: '#6D4AFF' }} />
  </Box>
);
function App() {

  return (
    <Suspense fallback={<RouteLoader />}>
    <Routes>
      <Route path='/' element={<Layout />}>

        {/* public routes */}
        <Route exact path='/' element={< Home />}></Route>
        <Route exact path='/login' element={< Login />}></Route>
        <Route exact path='/terms' element={< Terms />}></Route>
        <Route exact path='/privacy' element={< Privacy />}></Route>
        <Route exact path='/scanner' element={< ScannerPage />}></Route>
        <Route exact path='/product' element={< Product />}></Route>
        <Route exact path='/authentic-product' element={< AuthenticProduct />}></Route>
        <Route exact path='/fake-product' element={< FakeProduct />}></Route>

        
        {/* private routes */}
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route exact path='/admin' element={< Admin />}></Route>
          <Route exact path='/add-account' element={< AddAccount />}></Route>
          <Route exact path='/manage-account' element={< ManageAccount />}></Route> 
        </Route>

        <Route element={<RequireAuth allowedRoles={["manufacturer", "supplier", "retailer"]} />}>
          <Route exact path='/profile' element={< Profile />}></Route>
          <Route exact path='/products' element={< ProductsPage />}></Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={["supplier", "retailer"]} />}>
          <Route exact path='/update-product' element={< UpdateProduct />}></Route>
          <Route exact path='/update-product-details' element={< UpdateProductDetails />}></Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={["manufacturer"]} />}>
          <Route exact path='/manufacturer' element={< Manufacturer />}></Route>
          <Route exact path='/add-product' element={< AddProduct />}></Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={["supplier"]} />}>
          <Route exact path='/supplier' element={< Supplier />}></Route>        
        </Route>

        <Route element={<RequireAuth allowedRoles={["retailer"]} />}>
          <Route exact path='/retailer' element={< Retailer />}></Route>
        </Route>

        {/* catch all -> redirect to login */}
        <Route path='*' element={<Navigate to="/login" replace />} />

      </Route>
    </Routes>
    </Suspense>

  );
}

export default App;
