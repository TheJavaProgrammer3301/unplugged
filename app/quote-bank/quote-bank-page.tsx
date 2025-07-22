import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { SanitizedUserData } from "workers/read-api";
import { allQuotes } from "workers/shared";
import "~/index.scss";
import "./quote-bank-page.css";

function shuffleArray<T>(array: T[]): T[] {
	const newArr = [...array];
	for (let i = newArr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArr[i], newArr[j]] = [newArr[j], newArr[i]];
	}
	return newArr;
}

export default function QuoteBankPage({ accountInfo }: { accountInfo: SanitizedUserData | null }) {
	const [filter, setFilter] = useState("all");
	const [gems, setGems] = useState(accountInfo?.diamonds ?? 0);
	const [unlockedTexts, setUnlockedTexts] = useState<string[]>(accountInfo?.savedQuotes ?? []);
	const navigate = useNavigate();

	const filteredQuotes = useMemo(() => {
		const filtered =
			filter === "all" ? allQuotes : allQuotes.filter((q) => q.category === filter);
		return shuffleArray(filtered);
	}, [filter]);

	const handleUnlock = async (quoteText: string) => {
		if (gems >= 10 && !unlockedTexts.includes(quoteText)) {
			await fetch("/api/quotes", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ quote: quoteText }),
			});

			setGems((g) => g - 10);
			setUnlockedTexts((prev) => [...prev, quoteText]);
		}
	};

	return (
		<div className="quote-page-wrapper">
			<div className="phone-container">
				<div className="quote-bank-header">
					<div className="back-button-container">
						<button className="back-button" onClick={() => navigate("/dashboard")}>
							← Back
						</button>
					</div>
					<h1>Quote Bank</h1>
				</div>

				<div className="gem-display">💎 Gems: {gems}</div>

				<div className="sort-controls">
					<label htmlFor="sort-select">Filter:</label>
					<select
						id="sort-select"
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
					>
						<option value="all">All</option>
						<option value="motivation">Motivation</option>
						<option value="acceptance">Acceptance</option>
						<option value="loss">Loss</option>
						<option value="loneliness">Loneliness</option>
					</select>
				</div>

				<div className="quote-list">
					{filteredQuotes.map((quote, index) => {
						const isUnlocked = unlockedTexts.includes(quote.text);
						return (
							<div key={index} className={`quote-card ${quote.category}`}>
								{isUnlocked ? (
									<span className="quote-text">{quote.text}</span>
								) : (
									<div className="locked-quote">
										<button onClick={() => handleUnlock(quote.text)}>
											🔒 Unlock for 10 💎
										</button>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

