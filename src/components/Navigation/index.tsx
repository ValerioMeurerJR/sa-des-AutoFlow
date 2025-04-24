"use client"
import logo from "@/assests/backgroudlogo.jpg"
import Image from "next/image";
import "./styles.css"
import { CiViewList } from "react-icons/ci";
import { MdDashboard, MdHighQuality } from "react-icons/md";
import { RiStockFill } from "react-icons/ri";
import { FaCar, FaClipboardList } from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { GiAutoRepair } from "react-icons/gi";
import Link from "next/link";
import { usePathname } from "next/navigation"

export function Navigation() {
    const pathName = usePathname();

    const ListaPage = [
        {
            label: 'Dashboard',
            page: '/dashboard',
            icon: <MdDashboard />
        },
        {
            label: 'Qualidade',
            page: '/qualidade',
            icon: <MdHighQuality />
        },
        {
            label: 'Estoque',
            page: '/estoque',
            icon: <RiStockFill />
        },
        {
            label: 'Producão',
            page: '/product_car',
            icon: <FaCar />
        },
        {
            label: 'RH',
            page: '/rh',
            icon: <GrResources />
        },
        {
            label: 'Mecanica',
            page: '/mecanica',
            icon: <GiAutoRepair />
        }
    ]
    return (
        <aside>
            <div className="cont">
                <header>
                    <div>
                        <Image src={logo} alt="logo" className="logo" />
                        <h2>AutoFlow</h2>
                    </div>
                </header>
                <nav className="menu-group">
                    {
                        ListaPage.map(item => (
                            <Link
                                key={item.page}
                                className={`menu-item ${pathName === item.page ? "selected" : ""}`}
                                href={item.page}
                                title={item.label}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))
                    }
                </nav>
            </div>
        </aside>
    )
}