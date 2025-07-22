import type { SanitizedUserData } from "workers/read-api";
import { getCategoryFromQuote } from "workers/shared";
import "~/index.scss";
import "./saved-quotes-page.css";

export default function SavedQuotesPage({ accountInfo }: { accountInfo: SanitizedUserData | null }) {
	return (
		<div className="app-wrapper">
			<div className="phone-container saved-quotes">
				<div className="top-bar">
					<div className="back-button-container">
						<button className="back-button" onClick={() => window.history.back()}>
							← Back
						</button>
					</div>
					<h1 className="mind-title">Saved Quotes</h1>
				</div>

				<div className="quote-list">
					{accountInfo?.savedQuotes.map((quote, i) => (
						<div key={i} className={`quote-card ${getCategoryFromQuote(quote)}`}>
							{quote}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
