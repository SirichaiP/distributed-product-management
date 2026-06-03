// import "bootstrap/dist/css/bootstrap.min.css";
// import "admin-lte/dist/css/adminlte.min.css";

// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "SmartPocket",
//   description: "Enterprise Management System",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className="hold-transition sidebar-mini">
//         {children}
//       </body>
//     </html>
//   );
// }

// import "bootstrap/dist/css/bootstrap.min.css";
// import "admin-lte/dist/css/adminlte.min.css"; 
// import "@/styles/auth.css"; 
// import type { Metadata } from "next";

// export const metadata: Metadata = { 
//   title: "SmartPocket",
//   description: "Enterprise Management System",
//  };

// export default function RootLayout({ 
//   children, 
// }: {
//    children: React.ReactNode;
//    }) { 
//     return ( 
//       <html lang="en"> 
//         <body className="hold-transition sidebar-mini layout-fixed">
//              {children} 
//         </body>
//        </html> 
//             ); 
//       }
import "bootstrap/dist/css/bootstrap.min.css";
import "admin-lte/dist/css/adminlte.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import type { Metadata } from "next";

import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "DPMS",
  description: "Distributed Product Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
       <body>
  <AuthProvider>{children}</AuthProvider>
       </body>

    </html>
  );
}