import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Rooms from "./pages/Rooms/Rooms";
import AddRoom from "./pages/Rooms/AddRoom";
import EditRoom from "./pages/Rooms/EditRoom";
import Guests from "./pages/Guests/Guests";
import AddGuest from "./pages/Guests/AddGuest";
import EditGuest from "./pages/Guests/EditGuest";
import Bookings from "./pages/Bookings/Bookings";
import AddBooking from "./pages/Bookings/AddBooking";
import Invoices from "./pages/Invoices/Invoices";
import InvoiceDetail from "./pages/Invoices/InvoiceDetail";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
        <Route path="/rooms/add" element={<ProtectedRoute><AddRoom /></ProtectedRoute>} />
        <Route path="/rooms/edit/:id" element={<ProtectedRoute><EditRoom /></ProtectedRoute>} />
        <Route path="/guests" element={<ProtectedRoute><Guests /></ProtectedRoute>} />
        <Route path="/guests/add" element={<ProtectedRoute><AddGuest /></ProtectedRoute>} />
        <Route path="/guests/edit/:id" element={<ProtectedRoute><EditGuest /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        <Route path="/bookings/add" element={<ProtectedRoute><AddBooking /></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
        <Route path="/invoices/:bookingId" element={<ProtectedRoute><InvoiceDetail /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;