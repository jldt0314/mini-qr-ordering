import MenuCard from "./MenuCard";

// Mock data — we replace this with a real API call in Step 4
const MOCK_PRODUCTS = [
  { id: 1, name: "Cheeseburger",     description: "Beef patty with cheddar, lettuce, tomato",          price: 129.00 },
  { id: 2, name: "Chicken Sandwich", description: "Crispy chicken fillet with mayo and pickles",        price: 119.00 },
  { id: 3, name: "Loaded Fries",     description: "Crinkle-cut fries with cheese sauce and bacon",     price: 89.00  },
  { id: 4, name: "Iced Coffee",      description: "Cold brew with milk and light sugar",                price: 69.00  },
  { id: 5, name: "Bottled Water",    description: "Still mineral water 500ml",                          price: 35.00  },
];

export default function MenuList() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4">
      {MOCK_PRODUCTS.map((product) => (
        <MenuCard key={product.id} product={product} />
      ))}
    </div>
  );
}