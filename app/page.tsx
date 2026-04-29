'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Clock, MapPin, Coffee, ArrowRight, Instagram, ExternalLink, Compass, Briefcase, Star, ChevronDown } from 'lucide-react';

const menuItems = [
  { name: "Manual Brew", desc: "Satoru Blend: 50% Kerinci Honey & 50% Gayo Full Wash", price: "20K–35K", category: "Coffee" },
  { name: "Black Coffee", desc: "Espresso / Long Black / Americano / On the Rock / Ristretto", price: "22K", category: "Coffee" },
  { name: "White Coffee", desc: "Cafe Latte / Cappuccino (+5K Vanilla/Caramel Syrup)", price: "22K", category: "Coffee" },
  { name: "Creamy Inanna", desc: "⭐ Best Seller — Cokelat-almond, manis, lembut, creamy", price: "20K", category: "Coffee" },
  { name: "Fruity Inari", desc: "Rasa apel hijau segar dan manis", price: "25K", category: "Coffee" },
  { name: "Hanami Sakura", desc: "Racikan terinspirasi momen menikmati bunga sakura", price: "25K", category: "Coffee" },
  { name: "Creamy Inanna 1L", desc: "Kopi susu creamy (1 Liter)", price: "110K", category: "Liter Package" },
  { name: "Fruity Inari 1L", desc: "Kopi apel hijau (1 Liter)", price: "125K", category: "Liter Package" },
  { name: "Hanami Sakura 1L", desc: "Kopi sakura (1 Liter)", price: "125K", category: "Liter Package" },
  { name: "Keiko 1L", desc: "Chocolate — Onna Series (1 Liter)", price: "125K", category: "Liter Package" },
  { name: "Nel 1L", desc: "Matcha — Onna Series (1 Liter)", price: "125K", category: "Liter Package" },
  { name: "Touka 1L", desc: "Taro — Onna Series (1 Liter)", price: "125K", category: "Liter Package" },
  { name: "Uta 1L", desc: "Red Velvet — Onna Series (1 Liter)", price: "125K", category: "Liter Package" },
  { name: "Apolon Tea 1L", desc: "Apel Hijau — Exo-Tea Series (1 Liter)", price: "80K", category: "Liter Package" },
  { name: "Lemongrass Tea 1L", desc: "Lemon & Serai — Exo-Tea Series (1 Liter)", price: "80K", category: "Liter Package" },
  { name: "Keiko", desc: "Chocolate — Onna Series", price: "25K", category: "Non-Coffee" },
  { name: "Nel", desc: "Matcha — Onna Series", price: "25K", category: "Non-Coffee" },
  { name: "Touka", desc: "Taro — Onna Series", price: "25K", category: "Non-Coffee" },
  { name: "Uta", desc: "Red Velvet — Onna Series", price: "25K", category: "Non-Coffee" },
  { name: "Apple Shizuoka", desc: "Rasa apel khas Shizuoka — District Series", price: "25K", category: "Non-Coffee" },
  { name: "Blue Kanagawa", desc: "Soda lemon, mint, blue curacao — District Series", price: "23K", category: "Non-Coffee" },
  { name: "Peachy Fuji", desc: "Soda & peach — District Series", price: "20K", category: "Non-Coffee" },
  { name: "Apolon Tea", desc: "Apel Hijau — Exo-Tea Series", price: "20K", category: "Non-Coffee" },
  { name: "Lemongrass Tea", desc: "Lemon & Serai — Exo-Tea Series", price: "20K", category: "Non-Coffee" },
  { name: "Okonomiyaki", desc: "⭐ Best Seller — Jajanan jalanan Jepang dengan katsuobushi", price: "30K", category: "Food" },
  { name: "Nori Fish Roll", desc: "Potongan fish roll dengan nori gurih", price: "25K", category: "Food" },
  { name: "Fluffy Caramel Waffle", desc: "Waffle lembut dengan saus karamel", price: "25K", category: "Food" },
  { name: "Curry Potato", desc: "Kentang goreng dengan saus kari Jepang", price: "25K", category: "Food" }
];

