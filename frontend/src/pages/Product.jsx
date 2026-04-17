import { IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import echo from "../echo";
import ConfirmModal from "../components/ui/ConfirmModal";
import PageHeader from "../components/ui/PageHeader";

const API = "http://127.0.0.1:8000/api/products";

function ProductCRUD() {
  const { t } = useTranslation();
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
      <PageHeader title={t("product_management")} />

      <div className="row row-cards">
        {/* FORM SECTION */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{editId ? t("update_product") : t("add_new_product")}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label required">{t("product_name")}</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder={t("product_name_placeholder")}
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label required">{t("price")}</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="price"
                    placeholder={t("price_placeholder")}
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label required">{t("qty")}</label>
                  <input
                    type="number"
                    className="form-control"
                    name="qty"
                    placeholder={t("qty_placeholder")}
                    value={form.qty}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-footer mt-4">
                  <button type="submit" className="btn btn-primary w-100">
                    {editId ? t("update_product") : t("save_product")}
                  </button>
                  {editId && (
                    <button 
                      type="button" 
                      className="btn btn-link w-100 mt-2" 
                      onClick={() => { setEditId(null); setForm({ name: "", price: "", qty: "" }); }}
                    >
                      {t("cancel_edit")}
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
              <h3 className="card-title">{t("inventory")}</h3>
            </div>
            <div className="table-responsive">
              <table className="table card-table table-vcenter text-nowrap datatable">
                <thead>
                  <tr>
                    <th>{t("id")}</th>
                    <th>{t("name")}</th>
                    <th>{t("price_col")}</th>
                    <th>{t("qty_col")}</th>
                    <th className="w-1">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted p-4">
                        {t("no_products")}
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
        title={t("are_you_sure")}
        message={
          <>
            {t("really_want_delete", { name: productToDelete?.name })} {t("cannot_be_undone")}
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText={t("delete")}
        cancelText={t("cancel")}
      />
    </>
  );
}

export default ProductCRUD;
