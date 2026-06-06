import SeekerSidebar from '@/components/SeekerSidebar';
import RoleSwitcher from '@/components/RoleSwitcher';

export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#121b30] flex font-body-md antialiased">
      {/* Seeker sidebar fixed on the left */}
      <SeekerSidebar />

      {/* Main content wrapper on the right */}
      <div className="flex-1 lg:pl-[260px] flex flex-col min-h-screen">
        <div className="flex-1 w-full max-w-[1440px] mx-auto">
          {children}
        </div>
      </div>

      {/* Floating role switcher */}
      <RoleSwitcher />
    </div>
  );
}
