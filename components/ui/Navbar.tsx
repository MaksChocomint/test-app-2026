import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="border-b border-brand-mint-light bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/logo.webp"
              alt="HappyPets Logo"
              width={40}
              height={40}
              className="group-hover:rotate-12 transition-transform"
            />
            <span className="text-2xl font-black text-brand-dark tracking-tight">
              Happy<span className="text-brand-mint">Pets</span>
            </span>
          </Link>

          <div className="flex-1" />

          <span className="text-sm font-bold text-brand-dark/60">
            Система управления ветеринарной клиникой
          </span>
        </div>
      </div>
    </nav>
  );
}
