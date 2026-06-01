"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Package } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { FullPageSpinner } from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Product } from "@/types";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", short_desc: "", price: "", mrp: "",
    category: "boxer-brief" as string, sizes: "S,M,L,XL", material: "100% Cotton", stock: "100",
    badge: "" as string, images: [] as string[],
  });

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/products?limit=100");
    const data = await res.json();
    if (data.success) setProducts(data.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", short_desc: "", price: "", mrp: "", category: "boxer-brief", sizes: "S,M,L,XL", material: "100% Cotton", stock: "100", badge: "", images: [] });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name, slug: product.slug, description: product.description, short_desc: product.short_desc,
      price: String(product.price), mrp: String(product.mrp), category: product.category,
      sizes: product.sizes.join(","), material: product.material || "", stock: String(product.stock),
      badge: product.badge || "", images: product.images,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      description: form.description, short_desc: form.short_desc,
      price: parseInt(form.price), mrp: parseInt(form.mrp),
      category: form.category, sizes: form.sizes.split(",").map(s => s.trim()),
      colors: [{ name: "Default", hex: "#0A0A0A" }], material: form.material,
      stock: parseInt(form.stock), badge: form.badge || null, images: form.images,
    };

    const url = editing ? `/api/products/${editing.slug}` : "/api/products";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();

    if (data.success) {
      toast.success(editing ? "Product updated" : "Product created");
      setShowModal(false);
      fetchProducts();
    } else {
      toast.error(data.error || "Failed");
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { toast.success("Product deleted"); fetchProducts(); }
    else toast.error(data.error || "Delete failed");
  };

  if (loading) return <FullPageSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-cream font-heading text-3xl tracking-widest">PRODUCTS</h1>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Product</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              {product.images[0] ? (
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-charcoal flex items-center justify-center"><span className="text-red/20 font-heading text-4xl">K</span></div>
              )}
              {product.badge && (
                <div className={cn("absolute top-2 left-2 px-2 py-0.5 text-[10px] font-heading tracking-widest",
                  product.badge === "BESTSELLER" && "bg-red text-cream",
                  product.badge === "NEW" && "bg-cream text-black",
                  product.badge === "LIMITED" && "bg-gold text-black")}>{product.badge}</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-cream text-sm font-body font-medium mb-1">{product.name}</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-cream font-mono text-sm">{formatPrice(product.price)}</span>
                <span className="text-silver/30 text-xs font-body">Stock: {product.stock}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(product)} className="flex-1 border border-border text-silver hover:text-cream hover:border-silver text-xs font-body py-1.5 flex items-center justify-center gap-1 transition-colors">
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => handleDelete(product.slug)} className="border border-border text-silver hover:text-red hover:border-red text-xs font-body py-1.5 px-3 flex items-center justify-center transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-border mx-auto mb-4" />
          <p className="text-cream font-heading text-xl tracking-widest">NO PRODUCTS</p>
        </div>
      )}

      {/* Product Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "Edit Product" : "Add Product"} size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <Input label="Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated if empty" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (paise)" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} placeholder="49900 = ₹499" />
            <Input label="MRP (paise)" value={form.mrp} onChange={(e) => setForm(f => ({ ...f, mrp: e.target.value }))} placeholder="69900 = ₹699" />
          </div>
          <Input label="Short Description" value={form.short_desc} onChange={(e) => setForm(f => ({ ...f, short_desc: e.target.value }))} />
          <div>
            <label className="text-cream text-xs font-heading tracking-widest mb-2 block">Description</label>
            <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full bg-card border border-border text-cream px-3 py-2 text-sm font-body placeholder:text-silver/30 focus:outline-none focus:border-red" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-cream text-xs font-heading tracking-widest mb-2 block">Category</label>
              <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-card border border-border text-cream px-3 py-2 text-sm font-body focus:outline-none focus:border-red">
                <option value="boxer-brief">Boxer Brief</option>
                <option value="trunk">Trunk</option>
                <option value="brief">Brief</option>
                <option value="pack">Pack</option>
              </select>
            </div>
            <Input label="Stock" value={form.stock} onChange={(e) => setForm(f => ({ ...f, stock: e.target.value }))} />
          </div>
          <Input label="Sizes (comma-separated)" value={form.sizes} onChange={(e) => setForm(f => ({ ...f, sizes: e.target.value }))} />
          <Input label="Material" value={form.material} onChange={(e) => setForm(f => ({ ...f, material: e.target.value }))} />
          <div>
            <label className="text-cream text-xs font-heading tracking-widest mb-2 block">Badge</label>
            <select value={form.badge} onChange={(e) => setForm(f => ({ ...f, badge: e.target.value }))} className="w-full bg-card border border-border text-cream px-3 py-2 text-sm font-body focus:outline-none focus:border-red">
              <option value="">None</option>
              <option value="NEW">NEW</option>
              <option value="BESTSELLER">BESTSELLER</option>
              <option value="LIMITED">LIMITED</option>
            </select>
          </div>
          <div>
            <label className="text-cream text-xs font-heading tracking-widest mb-2 block">Images</label>
            <ImageUploader images={form.images} onChange={(images) => setForm(f => ({ ...f, images }))} />
          </div>
          <Button variant="primary" className="w-full" onClick={handleSubmit}>{editing ? "Update Product" : "Create Product"}</Button>
        </div>
      </Modal>
    </div>
  );
}
