import { useEffect, useState } from "react";
import "~/index.scss";
import "./mind-bank-page.css";

const challenges = [
  "No phone for 24 hours<br>Your streak will be saved",
  "Write in your journal",
  "Take a long walk",
  "Practice gratitude",
  "Do a digital detox",
  "Compliment 3 people",
  "Meditate for 10 minutes",
  "Drink only water today",
];

const MindBankPage = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [canSpin, setCanSpin] = useState(true);

  const anglePerSlice = 360 / challenges.length;

  useEffect(() => {
    const lastSpinDate = localStorage.getItem("lastSpinDate");
    const today = new Date().toDateString();
    if (lastSpinDate === today) {
      setCanSpin(false);
    }
  }, []);

  const spinWheel = () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    const randomSlice = Math.floor(Math.random() * challenges.length);
    const fullSpins = 5;
    const finalAngle = fullSpins * 360 + randomSlice * anglePerSlice;

    setRotation(finalAngle);

    setTimeout(() => {
      setSelectedChallenge(challenges[randomSlice]);
      setIsSpinning(false);
      localStorage.setItem("lastSpinDate", new Date().toDateString());
      setCanSpin(false);
      setRotation(randomSlice * anglePerSlice); // Normalize
    }, 3500);
  };

  return (
    <div className="app-wrapper">
      <div className="phone-container mind-bank">
        <div className="top-bar">
          <div className="back-button-container">
            <button className="back-button" onClick={() => window.history.back()}>
              ← Back
            </button>
          </div>
          <h1 className="mind-title">Mind Bank</h1>
        </div>

        <div className="wheel-wrapper">
          <div
            className={`wheel ${isSpinning ? "spinning" : ""}`}
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {challenges.map((_, index) => (
              <div
                key={index}
                className="wheel-slice"
                style={{ transform: `rotate(${index * anglePerSlice}deg)` }}
              />
            ))}
          </div>
          <div className="wheel-arrow">▼</div>
        </div>

        <button className="spin-button" onClick={spinWheel} disabled={!canSpin}>
          {canSpin ? "Spin for Challenge" : "Come Back Tomorrow!"}
        </button>

        <div className="challenge-box">
          <h2>Challenge</h2>
          <p>{selectedChallenge || "Spin the wheel to receive a challenge!"}</p>
        </div>
      </div>
    </div>
  );
};

export default MindBankPage;
