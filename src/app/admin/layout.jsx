import AuthProvider from "../../components/providers/AuthProvider";

export default function AdminRootLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
