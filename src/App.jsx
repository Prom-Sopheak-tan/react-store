import React, { useState } from "react";

const PRODUCTS = [
  {
    id: 1,
    name: "Laptop",
    price: 650,
    category: "Computers & Workstations",
    badge: "Best Seller",
    specs: "16GB RAM • 512GB SSD",
    description:
      "14-inch ultra-light performance laptop with 16GB RAM, 512GB NVMe SSD, and full-day battery life.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Mouse",
    price: 15,
    category: "Accessories & Peripherals",
    badge: "Everyday Essential",
    specs: "2400 DPI • Ergonomic",
    description:
      "Ergonomic wireless optical mouse with precision tracking, silent clicks, and contoured grip.",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Keyboard",
    price: 25,
    category: "Accessories & Peripherals",
    badge: "Popular",
    specs: "Tactile Keys • Compact",
    description:
      "Responsive compact keyboard designed for fast typing, clean desk setup, and everyday durability.",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Monitor",
    price: 120,
    category: "Displays",
    badge: "Sharp View",
    specs: "24-inch FHD • IPS",
    description:
      "Crisp 24-inch Full HD IPS monitor with slim bezels, wide viewing angles, and eye-care mode.",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
  },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80";

const SHIPPING_METHODS = [
  {
    id: "free",
    label: "Free Shipping",
    duration: "7-20 Days",
    cost: 0,
  },
  {
    id: "express",
    label: "Express Shipping",
    duration: "1-3 Days",
    cost: 9,
  },
];

const formatMoney = (amount) => `$${Number(amount).toFixed(2)}`;

export default function App() {
  const [step, setStep] = useState("shop"); // "shop" | "cart" | "checkout" | "confirmation"
  const [cart, setCart] = useState([]);
  const [shippingMethodId, setShippingMethodId] = useState("free");

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [orderSummary, setOrderSummary] = useState(null);

  const totalItemsInCart = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const selectedShipping =
    SHIPPING_METHODS.find((m) => m.id === shippingMethodId) ||
    SHIPPING_METHODS[0];
  const shippingFee = cart.length > 0 ? selectedShipping.cost : 0;
  const grandTotal = subtotal + shippingFee;

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const handleUpdateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCustomerChange = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateCheckout = () => {
    const nextErrors = {};
    if (!customer.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }
    if (!customer.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }
    if (!customer.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!customer.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    }
    if (!customer.address.trim()) {
      nextErrors.address = "Address is required.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!validateCheckout()) return;

    const now = new Date();
    const formattedDate = now.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    setOrderSummary({
      message: "Order Placed Successfully!",
      orderId: "ORD-0001",
      customerName: `${customer.firstName.trim()} ${customer.lastName.trim()}`,
      email: customer.email.trim(),
      phone: customer.phone.trim(),
      address: customer.address.trim(),
      shippingMethod: selectedShipping,
      orderDate: formattedDate,
      items: cart.map((item) => ({ ...item })),
      subtotal,
      shippingFee,
      totalAmount: grandTotal,
      status: "Pending",
    });

    setCart([]);
    setStep("confirmation");
  };

  const handleStartNewOrder = () => {
    setCustomer({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
    });
    setErrors({});
    setShippingMethodId("free");
    setOrderSummary(null);
    setStep("shop");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => setStep("shop")}
            className="text-left"
          >
            <span className="text-xl font-bold tracking-tight text-slate-900">
              TechStore
            </span>
            <span className="ml-2 text-xs font-medium text-slate-500">
              React E-Commerce Exercise
            </span>
          </button>

          <nav className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setStep("shop")}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                step === "shop"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Products (ផលិតផល)
            </button>

            <button
              type="button"
              onClick={() => setStep("cart")}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                step === "cart"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Shopping Cart ({totalItemsInCart})
            </button>

            <button
              type="button"
              onClick={() => {
                if (cart.length > 0) setStep("checkout");
                else setStep("cart");
              }}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                step === "checkout"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Checkout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* EXERCISE 1: PRODUCT CATALOG */}
        {step === "shop" && (
          <section>
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Practical Exercise 1 • បង្ហាញផលិតផលទាំង ៤
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Featured Products
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Select products and click{" "}
                  <span className="font-semibold text-slate-800">
                    Add to Cart
                  </span>{" "}
                  to build your order.
                </p>
              </div>

              {totalItemsInCart > 0 && (
                <button
                  type="button"
                  onClick={() => setStep("cart")}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  View Cart ({totalItemsInCart}) • {formatMoney(subtotal)}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCTS.map((product) => {
                const inCart = cart.find((item) => item.id === product.id);
                return (
                  <article
                    key={product.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                          {product.category}
                        </span>
                        <span className="font-medium text-slate-500">
                          {product.badge}
                        </span>
                      </div>

                      <div className="mt-3 flex items-baseline justify-between gap-2">
                        <h2 className="text-lg font-bold text-slate-900">
                          {product.name}
                        </h2>
                        <span className="text-lg font-bold text-slate-900">
                          {formatMoney(product.price)}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {product.specs}
                      </p>

                      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">
                        {product.description}
                      </p>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
                      >
                        Add to Cart{inCart ? ` (${inCart.qty} in cart)` : ""}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* EXERCISE 1 (PART 2): SHOPPING CART PAGE */}
        {step === "cart" && (
          <section>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Shopping Cart • View Cart, Update QTY, Remove & Totals
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Your Shopping Cart
                </h1>
              </div>

              <button
                type="button"
                onClick={() => setStep("shop")}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ← Continue Shopping
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <img
                  src={PRODUCTS[0].image}
                  alt="Empty cart preview"
                  className="mx-auto h-36 w-52 rounded-xl object-cover"
                />
                <h2 className="mt-4 text-lg font-bold text-slate-900">
                  Your cart is currently empty
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add products from the catalog to calculate subtotal and proceed
                  to checkout.
                </p>
                <button
                  type="button"
                  onClick={() => setStep("shop")}
                  className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Cart Items List */}
                <div className="space-y-4 lg:col-span-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_IMAGE;
                          }}
                          className="h-20 w-24 shrink-0 rounded-xl object-cover bg-slate-100"
                        />
                        <div>
                          <h3 className="text-base font-bold text-slate-900">
                            {item.name}
                          </h3>
                          <p className="text-xs text-slate-500">{item.specs}</p>
                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            Unit Price: {formatMoney(item.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        {/* Update QTY */}
                        <div className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-50">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, -1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-200 rounded-l-lg"
                          >
                            −
                          </button>
                          <span className="min-w-[2.25rem] text-center text-sm font-semibold text-slate-900">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-200 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Line Total */}
                        <div className="min-w-[5rem] text-right text-sm font-bold text-slate-900">
                          {formatMoney(item.price * item.qty)}
                        </div>

                        {/* Remove Item */}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900">
                    Cart Summary
                  </h2>

                  <div className="mt-4 space-y-3 border-b border-slate-200 pb-4 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({totalItemsInCart} items)</span>
                      <span className="font-semibold text-slate-900">
                        {formatMoney(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping ({selectedShipping.label})</span>
                      <span className="font-semibold text-slate-900">
                        {formatMoney(shippingFee)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-base font-bold text-slate-900">
                      Grand Total
                    </span>
                    <span className="text-xl font-bold text-slate-900">
                      {formatMoney(grandTotal)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep("checkout")}
                    className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Proceed to Checkout
                  </button>
                </aside>
              </div>
            )}
          </section>
        )}

        {/* EXERCISE 2: CHECKOUT FORM & ORDER SUMMARY */}
        {step === "checkout" && (
          <section>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Practical Exercise 2 • Customer Form, Validation & Shipping
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Checkout
                </h1>
              </div>

              <button
                type="button"
                onClick={() => setStep("cart")}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ← Back to Cart
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <p className="text-sm text-slate-600">
                  Your cart is empty. Add items before checking out.
                </p>
                <button
                  type="button"
                  onClick={() => setStep("shop")}
                  className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Go to Products
                </button>
              </div>
            ) : (
              <form
                onSubmit={handlePlaceOrder}
                noValidate
                className="grid grid-cols-1 gap-8 lg:grid-cols-3"
              >
                {/* Customer & Shipping Form */}
                <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Customer Information
                    </h2>
                    <p className="text-xs text-slate-500">
                      All fields below are required.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={customer.firstName}
                        onChange={(e) =>
                          handleCustomerChange("firstName", e.target.value)
                        }
                        placeholder="Dara"
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={customer.lastName}
                        onChange={(e) =>
                          handleCustomerChange("lastName", e.target.value)
                        }
                        placeholder="Sok"
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {errors.lastName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={customer.email}
                        onChange={(e) =>
                          handleCustomerChange("email", e.target.value)
                        }
                        placeholder="dara.sok@example.com"
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={(e) =>
                          handleCustomerChange("phone", e.target.value)
                        }
                        placeholder="012 345 678"
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Address *
                    </label>
                    <textarea
                      rows={3}
                      value={customer.address}
                      onChange={(e) =>
                        handleCustomerChange("address", e.target.value)
                      }
                      placeholder="Street, Sangkat, Khan, Phnom Penh"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs font-medium text-red-600">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Shipping Method */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Shipping Method
                    </h3>
                    <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {SHIPPING_METHODS.map((method) => {
                        const active = shippingMethodId === method.id;
                        return (
                          <label
                            key={method.id}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${
                              active
                                ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="shippingMethod"
                                checked={active}
                                onChange={() => setShippingMethodId(method.id)}
                                className="h-4 w-4 accent-slate-900"
                              />
                              <div>
                                <div className="text-sm font-semibold text-slate-900">
                                  {method.label}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {method.duration}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                              {formatMoney(method.cost)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Order Summary Sidebar */}
                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900">
                    Order Summary
                  </h2>

                  <div className="mt-4 divide-y divide-slate-100">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_IMAGE;
                            }}
                            className="h-12 w-14 rounded-lg object-cover bg-slate-100"
                          />
                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {item.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              Qty: {item.qty} × {formatMoney(item.price)}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {formatMoney(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 space-y-2 border-t border-slate-200 pt-4 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-slate-900">
                        {formatMoney(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping ({selectedShipping.label})</span>
                      <span className="font-medium text-slate-900">
                        {formatMoney(shippingFee)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                      <span>Grand Total</span>
                      <span>{formatMoney(grandTotal)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Place Order
                  </button>
                </aside>
              </form>
            )}
          </section>
        )}

        {/* EXERCISE 3: ORDER CONFIRMATION */}
        {step === "confirmation" && orderSummary && (
          <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-200 pb-5">
              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                Order Status: {orderSummary.status}
              </span>
              <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                {orderSummary.message}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Order ID:{" "}
                <span className="font-bold text-slate-900">
                  {orderSummary.orderId}
                </span>
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
              <div>
                <div className="text-xs font-medium text-slate-500">
                  Customer Name
                </div>
                <div className="mt-0.5 font-semibold text-slate-900">
                  {orderSummary.customerName}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-slate-500">
                  Order Date
                </div>
                <div className="mt-0.5 font-semibold text-slate-900">
                  {orderSummary.orderDate}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-slate-500">
                  Contact
                </div>
                <div className="mt-0.5 text-slate-800">
                  {orderSummary.email} • {orderSummary.phone}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-slate-500">
                  Shipping Address & Method
                </div>
                <div className="mt-0.5 text-slate-800">
                  {orderSummary.address} ({orderSummary.shippingMethod.label})
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Ordered Products
              </h2>
              <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 px-4">
                {orderSummary.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="h-12 w-14 rounded-lg object-cover bg-slate-100"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.qty} × {formatMoney(item.price)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {formatMoney(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatMoney(orderSummary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>{formatMoney(orderSummary.shippingFee)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900">
                <span>Total Amount</span>
                <span>{formatMoney(orderSummary.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-600">Order Status</span>
                <span className="font-bold text-amber-700">
                  {orderSummary.status}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartNewOrder}
              className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Place Another Order
            </button>
          </section>
        )}
      </main>
      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:px-6">
          <div>
            <span className="font-bold text-slate-900">TechStore</span> • Laptop ($650), Mouse ($15), Keyboard ($25), Monitor ($120)
          </div>
          <div className="text-xs text-slate-500">
            React E-Commerce Exercise • Shopping Cart, Checkout & Order Confirmation
          </div>
        </div>
      </footer>
    </div>
  );
}