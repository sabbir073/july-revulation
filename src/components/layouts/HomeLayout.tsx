import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  // Example: Fetch data for metadata
  const siteName = "July Revolution Alliance";
  const description = "Know the History of the July Revolution in Bangladesh";
  const favicon = "/favicon.png";

  return {
    title: siteName,
    description: description,
    icons: {
      icon: favicon,
    },
  };
}

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default HomeLayout;
