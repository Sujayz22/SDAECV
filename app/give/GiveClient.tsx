'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface StewardshipQA {
  question: string;
  answer: string;
  biblicalRef: string;
  icon: string;
}

const stewardshipQAs: StewardshipQA[] = [
  {
    question: 'Why do we give?',
    answer: 'Giving is a form of worship and a response of love to God\'s ultimate gift. It counteracts selfishness, fosters faith, and aligns our hearts with God\'s generous character. Your contributions directly support the local church ministry, care for the vulnerable, and help spread the gospel globally.',
    biblicalRef: 'Matthew 6:21 & John 3:16',
    icon: 'favorite',
  },
  {
    question: 'What is the Tithe?',
    answer: 'Tithe means a tenth (10%). The Bible teaches that tithing is returning a faithful tenth of our income or increase to God. It is not our gift to God, but rather returning what is already His. The tithe is dedicated strictly to supporting the gospel ministry and pastoral work.',
    biblicalRef: 'Malachi 3:10 & Leviticus 27:30',
    icon: 'payments',
  },
  {
    question: 'What is a Free-will Offering?',
    answer: 'Offerings are voluntary gifts given in addition to the tithe. While tithe is a specified tenth, offerings are decided individually in our hearts, reflecting our gratitude for God\'s abundant blessings. Offerings support local church operations, youth activities, building maintenance, and community outreach.',
    biblicalRef: '2 Corinthians 9:7 & Deuteronomy 16:17',
    icon: 'volunteer_activism',
  },
  {
    question: 'How much should I give?',
    answer: 'God looks at the heart rather than the amount. Tithing is set at 10% of our increase, while offerings should be given systematically and in proportion to how God has blessed us. Most importantly, giving should always be done cheerfully, prayerfully, and voluntarily—never out of guilt or compulsion.',
    biblicalRef: '2 Corinthians 9:7 & 1 Corinthians 16:2',
    icon: 'savings',
  },
  {
    question: 'Where does your money go?',
    answer: 'In the Seventh-day Adventist (SDA) Church, tithes (10% of income) are strictly dedicated to funding the pastoral and evangelistic ministry globally. Offerings (freewill contributions) provide for local church operations, maintenance, and specific humanitarian causes.',
    biblicalRef: '1 Corinthians 9:14 & 2 Corinthians 8:4',
    icon: 'account_tree',
  },
];

