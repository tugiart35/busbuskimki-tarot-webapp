"use client";

import React, { useState, useEffect } from "react";
import {
	FaShieldAlt,
	FaExclamationTriangle,
	FaCheckCircle,
	FaTimes,
} from "react-icons/fa";
import Link from "next/link";

interface AgeVerificationModalProps {
	locale: "tr" | "en" | "sr";
}

const AGE_VERIFIED_KEY = "busbuskimki_age_verified";

export default function AgeVerificationModal({
	locale,
}: AgeVerificationModalProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [isConfirming, setIsConfirming] = useState(false);
	const [showError, setShowError] = useState(false);

	useEffect(() => {
		// Check if user has already verified their age
		const verified = localStorage.getItem(AGE_VERIFIED_KEY);
		if (!verified) {
			// Show modal after page load
			setTimeout(() => setIsVisible(true), 500);
		}
	}, []);

	const getContent = () => {
		switch (locale) {
			case "tr":
				return {
					icon: "🔞",
					title: "Yaş Doğrulama",
					subtitle: "18+ İçerik Uyarısı",
					message:
						"Bu site, tarot falı ve kişisel gelişim içerikleri sunmaktadır. Hizmetlerimizi kullanabilmek için 18 yaş ve üzeri olmalısınız.",
					requirements: [
						"18 yaş ve üzeri olmalısınız",
						"Yasal olarak yetişkin sayılmalısınız",
						"Bu içeriğe erişim yetkisine sahip olmalısınız",
					],
					disclaimer:
						"Bu site eğlence ve kişisel gelişim amaçlıdır. Profesyonel tavsiye yerine geçmez.",
					confirmButton: "Evet, 18 Yaşından Büyüğüm",
					declineButton: "Hayır, 18 Yaşından Küçüğüm",
					errorMessage:
						"Üzgünüz, bu siteye erişmek için 18 yaşından büyük olmalısınız.",
					privacyNote: "Gizlilik Politikası",
					termsNote: "Kullanım Koşulları",
					leaveButton: "Siteyi Terk Et",
				};
			case "en":
				return {
					icon: "🔞",
					title: "Age Verification",
					subtitle: "18+ Content Notice",
					message:
						"This site offers tarot readings and personal development content. You must be 18 years or older to use our services.",
					requirements: [
						"You must be 18 years or older",
						"You must be legally considered an adult",
						"You must have permission to access this content",
					],
					disclaimer:
						"This site is for entertainment and personal development purposes. It does not replace professional advice.",
					confirmButton: "Yes, I am 18 or Older",
					declineButton: "No, I am Under 18",
					errorMessage: "Sorry, you must be 18 or older to access this site.",
					privacyNote: "Privacy Policy",
					termsNote: "Terms of Use",
					leaveButton: "Leave Site",
				};
			case "sr":
				return {
					icon: "🔞",
					title: "Verifikacija Godina",
					subtitle: "18+ Sadržaj Obaveštenje",
					message:
						"Ova stranica nudi tarot čitanja i sadržaj za lični razvoj. Morate imati 18 godina ili više da biste koristili naše usluge.",
					requirements: [
						"Morate imati 18 godina ili više",
						"Morate biti zakonski odrasli",
						"Morate imati dozvolu za pristup ovom sadržaju",
					],
					disclaimer:
						"Ova stranica je namenjena zabavi i ličnom razvoju. Ne zamenjuje profesionalne savete.",
					confirmButton: "Da, imam 18 ili više godina",
					declineButton: "Ne, imam manje od 18 godina",
					errorMessage:
						"Žao nam je, morate imati 18 ili više godina da pristupite ovoj stranici.",
					privacyNote: "Politika Privatnosti",
					termsNote: "Uslovi Korišćenja",
					leaveButton: "Napusti Stranicu",
				};
			default:
				return {
					icon: "🔞",
					title: "Age Verification",
					subtitle: "18+ Content Notice",
					message: "You must be 18 years or older to access this site.",
					requirements: [],
					disclaimer: "",
					confirmButton: "Yes, I am 18 or Older",
					declineButton: "No, I am Under 18",
					errorMessage: "You must be 18 or older to access this site.",
					privacyNote: "Privacy Policy",
					termsNote: "Terms of Use",
					leaveButton: "Leave Site",
				};
		}
	};

	const handleConfirm = () => {
		setIsConfirming(true);
		setTimeout(() => {
			localStorage.setItem(AGE_VERIFIED_KEY, "true");
			localStorage.setItem(
				"busbuskimki_age_verified_date",
				new Date().toISOString(),
			);
			setIsVisible(false);
		}, 300);
	};

	const handleDecline = () => {
		setShowError(true);
	};

	const handleLeave = () => {
		// Redirect to a safe page or close window
		window.location.href = "https://www.google.com";
	};

	if (!isVisible) return null;

	const content = getContent();

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md"
			role="dialog"
			aria-modal="true"
			aria-labelledby="age-verification-title"
		>
			{/* Modal Container */}
			<div
				className={`relative max-w-lg w-full mx-4 transform transition-all duration-300 ${
					isConfirming ? "scale-95 opacity-0" : "scale-100 opacity-100"
				}`}
			>
				<div className="bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95 backdrop-blur-xl rounded-2xl border-2 border-purple-500/40 shadow-2xl shadow-purple-500/30 overflow-hidden">
					{/* Mystical Background Effects */}
					<div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10"></div>
					<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-amber-500 to-purple-500"></div>

					{/* Content */}
					<div className="relative z-10 p-6 sm:p-8">
						{!showError ? (
							<>
								{/* Icon */}
								<div className="flex justify-center mb-6">
									<div className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-amber-500/30 rounded-full flex items-center justify-center border-2 border-purple-400/50 shadow-lg shadow-purple-500/20">
										<FaShieldAlt className="w-10 h-10 text-purple-200" />
									</div>
								</div>

								{/* Title */}
								<div className="text-center mb-6">
									<div className="text-4xl mb-3">{content.icon}</div>
									<h2
										id="age-verification-title"
										className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-golden-400 via-purple-300 to-amber-300 bg-clip-text text-transparent"
									>
										{content.title}
									</h2>
									<p className="text-purple-200 text-sm font-medium">
										{content.subtitle}
									</p>
								</div>

								{/* Message */}
								<div className="mb-6">
									<p className="text-gray-200 text-center leading-relaxed mb-4">
										{content.message}
									</p>

									{/* Requirements */}
									{content.requirements.length > 0 && (
										<div className="bg-purple-800/40 rounded-lg p-4 border border-purple-500/30">
											<ul className="space-y-2">
												{content.requirements.map((req, index) => (
													<li
														key={index}
														className="flex items-start gap-2 text-sm text-gray-200"
													>
														<FaCheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
														<span>{req}</span>
													</li>
												))}
											</ul>
										</div>
									)}
								</div>

								{/* Disclaimer */}
								{content.disclaimer && (
									<div className="mb-6 bg-amber-900/30 rounded-lg p-3 border border-amber-500/30">
										<div className="flex items-start gap-2">
											<FaExclamationTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
											<p className="text-xs text-amber-100">
												{content.disclaimer}
											</p>
										</div>
									</div>
								)}

								{/* Action Buttons */}
								<div className="space-y-3 mb-4">
									<button
										onClick={handleConfirm}
										className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02]"
									>
										{content.confirmButton}
									</button>
									<button
										onClick={handleDecline}
										className="w-full py-3 px-6 bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 font-medium rounded-xl transition-all duration-200 border border-gray-600/50"
									>
										{content.declineButton}
									</button>
								</div>

								{/* Legal Links */}
								<div className="flex justify-center gap-4 text-xs">
									<Link
										href={`/${locale}/legal/privacy-policy`}
										className="text-purple-300 hover:text-purple-100 underline"
									>
										{content.privacyNote}
									</Link>
									<Link
										href={`/${locale}/legal/terms-of-use`}
										className="text-purple-300 hover:text-purple-100 underline"
									>
										{content.termsNote}
									</Link>
								</div>
							</>
						) : (
							<>
								{/* Error State */}
								<div className="text-center">
									<div className="flex justify-center mb-6">
										<div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-400/50">
											<FaTimes className="w-10 h-10 text-red-400" />
										</div>
									</div>

									<h3 className="text-2xl font-bold text-red-300 mb-4">
										{content.errorMessage}
									</h3>

									<button
										onClick={handleLeave}
										className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/30"
									>
										{content.leaveButton}
									</button>
								</div>
							</>
						)}
					</div>
				</div>

				{/* Decorative Elements */}
				<div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
			</div>
		</div>
	);
}
