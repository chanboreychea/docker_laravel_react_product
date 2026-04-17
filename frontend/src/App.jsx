import MasterLayout from "./layouts/MasterLayout";
import Product from "./pages/Product";

function App() {
  // Change layoutType to "sidebar" or "navbar" to switch between layouts dynamically!
  return (
    <MasterLayout layoutType="navbar">
      <Product />
    </MasterLayout>
  );
}

export default App;
