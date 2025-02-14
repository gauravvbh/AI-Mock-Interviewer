"use client";

import { usePathname } from "next/navigation";
import Header from "../dashboard/_components/Header";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const authRoutes = ["/sign-in", "/sign-up"];

    return (
        <>
            {!authRoutes.includes(pathname) && <Header />}
            {children}
        </>
    );
}
