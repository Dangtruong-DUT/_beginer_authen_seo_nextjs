"use client";
import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/mode-toggle";
import { clientSessionToken } from "@/lib/http";
import Link from "next/link";
import { useEffect } from "react";

function Header() {
    let isAuthenticated = false;
    useEffect(() => {
        if (clientSessionToken.value) {
            isAuthenticated = true;
        } else {
            isAuthenticated = false;
        }
    }, []);
    return (
        <div className="flex justify-between p-[1rem] p-x[5rem] ">
            <ul className="flex gap-[2rem]">
                {isAuthenticated ? (
                    <>
                        <li>
                            <Link href="/auth/login">Login</Link>
                        </li>

                        <li>
                            <Link href="/auth/register">Register</Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link href="/products/add">Add new product</Link>
                        </li>
                        <li>
                            <Link href="/products"> product</Link>
                        </li>
                        <li>
                            <ButtonLogout />
                        </li>
                    </>
                )}
            </ul>
            <ModeToggle />
        </div>
    );
}

export default Header;
