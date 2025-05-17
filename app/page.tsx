import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import { Lock, CheckCircle, Smartphone } from 'lucide-react'

export default function Home() {
  return (
    <main className="bg-black text-white font-sans tracking-tight leading-relaxed">
      <Header />

      <div className="max-w-6xl mx-auto px-4 pt-24 sm:pt-32 space-y-24">
        {/* Hero Section */}
        <section>
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-12">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-left">
                Accepteer digitale euro's zonder gedoe.
              </h1>
              <p className="text-lg sm:text-xl text-white/80 mt-4 max-w-md">
                Eén apparaat – Eén QR-code. Geen abonnementen. Jouw klanten betalen met EURC – jij ontvangt direct op je eigen wallet.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <button className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition">
                  Bekijk Product
                </button>
                <button className="border border-white bg-white text-black px-4 py-2 rounded hover:bg-transparent hover:text-white transition">
                  Bestel direct voor €130
                </button>
              </div>
            </div>
            <div>
              <img 
                src="/loqq-device-bg-0A0A0A.png" 
                alt="Loqq display" 
                className="w-full max-w-sm"
              />
            </div>
          </div>
        </section>

        {/* Waarom Loqq? Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center">Waarom Loqq?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mt-12">
            <div className="flex items-start gap-4 text-left">
              <Lock className="text-white" size={32} />
              <div>
                <h3 className="font-semibold text-lg">Jij bezit je geld</h3>
                <p className="text-white/70 text-sm mt-1">Je ontvangt direct. Geen tussenpartij.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <CheckCircle className="text-white" size={32} />
              <div>
                <h3 className="font-semibold text-lg">Geen abonnementen</h3>
                <p className="text-white/70 text-sm mt-1">Eenmalige aanschaf. Geen verborgen kosten.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <Smartphone className="text-white" size={32} />
              <div>
                <h3 className="font-semibold text-lg">Werkt met elk toestel</h3>
                <p className="text-white/70 text-sm mt-1">Toon de QR op een scherm of print jouw ketzie.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Hoe het werkt Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center">Hoe het werkt</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-white/90 text-center mt-12">
            {[
              "Bestel je Loqq-licentie of display",
              "Vul je walletadres in",
              "Klanten scannen QR en betalen in digitale euro",
              "Jij ontvangt direct de betaling"
            ].map((step, i) => (
              <div key={i} className="space-y-2">
                <div className="w-8 h-8 mx-auto bg-green-400 text-black rounded-full flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <p>{step}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/60 text-center mt-4">
            Geen bankon. Geen verwerkingstijd. Geen KYC.
          </p>
        </section>

        {/* Loqq Producten Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center">Loqq Producten</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mt-12">
            <div className="bg-white/5 rounded-xl p-6 text-left">
              <h3 className="font-semibold text-white text-lg">Loqq Lite – €130</h3>
              <p className="text-white/70 text-sm mt-1">Softwarepakket – supportpagina</p>
              <button className="mt-4 border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition">
                Vergelijk producten
              </button>
            </div>
            <div className="bg-white/5 rounded-xl p-6 text-left">
              <h3 className="font-semibold text-white text-lg">Loqq Display – €450</h3>
              <p className="text-white/70 text-sm mt-1">Inclusief mini-scherm-houder</p>
              <button className="mt-4 border border-white bg-white text-black px-4 py-2 rounded hover:bg-transparent hover:text-white transition">
                Bestel nu
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
