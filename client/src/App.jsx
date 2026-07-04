import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute, RoleRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Auth
import Login from "./pages/Auth/Login";
import Unauthorized from "./pages/Unauthorized";

// Dashboard
import Dashboard from "./pages/Dashboard/Dashboard";

// Rooms
import Rooms from "./pages/Rooms/Rooms";
import AddRoom from "./pages/Rooms/AddRoom";
import EditRoom from "./pages/Rooms/EditRoom";

// Guests
import Guests from "./pages/Guests/Guests";
import AddGuest from "./pages/Guests/AddGuest";
import EditGuest from "./pages/Guests/EditGuest";

// Bookings
import Bookings from "./pages/Bookings/Bookings";
import AddBooking from "./pages/Bookings/AddBooking";

// Invoices
import Invoices from "./pages/Invoices/Invoices";
import InvoiceDetail from "./pages/Invoices/InvoiceDetail";

// V2 New Pages
import Hotels from "./pages/Hotels/Hotels";
import AddHotel from "./pages/Hotels/AddHotel";
import EditHotel from "./pages/Hotels/EditHotel";
import Users from "./pages/Users/Users";
import AddUser from "./pages/Users/AddUser";
import EditUser from "./pages/Users/EditUser";
import Payments from "./pages/Payments/Payments";
import Profile from "./pages/Profile/Profile";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Dashboard — all roles */}
        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        {/* Rooms — SuperAdmin, Manager, Receptionist */}
        <Route path="/rooms" element={
          <RoleRoute allowedRoles={["SuperAdmin", "Manager", "Receptionist"]}>
            <Rooms />
          </RoleRoute>
        } />
        <Route path="/rooms/add" element={
          <RoleRoute allowedRoles={["SuperAdmin", "Manager"]}>
            <AddRoom />
          </RoleRoute>
        } />
        <Route path="/rooms/edit/:id" element={
          <RoleRoute allowedRoles={["SuperAdmin", "Manager"]}>
            <EditRoom />
          </RoleRoute>
        } />

        {/* Guests — SuperAdmin, Manager, Receptionist */}
        <Route path="/guests" element={
          <RoleRoute allowedRoles={["SuperAdmin", "Manager", "Receptionist"]}>
            <Guests />
          </RoleRoute>
        } />
        <Route path="/guests/add" element={
          <RoleRoute allowedRoles={["SuperAdmin", "Manager", "Receptionist"]}>
            <AddGuest />
          </RoleRoute>
        } />
        <Route path="/guests/edit/:id" element={
          <RoleRoute allowedRoles={["SuperAdmin", "Manager", "Receptionist"]}>
            <EditGuest />
          </RoleRoute>
        } />

        {/* Bookings — SuperAdmin, Manager, Receptionist */}
        <Route path="/bookings" element={
          <RoleRoute allowedRoles={["SuperAdmin", "Manager", "Receptionist"]}>
            <Bookings />
          </RoleRoute>
        } />
        <Route path="/bookings/add" element={
          <RoleRoute allowedRoles={["SuperAdmin", "Manager", "Receptionist"]}>
            <AddBooking />
          </RoleRoute>
        } />

        {/* Invoices — all roles */}
        <Route path="/invoices" element={
          <ProtectedRoute><Invoices /></ProtectedRoute>
        } />
        <Route path="/invoices/:bookingId" element={
          <ProtectedRoute><InvoiceDetail /></ProtectedRoute>
        } />

        {/* Payments — SuperAdmin, Manager, Receptionist, Accountant */}
        <Route path="/payments" element={
          <ProtectedRoute><Payments /></ProtectedRoute>
        } />

        {/* Hotels — SuperAdmin only */}
        <Route path="/hotels" element={
          <RoleRoute allowedRoles={["SuperAdmin"]}>
            <Hotels />
          </RoleRoute>
        } />
        <Route path="/hotels/add" element={
          <RoleRoute allowedRoles={["SuperAdmin"]}>
            <AddHotel />
          </RoleRoute>
        } />
        <Route path="/hotels/edit/:id" element={
          <RoleRoute allowedRoles={["SuperAdmin"]}>
            <EditHotel />
          </RoleRoute>
        } />

        {/* Users — SuperAdmin only */}
        <Route path="/users" element={
          <RoleRoute allowedRoles={["SuperAdmin"]}>
            <Users />
          </RoleRoute>
        } />
        <Route path="/users/add" element={
          <RoleRoute allowedRoles={["SuperAdmin"]}>
            <AddUser />
          </RoleRoute>
        } />
        <Route path="/users/edit/:id" element={
          <RoleRoute allowedRoles={["SuperAdmin"]}>
            <EditUser />
          </RoleRoute>
        } />

        {/* Profile — all roles */}
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;