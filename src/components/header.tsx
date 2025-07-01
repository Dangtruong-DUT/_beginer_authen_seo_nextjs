import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

function Header() {
    return (
        <div className="flex justify-between p-[1rem] p-x[5rem] ">
            <ul className="flex gap-[2rem]">
                <li>
                    <Link href="/auth/login">Login</Link>
                </li>
                <li>
                    <Link href="/auth/register">Register</Link>
                </li>
            </ul>
            <ModeToggle />
        </div>
    );
}

export default Header;
