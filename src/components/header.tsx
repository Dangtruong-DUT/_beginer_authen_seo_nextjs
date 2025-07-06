import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/mode-toggle";
import { cookies } from "next/headers";
import Link from "next/link";

async function Header() {
    const cookieStorage = await cookies();
    const sessionToken = cookieStorage.get("sessionToken")?.value || null;
    return (
        <div className="flex justify-between p-[1rem] p-x[5rem] ">
            <ul className="flex gap-[2rem]">
                {sessionToken == null ? (
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
