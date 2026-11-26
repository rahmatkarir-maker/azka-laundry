/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import AboutSection from './components/AboutSection';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import OrderFormSection from './components/OrderFormSection';
import PriceCalculator from './components/PriceCalculator';
import ProcessSection from './components/ProcessSection';
import SegmentsSection from './components/SegmentsSection';
import ServicesSection from './components/ServicesSection';
import {
  CALCULATOR_TIERS,
  type CalculatorServiceId,
  type ServiceId,
} from './data/laundryData';

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function App() {
  // Shared calculator & form state so clicking cards seamlessly prefills the next step
  const [calcServiceId, setCalcServiceId] =
    useState<CalculatorServiceId>('cuci-setrika');
  const [calcQuantity, setCalcQuantity] = useState<number>(4);
  const [calcPickup, setCalcPickup] = useState<boolean>(true);

  const [formService, setFormService] = useState<ServiceId>('cuci-setrika');
  const [formPickup, setFormPickup] = useState<boolean>(true);
  const [formNote, setFormNote] = useState<string>('');

  const handleSelectForCalculator = (serviceId: CalculatorServiceId) => {
    const tier = CALCULATOR_TIERS.find((t) => t.id === serviceId);
    setCalcServiceId(serviceId);
    if (tier) {
      setCalcQuantity(tier.defaultQty);
    }
    scrollToSection('kalkulator');
  };

  const handleSelectPickupService = () => {
    setFormService('antar-jemput');
    setFormPickup(true);
    scrollToSection('pesan');
  };

  const handleContinueFromCalculator = () => {
    const tier = CALCULATOR_TIERS.find((t) => t.id === calcServiceId);
    setFormService(calcServiceId);
    setFormPickup(calcPickup);
    if (tier) {
      setFormNote(
        `Perkiraan jumlah: ${calcQuantity} ${tier.unitLabel} (${tier.name}).`
      );
    }
    scrollToSection('pesan');
  };

  const handleOrderForSegment = (
    recommendedService: CalculatorServiceId,
    segmentTitle: string
  ) => {
    setFormService(recommendedService);
    setFormPickup(true);
    setFormNote(`Kebutuhan segmen: ${segmentTitle}.`);
    scrollToSection('pesan');
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      <Navbar />

      <main>
        <Hero
          onQuickPickup={() => {
            setFormPickup(true);
            scrollToSection('pesan');
          }}
          onQuickEstimate={() => scrollToSection('kalkulator')}
        />

        <ServicesSection
          onSelectForCalculator={handleSelectForCalculator}
          onSelectPickupService={handleSelectPickupService}
        />

        <PriceCalculator
          selectedServiceId={calcServiceId}
          onChangeServiceId={setCalcServiceId}
          quantity={calcQuantity}
          onChangeQuantity={setCalcQuantity}
          needPickup={calcPickup}
          onChangeNeedPickup={setCalcPickup}
          onContinueToOrderForm={handleContinueFromCalculator}
        />

        <ProcessSection />

        <SegmentsSection onOrderForSegment={handleOrderForSegment} />

        <AboutSection />

        <OrderFormSection
          prefillService={formService}
          prefillPickup={formPickup}
          prefillNote={formNote}
        />
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
