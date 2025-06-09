"use client"
import logo from "@/assests/backgroudlogo.jpg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCar } from "react-icons/fa";
import { GiAutoRepair } from "react-icons/gi";
import { GrResources } from "react-icons/gr";
import { MdDashboard, MdHighQuality } from "react-icons/md";
import { RiStockFill } from "react-icons/ri";
import "./styles.css";

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
            label: 'Manutenção',
            page: '/manutencao',
            icon: <GiAutoRepair />
        }
    ]
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        window.location.href = '/';
    };

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
                    <button className="logout-button" onClick={handleLogout}>
                        🚪 Sair
                    </button>
                </nav>
            </div>
        </aside>
    )
}