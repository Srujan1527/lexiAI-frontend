// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute";
// import AppLayout from "../components/AppLayout";

// import Login from "../pages/Login";
// import Signup from "../pages/Signup";
// import Upload from "../pages/Upload";
// import Documents from "../pages/Documents";
// import Chat from "../pages/Chat";
// import History from "../pages/History";

// export default function AppRouter() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/app" replace />} />

//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         <Route
//           path="/app"
//           element={
//             <ProtectedRoute>
//               <AppLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<Navigate to="documents" replace />} />
//           <Route path="upload" element={<Upload />} />
//           <Route path="documents" element={<Documents />} />
//           <Route path="chat/:docId" element={<Chat />} />
//           <Route path="history" element={<History />} />
//         </Route>

//         <Route path="*" element={<Navigate to="/app" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
