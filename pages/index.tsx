import Image from "next/image";
import { Inter } from "next/font/google";
import EncryptWalletAddress from "./encrypt";
import DecryptWalletAddress from "./decrypt";
import Homepage from "./Homepage";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      {/* <EncryptWalletAddress/>
      <DecryptWalletAddress/> */}
      <Homepage/>
    </main>
  );
}
