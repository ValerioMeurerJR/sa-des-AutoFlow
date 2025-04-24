import { Navigation } from "@/components/Navigation";
import "./styles.css"
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="layout">
            <Navigation />
            {children}
        </div>
    )
}