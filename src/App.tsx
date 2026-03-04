import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Team from './pages/Team';
import Booking from './pages/Booking';
import MemberCenter from './pages/MemberCenter';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import BookingDetail from './pages/BookingDetail';
import Coupons from './pages/Coupons';
import Contact from './pages/Contact';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { CouponProvider } from './context/CouponContext';
import { BookingProvider } from './context/BookingContext';
import { UserProvider } from './context/UserContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import BackToTopButton from './components/BackToTopButton';
import { useEffect } from 'react';

// ScrollToTop component to handle scroll restoration
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <CouponProvider>
          <BookingProvider>
            <UserProvider>
              <SiteSettingsProvider>
                <Router>
                  <ScrollToTop />
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/team" element={<Team />} />
                      <Route path="/booking" element={<Booking />} />
                      <Route path="/booking/:id" element={<BookingDetail />} />
                      <Route path="/member" element={<MemberCenter />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/update-password" element={<UpdatePassword />} />
                      <Route path="/news" element={<News />} />
                      <Route path="/news/:id" element={<NewsDetail />} />
                      <Route path="/coupons" element={<Coupons />} />
                      <Route path="/contact" element={<Contact />} />
                    </Routes>
                    <BackToTopButton />
                  </Layout>
                </Router>
              </SiteSettingsProvider>
            </UserProvider>
          </BookingProvider>
        </CouponProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
