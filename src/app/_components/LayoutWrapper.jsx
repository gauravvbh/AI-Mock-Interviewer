"use client";

import { usePathname } from "next/navigation";
import Header from "../dashboard/_components/Header";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    // const authRoutes = ["/sign-in", "/sign-up"];
    // const isAuthPage = authRoutes.some(route => pathname.startsWith(route));
    const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

    return (
        <>
            {!isAuthPage && <Header />}
            {children}
        </>
    );
}
