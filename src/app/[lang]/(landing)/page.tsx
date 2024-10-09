
import Hero from "@/components/landing/Hero";
import Feature from "@/components/landing/Feafure";
import Pricing from "@/components/landing/Pricing";
import About from "@/components/landing/About";
import { Toaster } from "react-hot-toast";
import FAQ from "@/components/landing/FAQ";
import FriendlyLinks from "@/components/landing/FriendlyLinks";
import Header from "@/components/landing/Header";

// export const runtime = 'edge';

const LandingPage = ({
  params: { lang }
}: {
  params: { lang: string }
}) => {
  
  return (
    <div className="bg-white">
      <Header lang={lang} />
      <main>
        <Toaster />
        <Hero lang={lang} />
        <Feature />
        <Pricing />
        <FAQ />
        <FriendlyLinks lang={lang} />
        <About />
      </main>
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 text-sm">
            © Copyright {new Date().getFullYear()} ChatSaaS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage;