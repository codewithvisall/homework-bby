import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import ProductTable from "@/components/products/ProductTable";
import ProductForm from "@/components/products/ProductForm";
import { useNavigate } from "react-router-dom";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data);
    } catch (error) {
      console.error('Fetch products error:', error.response?.data);
      
      // If token is invalid, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please login again",
        });
        return;
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch products",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, data);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await api.post("/products", data);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }
      fetchProducts();
      handleCloseForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Operation failed",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      fetchProducts();
    } catch (error) {
      console.error('Delete product error:', error.response?.data);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to delete product",
      });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <ProductForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        product={editingProduct}
      />
    </div>
  );
} 