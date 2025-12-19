import { PublicNav } from '@/components/public-nav';
// import { PublicFooter } from "@/components/public-footer"
import { WelcomeScreen } from '@/components/welcome-screen';

export default function HomePage() {
  return (
    <>
      <PublicNav />
      <WelcomeScreen />
      {/* <PublicFooter /> */}
    </>
  );
}
