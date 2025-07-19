import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EnergyPermitsProcessor from "@/components/permit/EnergyPermitsProcessor";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EnergyPermitsProcessor />
      <Footer />
    </div>
  );
};

export default Index;