const categories = ["All", "Coffee", "Non-Coffee", "Food", "Liter Package"];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredItems = activeTab === "All" ? menuItems : menuItems.filter(i => i.category === activeTab);

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const, staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <div className="bg-[#00001A] min-h-screen text-white font-sans selection:bg-[#F5F0E8] selection:text-[#00001A]">
      {/* BACKGROUND NOISE TEXTURE */}
      <div className="fixed inset-0 pointer-events-none bg-noise opacity-80 z-0"></div>

      {/* NAVIGATION */}
      <nav className={`fixed w-full z-[100] transition-all duration-700 ease-in-out ${
        isScrolled 
          ? 'bg-[#00001A]/95 backdrop-blur-md border-b border-white/5 py-4 shadow-[0_8px_40px_rgba(0,0,0,0.8)]' 
          : 'bg-[#00001A]/0 backdrop-blur-none border-b border-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center relative z-10 transition-all duration-700">
          <div className="flex items-center gap-1">
            <Image 
              src="https://i.postimg.cc/hhHqc9Dq/Untitled-design.png" 
              alt="NOJ Coffee Logo" 
              width={140} 
              height={44} 
              className={`h-11 w-auto brightness-0 invert transition-all duration-700 ${isScrolled ? 'scale-90 opacity-90' : 'scale-100 opacity-100'}`}
              referrerPolicy="no-referrer"
            />
          </div>

          <div className={`hidden md:flex items-center space-x-10 text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-700 ${isScrolled ? 'opacity-80' : 'opacity-100'}`}>
            <a href="#menu" className="hover:text-[#F5F0E8] transition-colors opacity-70 hover:opacity-100">Menu</a>
            <a href="#about" className="hover:text-[#F5F0E8] transition-colors opacity-70 hover:opacity-100">About</a>
            <a href="#catering" className="hover:text-[#F5F0E8] transition-colors opacity-70 hover:opacity-100">Catering</a>
            <a href="#order" className="hover:text-[#F5F0E8] transition-colors opacity-70 hover:opacity-100">Order</a>
            <a href="#contact" className="hover:text-[#F5F0E8] transition-colors opacity-70 hover:opacity-100">Contact</a>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://wa.me/6285179769148" target="_blank" rel="noreferrer" className={`hidden md:flex items-center gap-2 border px-6 py-2.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-700 ${
              isScrolled 
                ? 'border-[#F5F0E8] bg-[#F5F0E8] text-[#00001A] hover:bg-white hover:border-white shadow-lg shadow-white/5' 
                : 'border-white/30 text-white hover:bg-white hover:text-[#00001A]'
            }`}>
              Order Now
            </a>

            <button className="md:hidden p-2 text-white transition-opacity duration-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[#00001A] z-40 flex flex-col items-center justify-center space-y-8"
          >
            {['Menu', 'About', 'Catering', 'Order', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="font-display text-4xl font-light hover:text-[#F5F0E8]/70 transition-colors">
                {item}
              </a>
            ))}
            <a href="https://wa.me/6285179769148" target="_blank" rel="noreferrer" className="mt-8 border border-white/30 px-8 py-3 rounded-full uppercase tracking-widest text-xs font-semibold">
              Order Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="min-h-screen flex items-center pt-20 px-6 md:px-12 max-w-7xl mx-auto">
          <motion.div
            className="w-full flex justify-between items-end flex-col sm:flex-row gap-12"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="w-full md:w-3/4">
              <motion.p variants={itemVariants} className="font-sans text-[10px] md:text-xs font-semibold tracking-[0.25em] uppercase opacity-70 mb-8 flex items-center gap-4">
                Est. 5 December 2020 <span className="w-8 h-[1px] bg-white/30 block"></span> Cileungsi, Bogor
              </motion.p>
              
              <motion.h1 variants={itemVariants} className="font-display text-[clamp(48px,12vw,120px)] leading-[0.85] tracking-tight mb-8">
                <span className="block text-white/90">No Overthink.</span>
                <span className="block text-[#F5F0E8] italic pr-4">Just Coffee.</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="font-sans text-lg md:text-xl font-light opacity-80 max-w-lg leading-relaxed mb-12 border-l border-white/20 pl-6">
                Shiawase, Always! 🌊 <br className="hidden md:block"/>
                A Japanese minimalist coffee experience in the heart of Cileungsi.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <a href="#menu" className="bg-[#F5F0E8] text-[#00001A] px-8 py-4 rounded-full font-semibold tracking-wider text-xs uppercase hover:bg-white transition-colors flex items-center gap-2">
                  View Menu <ArrowRight size={16} />
                </a>
                <a href="https://maps.app.goo.gl/csYx1ksi8xs3WgTT7" target="_blank" rel="noreferrer" className="border border-white/30 px-8 py-4 rounded-full font-semibold tracking-wider text-xs uppercase hover:bg-white/10 transition-colors flex items-center gap-2">
                  <MapPin size={16} /> Find Us
                </a>
              </motion.div>
            </div>
            
            <motion.div variants={itemVariants} className="sm:self-end flex items-center gap-3 border border-white/10 rounded-full px-5 py-2.5 bg-white/5 backdrop-blur-sm">
              <Star size={16} className="text-[#F5F0E8] fill-[#F5F0E8]" />
              <span className="font-sans text-sm font-medium tracking-wide">4.9 · <span className="opacity-60 text-xs uppercase">230 Reviews</span></span>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-6 md:left-12 hidden md:flex flex-col items-center gap-4 opacity-50"
          >
            <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
          </motion.div>
        </section>

        {/* BRAND STATEMENT */}
        <section id="about" className="py-32 px-6 md:px-12 max-w-5xl mx-auto border-t border-white/10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={heroVariants}
          >
            <motion.h2 variants={itemVariants} className="font-display text-3xl md:text-5xl lg:text-6xl leading-tight font-light mb-10 max-w-4xl mx-auto text-[#F5F0E8]">
              &quot;Kamu nggak perlu overthinking soal kopi. Kami yang sudah mikirin semuanya.&quot;
            </motion.h2>
            <motion.p variants={itemVariants} className="font-sans text-white/60 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-light">
              Penuh rasa syukur memasuki tahun ke-4 sejak pertama berdiri pada 5 Desember 2020. Sebuah ruang tenang berkonsep minimalis Jepang yang menyajikan ragam menu kopi dan makanan, didedikasikan untuk para <span className="italic text-white">Nakama</span> (sebutan untuk pelanggan kami). Cocok untuk bekerja dengan laptop, atau rehat sejenak dari riuhnya isi pikiran.
            </motion.p>
          </motion.div>
        </section>

        {/* QUICK INFO STRIP */}
        <section className="border-y border-white/10 py-12 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between gap-10">
            <div className="flex gap-4">
              <Clock className="opacity-50 shrink-0 mt-1" size={20} />
              <div>
                <h4 className="text-[11px] uppercase tracking-[0.15em] font-semibold opacity-50 mb-2">Hours</h4>
                <p className="text-sm font-light">Mon–Thu: <span className="font-medium text-[#F5F0E8]">10:00 AM – 10:00 PM</span></p>
                <p className="text-sm font-light">Fri–Sun: <span className="font-medium text-[#F5F0E8]">7:30 AM – 10:00 PM</span></p>
              </div>
            </div>
            
            <div className="flex gap-4 max-w-md">
              <MapPin className="opacity-50 shrink-0 mt-1" size={20} />
              <div>
                <h4 className="text-[11px] uppercase tracking-[0.15em] font-semibold opacity-50 mb-2">Location</h4>
                <p className="text-sm font-light leading-relaxed mb-3">Cluster Magnolia, Jl. Metland Cileungsi Blok DG 2 No.13, Cipenjo, Cileungsi, Bogor Regency, West Java 16820</p>
                <a href="https://maps.app.goo.gl/csYx1ksi8xs3WgTT7" target="_blank" rel="noreferrer" className="text-xs uppercase tracking-wider text-[#F5F0E8] border-b border-[#F5F0E8]/30 pb-1 hover:border-[#F5F0E8] transition-colors inline-block">Get Directions &rarr;</a>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="opacity-50 shrink-0 mt-1" size={20} />
              <div>
                <h4 className="text-[11px] uppercase tracking-[0.15em] font-semibold opacity-50 mb-2">WhatsApp</h4>
                <p className="text-sm font-medium text-[#F5F0E8] tracking-widest">0851-7976-9148</p>
              </div>
            </div>
          </div>
        </section>

        {/* MENU SECTION */}
        <section id="menu" className="py-32 px-6 md:px-12 max-w-5xl mx-auto min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight mb-4 text-[#F5F0E8]">The Menu</h2>
            <div className="w-12 h-[1px] bg-white/30 mx-auto"></div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                  activeTab === cat 
                  ? 'bg-[#F5F0E8] text-[#00001A]' 
                  : 'bg-transparent text-white/70 border border-white/20 hover:border-white/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative"
                >
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-sans text-lg md:text-xl font-medium tracking-tight pr-4 bg-[#00001A] relative z-10 group-hover:text-[#F5F0E8] transition-colors">{item.name}</h3>
                    <div className="absolute left-0 right-0 bottom-6 border-b border-white/10 z-0"></div>
                    <span className="font-sans text-sm font-medium tracking-wider text-[#F5F0E8] bg-[#00001A] pl-4 relative z-10">Rp {item.price}</span>
                  </div>
                  <p className="text-white/50 text-xs md:text-sm font-light italic leading-relaxed max-w-[85%]">{item.desc}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* ATMOSPHERE / VIBE */}
        <section className="bg-white px-6 md:px-12 py-32 text-[#00001A] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00001A 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <motion.div 
            className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={heroVariants}
          >
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-x-8 gap-y-4 font-display text-3xl md:text-6xl italic text-black/90 mb-12 tracking-tight">
              <span>Casual</span>
              <span className="text-[#00001A]/20">·</span>
              <span>Cosy</span>
              <span className="text-[#00001A]/20">·</span>
              <span>Quiet</span>
              <span className="text-[#00001A]/20">·</span>
              <span>Trendy</span>
            </motion.div>
            
            <motion.p variants={itemVariants} className="max-w-2xl font-sans text-lg text-black/60 font-light leading-relaxed mb-16">
              Cocok untuk kerja sendiri dengan laptop, nongkrong bareng teman, atau sekadar diam dan menikmati. Outdoor seating tersedia. Free parking. WiFi-friendly atmosphere.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3">
              {['Outdoor Seating', 'Dine-in', 'Takeaway', 'Delivery', 'Free Parking', 'Accepts Reservations', 'Table Service'].map((facility, i) => (
                <div key={i} className="border border-[#00001A]/10 text-[#00001A]/70 px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold">
                  {facility}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* CATERING SECTION */}
        <section id="catering" className="py-32 px-6 md:px-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-16">
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#F5F0E8]/70 mb-4">Catering Services</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">Bawa NOJ ke Acaramu</h2>
              <p className="font-sans text-white/60 font-light text-sm md:text-base max-w-2xl mb-8">Layanan katering kopi untuk area Jabodetabek. Sangat cocok untuk menemani event pernikahan, gathering kantor, maupun acara keluarga. Minimum order 200 cup. Kamu juga boleh <span className="text-[#F5F0E8] font-medium border-b border-[#F5F0E8]/30 pb-0.5">meminta sample</span> untuk dites rasanya!</p>
              
              <div className="grid md:grid-cols-2 gap-6 text-left mt-8">
                <div className="bg-white/[0.02] border border-white/10 p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#F5F0E8]/50"></div>
                  <h3 className="font-sans text-lg font-medium text-[#F5F0E8] mb-2 text-[15px]">1. Creamy Inanna</h3>
                  <p className="font-sans text-[13px] text-white/60 font-light leading-relaxed">Kopi susu best-seller kami. Inanna yang berarti Dewi Cinta, digambarkan dengan rasa coklat-almond nikmat, layaknya orang menggambarkan cinta dengan sekotak coklat manis.</p>
                </div>
                <div className="bg-white/[0.02] border border-white/10 p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#F5F0E8]/50"></div>
                  <h3 className="font-sans text-lg font-medium text-[#F5F0E8] mb-2 text-[15px]">2. Kopi Susu Lollipop</h3>
                  <p className="font-sans text-[13px] text-white/60 font-light leading-relaxed">Kopi susu terbaru NOJ COFFEE, eksklusif khusus event & online order. Terasa jelas sensasinya seperti memakan permen lollipop dengan balance rasa manis & gurih yang pas.</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto pb-8">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="font-sans text-xs uppercase tracking-wider font-medium text-white/50 pb-4 w-1/3">Quantity (8oz Cups)</th>
                    <th className="font-sans text-xs uppercase tracking-wider font-medium pb-4 w-1/3 text-[#F5F0E8]">1. Creamy Inanna <span className="block text-[10px] text-white/40 mt-1 capitalize font-normal opacity-70">Rp 11.000/cup</span></th>
                    <th className="font-sans text-xs uppercase tracking-wider font-medium pb-4 w-1/3 text-[#F5F0E8]">2. Kopi Susu Lollipop <span className="block text-[10px] text-white/40 mt-1 capitalize font-normal opacity-70">Rp 8.000/cup</span></th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light text-white/80">
                  <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="py-5 font-medium group-hover:text-white transition-colors">200 cup <span className="text-[10px] uppercase text-white/40 ml-2">(Minimum)</span></td>
                    <td className="py-5">Rp 2.500.000</td>
                    <td className="py-5">Rp 1.900.000</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="py-5 font-medium group-hover:text-white transition-colors">300 cup</td>
                    <td className="py-5">Rp 3.550.000 <span className="text-[10px] uppercase text-[#F5F0E8]/70 ml-2 border border-[#F5F0E8]/30 px-2 py-0.5 rounded-full">-50k</span></td>
                    <td className="py-5">Rp 2.650.000 <span className="text-[10px] uppercase text-[#F5F0E8]/70 ml-2 border border-[#F5F0E8]/30 px-2 py-0.5 rounded-full">-50k</span></td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="py-5 font-medium group-hover:text-white transition-colors">400 cup</td>
                    <td className="py-5">Rp 4.600.000 <span className="text-[10px] uppercase text-[#F5F0E8]/70 ml-2 border border-[#F5F0E8]/30 px-2 py-0.5 rounded-full">-100k</span></td>
                    <td className="py-5">Rp 3.400.000 <span className="text-[10px] uppercase text-[#F5F0E8]/70 ml-2 border border-[#F5F0E8]/30 px-2 py-0.5 rounded-full">-100k</span></td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="py-5 font-medium group-hover:text-white transition-colors">550 cup</td>
                    <td className="py-5">Rp 6.150.000 <span className="text-[10px] uppercase text-[#F5F0E8]/70 ml-2 border border-[#F5F0E8]/30 px-2 py-0.5 rounded-full">-200k</span></td>
                    <td className="py-5">Rp 4.500.000 <span className="text-[10px] uppercase text-[#F5F0E8]/70 ml-2 border border-[#F5F0E8]/30 px-2 py-0.5 rounded-full">-200k</span></td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="py-5 font-medium group-hover:text-white transition-colors">700 cup</td>
                    <td className="py-5">Rp 7.700.000 <span className="text-[10px] uppercase text-[#F5F0E8]/70 ml-2 border border-[#F5F0E8]/30 px-2 py-0.5 rounded-full">-300k</span></td>
                    <td className="py-5">Rp 5.600.000 <span className="text-[10px] uppercase text-[#F5F0E8]/70 ml-2 border border-[#F5F0E8]/30 px-2 py-0.5 rounded-full">-300k</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/[0.03] p-8 border border-white/10 rounded-xl">
              <div>
                <p className="text-sm font-light text-white/70 mb-1">
                  <span className="font-medium text-[#F5F0E8]">Biaya Transportasi:</span> Rp 300.000
                </p>
                <p className="text-xs italic text-white/50">(GRATIS untuk area Metland Cileungsi & Transyogi)</p>
              </div>
              <a href="https://wa.me/6285179769148" target="_blank" rel="noreferrer" className="shrink-0 bg-[#F5F0E8] text-[#00001A] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-color">
                Pesan Katering <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </section>

        {/* NOJ UNIVERSE */}
        <section className="border-t border-white/10 py-32 px-6 md:px-12 max-w-7xl mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="mb-16"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#F5F0E8]/70 mb-4">Ecosystem</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white tracking-tight">Lebih dari Sekadar Kafe</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 border border-white/10 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent hover:border-white/30 transition-all duration-300"
            >
              <Coffee className="text-[#F5F0E8] mb-6" size={32} strokeWidth={1} />
              <h3 className="font-display text-2xl font-light tracking-tight mb-3">NOJ Coffee</h3>
              <p className="font-sans text-sm font-light text-white/50 leading-relaxed">Kedai kopi utama kami di Cileungsi. Ruang tenang berkonsep minimalis Jepang.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 border border-white/10 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent hover:border-white/30 transition-all duration-300"
            >
              <Briefcase className="text-[#F5F0E8] mb-6" size={32} strokeWidth={1} />
              <h3 className="font-display text-2xl font-light tracking-tight mb-3">NOJ Pintar</h3>
              <p className="font-sans text-sm font-light text-white/50 leading-relaxed">Layanan afiliasi dan solusi bisnis NOJ yang membantu berbagai keperluan digital.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 border border-white/10 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent hover:border-white/30 transition-all duration-300"
            >
              <Compass className="text-[#F5F0E8] mb-6" size={32} strokeWidth={1} />
              <h3 className="font-display text-2xl font-light tracking-tight mb-3">NOJ Roastworks</h3>
              <p className="font-sans text-sm font-light text-white/50 leading-relaxed">Inisiatif kami dalam menyajikan biji kopi dan peralatan seduh pilihan.</p>
            </motion.div>
          </div>
        </section>

        {/* ORDER / CTA SECTION */}
        <section id="order" className="bg-[#F5F0E8] text-[#00001A] py-32 px-6 md:px-12 text-center rounded-t-[40px] mt-10">
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="max-w-4xl mx-auto"
          >
            <h2 className="font-display text-5xl md:text-7xl font-light tracking-tight mb-6 text-[#00001A]">Siap Memesan?</h2>
            <p className="font-sans text-lg font-light text-[#00001A]/60 mb-12 max-w-xl mx-auto">
              Tersedia di layanan antar makanan favorit Anda. Nikmati kopi kami kapan saja dan di mana saja.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a href="https://gofood.co.id/jakarta/restaurant/noj-coffee-metland-cileungsi-671e67e0-4383-4b07-bc10-a46b5712509a" target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-[#EE2737] text-white px-8 py-4 rounded-full font-bold tracking-wider text-sm uppercase shadow-lg shadow-[#EE2737]/20 hover:-translate-y-1 transition-transform flex items-center justify-center gap-2">
                Order via GoFood <ExternalLink size={16} />
              </a>
              <a href="https://r.grab.com/g/2-1-6-C4NTVKEWEGAKNN" target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-[#00B14F] text-white px-8 py-4 rounded-full font-bold tracking-wider text-sm uppercase shadow-lg shadow-[#00B14F]/20 hover:-translate-y-1 transition-transform flex items-center justify-center gap-2">
                Order via GrabFood <ExternalLink size={16} />
              </a>
              <a href="https://wa.me/6285179769148" target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-4 rounded-full font-bold tracking-wider text-sm uppercase shadow-lg shadow-[#25D366]/20 hover:-translate-y-1 transition-transform flex items-center justify-center gap-2">
                WhatsApp <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contact" className="bg-[#00001A] relative z-20 pt-20 pb-10 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-sm font-light text-white/50">
          
          <div>
            <div className="text-white mb-6 flex items-center gap-2">
              <Image 
                src="https://i.postimg.cc/hhHqc9Dq/Untitled-design.png" 
                alt="NOJ Coffee Logo" 
                width={110} 
                height={36} 
                className="h-9 w-auto brightness-0 invert"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[#F5F0E8] italic font-display text-lg mb-4">Shiawase, Always! 🌊</p>
            <p className="leading-relaxed">Japanese minimalist coffee shop focused on mental peace and simplicity.</p>
          </div>

          <div>
             <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white mb-6">Menu</h4>
             <ul className="space-y-4">
               <li><a href="#menu" className="hover:text-[#F5F0E8] transition-colors inline-flex items-center gap-2"><ChevronDown size={14} className="rotate-[-90deg]"/> Menu Utama</a></li>
               <li><a href="#about" className="hover:text-[#F5F0E8] transition-colors inline-flex items-center gap-2"><ChevronDown size={14} className="rotate-[-90deg]"/> Tentang Kami</a></li>
               <li><a href="#catering" className="hover:text-[#F5F0E8] transition-colors inline-flex items-center gap-2"><ChevronDown size={14} className="rotate-[-90deg]"/> Catering Kopi</a></li>
               <li><a href="#order" className="hover:text-[#F5F0E8] transition-colors inline-flex items-center gap-2"><ChevronDown size={14} className="rotate-[-90deg]"/> Pesan Antar</a></li>
             </ul>
          </div>

          <div>
             <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white mb-6">Connect</h4>
             <ul className="space-y-4">
               <li><a href="https://www.instagram.com/noj.coffee/" target="_blank" rel="noreferrer" className="hover:text-[#F5F0E8] transition-colors inline-flex items-center gap-2"><Instagram size={14} /> Instagram</a></li>
               <li><a href="https://www.tiktok.com/@noj.coffee" target="_blank" rel="noreferrer" className="hover:text-[#F5F0E8] transition-colors inline-flex items-center gap-2"><ExternalLink size={14} /> TikTok</a></li>
               <li><a href="mailto:noj.coffee@gmail.com" target="_blank" rel="noreferrer" className="hover:text-[#F5F0E8] transition-colors inline-flex items-center gap-2"><ExternalLink size={14} /> Email Us</a></li>
               <li><a href="https://gofood.co.id/jakarta/restaurant/noj-coffee-metland-cileungsi-671e67e0-4383-4b07-bc10-a46b5712509a" target="_blank" rel="noreferrer" className="hover:text-[#F5F0E8] transition-colors inline-flex items-center gap-2"><ExternalLink size={14} /> GoFood</a></li>
               <li><a href="https://r.grab.com/g/2-1-6-C4NTVKEWEGAKNN" target="_blank" rel="noreferrer" className="hover:text-[#F5F0E8] transition-colors inline-flex items-center gap-2"><ExternalLink size={14} /> GrabFood</a></li>
               <li><a href="https://open.spotify.com/user/31ll2nnhc34yehbbhl4pjwmcmyli?si=m6egfnhBRqSiKQpVag9LCg" target="_blank" rel="noreferrer" className="hover:text-[#F5F0E8] transition-colors inline-flex items-center gap-2"><ExternalLink size={14} /> Spotify Playlist</a></li>
             </ul>
          </div>

          <div>
             <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white mb-6">Visit</h4>
             <p className="mb-4 leading-relaxed">
               Cluster Magnolia, <br/>
               Jl. Metland Cileungsi Blok DG 2 No.13, <br/>
               Cileungsi, Bogor 16820
             </p>
             <p className="mb-1">Mon–Thu: <span className="text-white">10:00 – 22:00</span></p>
             <p>Fri–Sun: <span className="text-white">07:30 – 22:00</span></p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-white/30">
          <p>© 2025 NOJ Coffee. All rights reserved.</p>
          <p>Made with ☕ in Cileungsi</p>
        </div>
      </footer>
    </div>
  );
}
