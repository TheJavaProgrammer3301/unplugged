import React from "react";
import "./shop-page.css";
import "~/index.scss";

interface GemBundle {
  price: number;
  gems: number;
}

const bundles: GemBundle[] = [
  { price: 5, gems: 500 },
  { price: 10, gems: 1050 },
  { price: 25, gems: 2750 },
  { price: 50, gems: 5750 },
  { price: 100, gems: 12000 },
];

export default function ShopPage() {
  const handleBuy = (bundle: GemBundle) => {
    alert(`Purchased ${bundle.gems} gems for $${bundle.price}!`);
    // insert payment integration logic here
  };

  return (
    <div className="app-wrapper">
      <div className="phone-container shop-page">
        <div className="top-bar">
          <button className="back-button" onClick={() => window.history.back()}>
            ← Back
          </button>
          <h1 className="page-title">Gem Shop</h1>
        </div>

        <div className="gem-balance">
          💎 Current Gems: 0
        </div>

        <div className="shop-list">
          {bundles.map((bundle, i) => (
            <div key={i} className="bundle-card">
              <div className="bundle-info">
                <h2>{bundle.gems.toLocaleString()} Gems</h2>
                <p>${bundle.price.toFixed(2)}</p>
              </div>
              <button className="buy-button" onClick={() => handleBuy(bundle)}>
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