export function GiveMethods({
  upiId: propUpiId,
  qrCodeImage,
  bankDetails: propBankDetails
}: {
  upiId?: string;
  qrCodeImage?: any;
  bankDetails?: any;
}) {
  const [activeMethod, setActiveMethod] = useState<'upi' | 'bank'>('upi');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const bankDetails = propBankDetails || {
    accountName: 'SDA Church',
    accountNumber: '10507878497',
    bankName: 'State Bank of India',
    branch: 'Bagayam (Vellore), Christian Medical College Campus',
    ifscCode: 'SBIN0002203',
    cifNo: '80398219137',
  };

  const upiId = propUpiId || 'seventhdayadv316@sbi';

  return (
    <section className="w-full py-24 bg-[#0c0818] relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5b2d9c]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#e36520] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
            How to Give
          </span>
          <h2
            className="text-4xl md:text-6xl text-white mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-newsreader)' }}
          >
            Supporting the <em className="italic text-[#a78bfa]">Mission</em>
          </h2>
          <p className="text-white/50 text-base max-w-md mx-auto leading-relaxed">
            Choose the method that works best for you. All contributions directly support church ministries, local community aid, and gospel outreach.
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveMethod('upi')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${activeMethod === 'upi'
              ? 'bg-white text-[#0c0818] shadow-lg shadow-white/5'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
          >
            <span className="material-symbols-outlined text-lg">qr_code_2</span>
            UPI / QR Code
          </button>
          <button
            onClick={() => setActiveMethod('bank')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${activeMethod === 'bank'
              ? 'bg-white text-[#0c0818] shadow-lg shadow-white/5'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
          >
            <span className="material-symbols-outlined text-lg">account_balance</span>
            Bank Transfer
          </button>
        </div>

        {/* Method Panels */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeMethod === 'upi' ? (
              <motion.div
                key="upi"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr] gap-10 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 items-center"
              >
                {/* QR Code Column */}
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white p-6 rounded-2xl shadow-2xl relative group overflow-hidden">
                    <div className="relative size-[180px]">
                      <Image
                        src={qrCodeImage?.asset?.url || "https://res.cloudinary.com/ddtlgvixd/image/upload/v1782854533/qr_code_vnkbyz.png"}
                        alt="SDA Church UPI QR Code"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                  <span className="text-white/40 text-xs mt-4 tracking-widest uppercase">
                    Scan with any UPI App
                  </span>
                </div>

                {/* Instructions Column */}
                <div className="flex flex-col justify-center">
                  <h3
                    className="text-2xl text-white mb-4"
                    style={{ fontFamily: 'var(--font-newsreader)' }}
                  >
                    UPI Transfer
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6">
                    You can quickly give using GPay, PhonePe, Paytm, BHIM or your banking app by scanning the QR code, or by copying and pasting the official church UPI ID.
                  </p>
                  <h4
                    className="text-xl text-white mb-4"
                    style={{ fontFamily: 'var(--font-newsreader)' }}
                  >
                    Merchant Name : <span className="text-[#a78bfa]">Mr. SEVENTHDAY ADVENTIST</span>
                  </h4>
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4">
                    <div>
                      <p className="text-white/40 text-xs tracking-wider uppercase mb-1">Church UPI ID</p>
                      <p className="text-white font-mono text-base font-bold select-all">{upiId}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(upiId, 'upi')}
                      className="flex items-center justify-center size-10 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {copiedField === 'upi' ? 'done' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                  <p className="text-[#e4d8c4]/80 text-sm leading-relaxed mb-3 pt-3">
                    <span className='text-[#ff647f] font-bold'>Note : </span> Please use the note field to mention your giving purpose, e.g., &quot;Tithes&quot;, &quot;Divine Service Offering&quot;, &quot;Mission Tithes&quot;, or &quot;Sabbath School&quot;.
                  </p>

                  {copiedField === 'upi' && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#a78bfa] text-xs font-bold mt-2"
                    >
                      UPI ID Copied to clipboard!
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="bank"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12"
              >
                <div className="mb-8">
                  <h3
                    className="text-2xl text-white mb-2"
                    style={{ fontFamily: 'var(--font-newsreader)' }}
                  >
                    Bank Details (NEFT / IMPS / RTGS)
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    For direct bank transfers, please use the details below.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {Object.entries(bankDetails).map(([key, rawValue]) => {
                    const value = String(rawValue);
                    const labels: Record<string, string> = {
                      accountName: 'Account Name',
                      accountNumber: 'Account Number',
                      bankName: 'Bank Name',
                      branch: 'Branch',
                      ifscCode: 'IFSC Code',
                      cifNo: 'CIF No',
                    };

                    const isCopyable = ['accountNumber', 'ifscCode', 'cifNo'].includes(key);

                    return (
                      <div
                        key={key}
                        className="bg-white/4 border border-white/5 rounded-xl p-5 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-white/40 text-xs tracking-wider uppercase mb-1">
                            {labels[key]}
                          </p>
                          <p className="text-white font-semibold text-sm select-all">{value}</p>
                        </div>
                        {isCopyable && (
                          <button
                            onClick={() => copyToClipboard(value, key)}
                            className="flex items-center justify-center size-9 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">
                              {copiedField === key ? 'done' : 'content_copy'}
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export function StewardshipSection({ stewardshipQAs: propStewardshipQAs }: { stewardshipQAs?: StewardshipQA[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const qas = propStewardshipQAs && propStewardshipQAs.length > 0 ? propStewardshipQAs : stewardshipQAs;

  return (
    <section className="w-full py-28 bg-[#f8f4ef] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-16 lg:gap-24 items-start">

          {/* Left Column: Heading */}
          <div className="lg:sticky lg:top-28">
            <span className="text-[#e36520] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              Stewardship Q&A
            </span>
            <h2
              className="text-4xl md:text-6xl text-[#0c0818] mb-6 leading-[1.05] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-newsreader)' }}
            >
              Understanding <br />
              <em className="italic text-[#5b2d9c]">Generosity</em>
            </h2>
            <p className="text-[#7a6d8e] text-base leading-relaxed max-w-sm mb-8">
              Giving is not a transaction, but a heart posture of worship. Discover the biblical principles behind tithing, offerings, and Christian stewardship.
            </p>
            <div className="flex items-center gap-2.5 text-xs font-bold text-[#5b2d9c] uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">info</span>
              Click any question to learn more
            </div>
          </div>

          {/* Right Column: Q&A Accordion */}
          <div className="flex flex-col gap-4">
            {qas.map((qa, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={qa.question}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                    ? 'bg-white border-[#140d23]/8 shadow-lg shadow-[#140d23]/2'
                    : 'bg-white/45 border-[#140d23]/5 hover:bg-white/70'
                    }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-6 cursor-pointer select-none text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`size-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-[#5b2d9c] text-white' : 'bg-[#5b2d9c]/10 text-[#5b2d9c]'
                          }`}
                      >
                        <span className="material-symbols-outlined text-xl">{qa.icon}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#0c0818] font-sans">
                        {qa.question}
                      </h3>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="material-symbols-outlined text-[#7a6d8e]/60 flex-shrink-0 ml-4"
                    >
                      expand_more
                    </motion.span>
                  </button>
                  <div
                    className={`grid transition-all duration-350 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 pt-1 pl-20">
                        <p className="text-[#7a6d8e] text-sm leading-relaxed mb-4">
                          {qa.answer}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#5b2d9c]">
                          <span className="text-gray-400 font-bold uppercase tracking-wider mr-1">Scripture:</span>
                          <span className="bg-[#5b2d9c]/10 px-2.5 py-1 rounded-md font-mono font-bold">
                            {qa.biblicalRef}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
