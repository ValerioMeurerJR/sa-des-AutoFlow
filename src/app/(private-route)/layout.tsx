import { Navigation } from "@/components/Navigation";
import ProtectedPage from "@/components/ProtectedPage";
import "./styles.css";
export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="layout">
            <Navigation />
            <ProtectedPage />
            {children}
        </div>
    )
}