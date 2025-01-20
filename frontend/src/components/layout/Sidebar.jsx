import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background px-4 py-6">
      <div className="flex items-center gap-2 px-2">
        <Package className="h-6 w-6" />
        <span className="text-lg font-semibold">Product Manager</span>
      </div>
      <nav className="mt-8 flex flex-1 flex-col gap-2">
        <Link to="/products">
          <Button
            variant={location.pathname === "/products" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Package className="mr-2 h-4 w-4" />
            Products
          </Button>
        </Link>
      </nav>
      <Button
        variant="ghost"
        className="justify-start"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
} 