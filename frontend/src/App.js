// src/App.js
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./feature/auth/authAPI.js";
import { Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.js";
import PrivateRoute from "./routes/PrivateRoute.jsx";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/home/Home.jsx";
import Menu from "./pages/menu/Menu.jsx";

import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import AccountRecovery from "./pages/auth/AccountRecovery.jsx";
import NaverCallback from "./pages/auth/NaverCallback.jsx";
import KakaoCallback from "./pages/auth/KakaoCallback.jsx";
import OrderSuccess from "./pages/order/OrderSuccess.jsx";

// 관리자
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";

// 상품
import ProductDetail from "./pages/ProductDetail.jsx";
import ProductList from "./pages/ProductList.jsx";
import Search from "./pages/Search.jsx";

// ✅ 결제 라우트
import PaySelect from "./pages/order/PaySelect.jsx";
import PayConfirm from "./pages/order/PayConfirm.jsx";

// 주문/장바구니
import Checkout from "./pages/order/Checkout.jsx";
import MyOrders from "./pages/order/MyOrders.jsx";
import CartPage from "./pages/cart/CartPage.jsx";

// 카테고리
import CategoryPage from "./pages/CategoryPage.jsx";

// 골프
import GolfMain from "./pages/golf/GolfMain.jsx";
import GolfNew from "./pages/golf/GolfNew.jsx";
import GolfWomen from "./pages/golf/GolfWomen.jsx";
import GolfMen from "./pages/golf/GolfMen.jsx";

// 럭셔리
import LuxuryMain from "./pages/luxury/LuxuryMain.jsx";
import LuxuryNew from "./pages/luxury/LuxuryNew.jsx";
import LuxuryWomen from "./pages/luxury/LuxuryWomen.jsx";
import LuxuryMen from "./pages/luxury/LuxuryMen.jsx";

// 신발
import ShoesMain from "./pages/shoes/ShoesMain.jsx";
import ShoesNew from "./pages/shoes/ShoesNew.jsx";
import ShoesWomen from "./pages/shoes/ShoesWomen.jsx";
import ShoesMen from "./pages/shoes/ShoesMen.jsx";

// 라이프
import LifeMain from "./pages/life/LifeMain.jsx";
import LifeNew from "./pages/life/LifeNew.jsx";
import LifeFurniture from "./pages/life/LifeFurniture.jsx";
import LifePet from "./pages/life/LifePet.jsx";
import LifeCar from "./pages/life/LifeCar.jsx";

// 아울렛
import OutletMain from "./pages/outlet/OutletMain.jsx";
import OutletWomen from "./pages/outlet/OutletWomen.jsx";
import OutletMen from "./pages/outlet/OutletMen.jsx";
import OutletKids from "./pages/outlet/OutletKids.jsx";
import OutletLuxury from "./pages/outlet/OutletLuxury.jsx";
import OutletShoes from "./pages/outlet/OutletShoes.jsx";
import OutletSports from "./pages/outlet/OutletSports.jsx";
import OutletGolf from "./pages/outlet/OutletGolf.jsx";
import OutletLife from "./pages/outlet/OutletLife.jsx";

// 마이페이지
import MyPage from "./pages/mypage/MyPage.jsx";
import MyCoupons from "./pages/mypage/MyCoupons.jsx";

// 브랜드 
import Brand8SecondsDetail from "./components/brands/Brand8SecondsDetail.jsx";
import BrandBeanpoleDetail from "./components/brands/BrandBeanpoleDetail.jsx";
import BrandBeakerDetail from "./components/brands/BrandBeakerDetail.jsx";
import BrandKuhoDetail from "./components/brands/BrandKuhoDetail.jsx";
import BrandIsseyMiyakeDetail from "./components/brands/BrandIsseyMiyakeDetail.jsx";
import BrandMaisonKitsuneDetail from "./components/brands/BrandMaisonKitsuneDetail.jsx";
import BrandTheoryDetail from "./components/brands/BrandTheoryDetail.jsx";
import BrandKuhoPlusDetail from "./components/brands/BrandKuhoPlusDetail.jsx";
import BrandCommeDetail from "./components/brands/BrandCommeDetail.jsx";
import BrandPatagoniaDetail from "./components/brands/BrandPatagoniaDetail.jsx";
import BrandSportyRichDetail from "./components/brands/BrandSportyRichDetail.jsx";
import BrandSIEDetail from "./components/brands/BrandSIEDetail.jsx";
import BrandInewGolfDetail from "./components/brands/BrandInewGolfDetail.jsx";
import BrandGeneralIdeaDetail from "./components/brands/BrandGeneralIdeaDetail.jsx";
import BrandLeMoutonDetail from "./components/brands/BrandLeMoutonDetail.jsx";
import BrandAmiDetail from "./components/brands/BrandAmiDetail.jsx";
import BrandJuunJDetail from "./components/brands/BrandJuunJDetail.jsx";
import BrandRogadisDetail from "./components/brands/BrandRogadisDetail.jsx";
import BrandDantonDetail from "./components/brands/BrandDantonDetail.jsx";
import Brand10CorsoComoDetail from "./components/brands/Brand10CorsoComoDetail.jsx";
import BrandApertureDetail from "./components/brands/BrandApertureDetail.jsx";
import BrandCOSDetail from "./components/brands/BrandCOSDetail.jsx";
import BrandSaintJamesDetail from "./components/brands/BrandSaintJamesDetail.jsx";
import BrandTommyHilfigerDetail from "./components/brands/BrandTommyHilfigerDetail.jsx";
import BrandCanadaGooseDetail from "./components/brands/BrandCanadaGooseDetail.jsx";
import BrandHeraDetail from "./components/brands/BrandHeraDetail.jsx";
import BrandGalaxyLifestyleDetail from "./components/brands/BrandGalaxyLifestyleDetail.jsx";
import BrandRebaigeDetail from "./components/brands/BrandRebaigeDetail.jsx";
import BrandToryBurchDetail from "./components/brands/BrandToryBurchDetail.jsx";
import BrandGalaxyDetail from "./components/brands/BrandGalaxyDetail.jsx";
import Lemaire from "./components/brands/BrandLemaireDetail.jsx";
import BrandFitflop from "./components/brands/BrandFitflop.jsx";
import BrandGanni from "./components/brands/BrandGanni.jsx";
import BrandRagBone from "./components/brands/BrandRagBone.jsx";
import BrandSandSound from "./components/brands/BrandSandSound.jsx";
import BrandsAll from "./components/brands/BrandsAll.jsx";

// 고객센터/회사/정책
import HelpPage from "./pages/help/HelpPage.jsx";
import CompanyPage from "./pages/company/CompanyPage.jsx";
import Terms from "./pages/policy/Terms.jsx";
import Privacy from "./pages/policy/Privacy.jsx";
import Membership from "./pages/membership/Membership.jsx";
import StoreFinder from "./pages/store/StoreFinder.jsx";
import NoticeEvents from "./pages/board/NoticeEvents.jsx";
import BulkOrder from "./pages/help/BulkOrder.jsx";

// 위시리스트
import Wishlist from "./pages/wish/Wishlist.jsx";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  return (
    <AuthProvider>
      <Header />

      <Routes>
        {/* 홈/메뉴 */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />

        {/* 로그인/회원가입 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account/recovery" element={<AccountRecovery />} />
        <Route path="/naver-callback" element={<NaverCallback />} />
        <Route path="/kakao-callback" element={<KakaoCallback />} />

        {/* 마이페이지 */}
        <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
        <Route path="/mypage/coupons" element={<PrivateRoute><MyCoupons /></PrivateRoute>} />

        {/* 주문/장바구니/결제 */}
        <Route path="/orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/order/success" element={<OrderSuccess />} />
        <Route path="/mypage/orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
        <Route path="/pay/confirm" element={<PrivateRoute><PayConfirm /></PrivateRoute>} />
        <Route path="/pay" element={<PrivateRoute><PaySelect /></PrivateRoute>} />

        {/* 고객센터/회사/정책 */}
        <Route path="/help" element={<HelpPage />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/stores" element={<StoreFinder />} />
        <Route path="/notice" element={<NoticeEvents />} />
        <Route path="/bulk-order" element={<BulkOrder />} />

        {/* 위시리스트 */}
        <Route path="/wishlist" element={<Wishlist />} />

        {/* 검색/리스트 */}
        <Route path="/search/:keyword" element={<Search />} />
        <Route path="/list" element={<ProductList />} />

        {/* 상품 */}
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/product" element={<ProductDetail />} />

        {/* 카테고리 */}
        <Route path="/women/:subcategory?" element={<CategoryPage />} />
        <Route path="/men/:subcategory?" element={<CategoryPage />} />
        <Route path="/kids/:subcategory?" element={<CategoryPage />} />
        <Route path="/sports/:subcategory?" element={<CategoryPage />} />
        <Route path="/beauty/:subcategory?" element={<CategoryPage />} />

        {/* 골프 */}
        <Route path="/golf" element={<GolfMain />} />
        <Route path="/golf/new" element={<GolfNew />} />
        <Route path="/golf/women" element={<GolfWomen />} />
        <Route path="/golf/men" element={<GolfMen />} />

        {/* 신발 */}
        <Route path="/shoes" element={<ShoesMain />} />
        <Route path="/shoes/new" element={<ShoesNew />} />
        <Route path="/shoes/women" element={<ShoesWomen />} />
        <Route path="/shoes/men" element={<ShoesMen />} />

        {/* 라이프 */}
        <Route path="/life" element={<LifeMain />} />
        <Route path="/life/new" element={<LifeNew />} />
        <Route path="/life/furniture" element={<LifeFurniture />} />
        <Route path="/life/pet" element={<LifePet />} />
        <Route path="/life/car" element={<LifeCar />} />

        {/* 럭셔리 */}
        <Route path="/luxury" element={<LuxuryMain />} />
        <Route path="/luxury/new" element={<LuxuryNew />} />
        <Route path="/luxury/women" element={<LuxuryWomen />} />
        <Route path="/luxury/men" element={<LuxuryMen />} />

        {/* 아울렛 */}
        <Route path="/outlet" element={<OutletMain />} />
        <Route path="/outlet/women" element={<OutletWomen />} />
        <Route path="/outlet/men" element={<OutletMen />} />
        <Route path="/outlet/kids" element={<OutletKids />} />
        <Route path="/outlet/luxury" element={<OutletLuxury />} />
        <Route path="/outlet/shoes" element={<OutletShoes />} />
        <Route path="/outlet/sports" element={<OutletSports />} />
        <Route path="/outlet/golf" element={<OutletGolf />} />
        <Route path="/outlet/life" element={<OutletLife />} />

        {/* 브랜드 */}
        <Route path="/brand/8seconds" element={<Brand8SecondsDetail />} />
        <Route path="/brand/beanpole" element={<BrandBeanpoleDetail />} />
        <Route path="/brand/beaker" element={<BrandBeakerDetail />} />
        <Route path="/brand/kuho" element={<BrandKuhoDetail />} />
        <Route path="/brand/issey-miyake" element={<BrandIsseyMiyakeDetail />} />
        <Route path="/brand/maison-kitsune" element={<BrandMaisonKitsuneDetail />} />
        <Route path="/brand/theory" element={<BrandTheoryDetail />} />
        <Route path="/brand/kuho-plus" element={<BrandKuhoPlusDetail />} />
        <Route path="/brand/comme-des-garcons" element={<BrandCommeDetail />} />
        <Route path="/brand/patagonia" element={<BrandPatagoniaDetail />} />
        <Route path="/brand/sporty-rich" element={<BrandSportyRichDetail />} />
        <Route path="/brand/sie" element={<BrandSIEDetail />} />
        <Route path="/brand/inu-golf" element={<BrandInewGolfDetail />} />
        <Route path="/brand/general-idea" element={<BrandGeneralIdeaDetail />} />
        <Route path="/brand/le-mouton" element={<BrandLeMoutonDetail />} />
        <Route path="/brand/ami" element={<BrandAmiDetail />} />
        <Route path="/brand/juun-j" element={<BrandJuunJDetail />} />
        <Route path="/brand/rogadis" element={<BrandRogadisDetail />} />
        <Route path="/brand/danton" element={<BrandDantonDetail />} />
        <Route path="/brand/10-corso-como" element={<Brand10CorsoComoDetail />} />
        <Route path="/brand/diapter" element={<BrandApertureDetail />} />
        <Route path="/brand/cos" element={<BrandCOSDetail />} />
        <Route path="/brand/saint-james" element={<BrandSaintJamesDetail />} />
        <Route path="/brand/tommy-hilfiger" element={<BrandTommyHilfigerDetail />} />
        <Route path="/brand/canada-goose" element={<BrandCanadaGooseDetail />} />
        <Route path="/brand/hera" element={<BrandHeraDetail />} />
        <Route path="/brand/galaxy-lifestyle" element={<BrandGalaxyLifestyleDetail />} />
        <Route path="/brand/rebaige" element={<BrandRebaigeDetail />} />
        <Route path="/brand/tory-burch" element={<BrandToryBurchDetail />} />
        <Route path="/brand/galaxy" element={<BrandGalaxyDetail />} />
        <Route path="/brand/lemaire" element={<Lemaire />} />
        <Route path="/brand/fitflop" element={<BrandFitflop />} />
        <Route path="/brand/ganni" element={<BrandGanni />} />
        <Route path="/brand/rag-bone" element={<BrandRagBone />} />
        <Route path="/brand/sandsound" element={<BrandSandSound />} />
        <Route path="/brands" element={<BrandsAll />} />

        {/* 관리자 */}
        <Route path="/admin/orders" element={<PrivateRoute><AdminOrders /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
      </Routes>

     

      <Footer />
    </AuthProvider>
  );
}

export default App;
