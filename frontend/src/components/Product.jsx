import axios from "axios";
import { useEffect, useState } from "react";
import echo from "../echo";

const API = "http://127.0.0.1:8000/api/products";

function ProductCRUD() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", qty: "" });
  const [editId, setEditId] = useState(null);

  // FETCH
  const fetchProducts = async () => {
    const res = await axios.get(API);
    setProducts(res.data);
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

    if (editId) {
      await axios.put(`${API}/${editId}`, form);
    } else {
      await axios.post(API, form);
    }

    setForm({ name: "", price: "", qty: "" });
    setEditId(null);
    fetchProducts();
  };

  // EDIT
  const handleEdit = (product) => {
    setForm(product);
    setEditId(product.id);
  };

  // DELETE
  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchProducts();
  };

  return (
    <div>
      <h2>Product CRUD</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="qty"
          placeholder="Qty"
          value={form.qty}
          onChange={handleChange}
          required
        />

        <button type="submit">{editId ? "Update" : "Create"}</button>
      </form>

      {/* TABLE */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.qty}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductCRUD;
