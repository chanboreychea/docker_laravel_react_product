import { IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import echo from "../echo";
import ConfirmModal from "../components/ui/ConfirmModal";
import PageHeader from "../components/ui/PageHeader";

const API = "http://127.0.0.1:8000/api/products";

function ProductCRUD() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", qty: "" });
  const [editId, setEditId] = useState(null);

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // FETCH
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchProducts();

    echo.channel("products").listen(".product.event", (e) => {
      console.log("Realtime update:", e.product);
      fetchProducts(); // refresh table instantly
    });

    return () => {
      echo.leaveChannel("products");
    };
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form);
      } else {
        await axios.post(API, form);
      }
      setForm({ name: "", price: "", qty: "" });
      setEditId(null);
      fetchProducts();
    } catch (error) {
      console.error("Failed to save product", error);
    }
  };

  // EDIT
  const handleEdit = (product) => {
    setForm(product);
    setEditId(product.id);
  };

  // DELETE
  const promptDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await axios.delete(`${API}/${productToDelete.id}`);
      fetchProducts();
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  return (
    <>
      <PageHeader title="Product Management" />

      <div className="row row-cards">
        {/* FORM SECTION */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{editId ? "Update Product" : "Add New Product"}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label required">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="E.g. Wireless Mouse"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label required">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="price"
                    placeholder="E.g. 29.99"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label required">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="qty"
                    placeholder="E.g. 100"
                    value={form.qty}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-footer mt-4">
                  <button type="submit" className="btn btn-primary w-100">
                    {editId ? "Update Product" : "Save Product"}
                  </button>
                  {editId && (
                    <button 
                      type="button" 
                      className="btn btn-link w-100 mt-2" 
                      onClick={() => { setEditId(null); setForm({ name: "", price: "", qty: "" }); }}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Inventory</h3>
            </div>
            <div className="table-responsive">
              <table className="table card-table table-vcenter text-nowrap datatable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th className="w-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted p-4">
                        No products available. Add one to get started!
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id}>
                        <td><span className="text-muted">{p.id}</span></td>
                        <td>{p.name}</td>
                        <td>
                          ${Number(p.price).toFixed(2)}
                        </td>
                        <td>
                          <span className={`badge ${p.qty > 0 ? "bg-green-lt" : "bg-red-lt"}`}>
                            {p.qty}
                          </span>
                        </td>
                        <td>
                          <div className="btn-list flex-nowrap">
                            <button
                              className="btn btn-icon btn-outline-primary shadow-none"
                              onClick={() => handleEdit(p)}
                              title="Edit"
                            >
                              <IconEdit size={16} />
                            </button>
                            <button
                              className="btn btn-icon btn-outline-danger shadow-none"
                              onClick={() => promptDelete(p)}
                              title="Delete"
                            >
                              <IconTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* REUSABLE DELETE MODAL */}
      <ConfirmModal
        show={showDeleteModal}
        title="Are you sure?"
        message={
          <>
            Do you really want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Delete"
      />
    </>
  );
}

export default ProductCRUD;
