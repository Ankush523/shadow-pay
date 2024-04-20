import Image from "next/image";
import { Inter } from "next/font/google";
import Homepage from "./Homepage";
import Navbar from "./Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <Navbar/>
      <Homepage/>
    </main>
  );
}
