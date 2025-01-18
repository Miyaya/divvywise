"use client";

import { useState } from "react";
import Header from "../components/header";
import { participants, purchases } from "@/data/data";

export default function Add() {
	// TODO: need to add debtors and timestamp
	const [formData, setFormData] = useState({
		itemName: "",
		price: "",
		currency: "USD",
		notes: "",
		payer: "",
		splitMethod: "",
	});

	const [records, setRecords] = useState(purchases);
	const [errors, setErrors] = useState({});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });

		// Clear errors for the field as the user types
		setErrors({ ...errors, [name]: "" });
	};

	const handleAddPurchase = () => {
		const newErrors = {};

		if (!formData.itemName) {
			newErrors.itemName = "Item name is required.";
		}
		if (!formData.price) {
			newErrors.price = "Price is required.";
		}
		if (!formData.payer) {
			newErrors.payer = "Payer is required.";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setRecords([...records, { ...formData }]);
		setFormData({
			itemName: "",
			price: "",
			currency: "USD",
			notes: "",
			payer: "",
			splitMethod: "equally",
		});
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4 flex flex-col">
			<Header />
			<h1 className="text-lg font-semibold text-gray-800 mb-2">Add a Purchase</h1>
			<form className="bg-white p-4 rounded-lg shadow-md space-y-4 w-full max-w-md">
				{/* Item Name */}
				<div className="flex flex-col">
					<input
						type="text"
						id="itemName"
						name="itemName"
						value={formData.itemName}
						onChange={handleInputChange}
						placeholder="Enter item name"
						className={`mt-1 p-2 border rounded ${errors.itemName ? "border-red-500" : "border-gray-300"
							}`}
					/>
					{errors.itemName && (
						<p className="text-red-500 text-sm mt-1">{errors.itemName}</p>
					)}
				</div>

				{/* Price and Currency */}
				<div className="flex space-x-4">
					<div className="flex-1">
						<input
							type="number"
							id="price"
							name="price"
							value={formData.price}
							onChange={handleInputChange}
							placeholder="Enter price"
							className={`mt-1 p-2 border rounded w-full ${errors.price ? "border-red-500" : "border-gray-300"
								}`}
						/>
						{errors.price && (
							<p className="text-red-500 text-sm mt-1">{errors.price}</p>
						)}
					</div>
					<div className="flex-1">
						<select
							id="currency"
							name="currency"
							value={formData.currency}
							onChange={handleInputChange}
							className="mt-1 p-2 border rounded w-full border-gray-300"
						>
							<option value="USD">USD</option>
							<option value="EUR">EUR</option>
							<option value="JPY">JPY</option>
							<option value="GBP">GBP</option>
						</select>
					</div>
				</div>

				{/* Notes */}
				<div className="flex flex-col">
					<textarea
						id="notes"
						name="notes"
						value={formData.notes}
						onChange={handleInputChange}
						placeholder="Enter any notes"
						className="mt-1 p-2 border rounded border-gray-300"
					/>
				</div>

				{/* Payer and Split Method */}
				<div className="flex space-x-4">
					<div className="flex-1">
						<select
							id="payer"
							name="payer"
							value={formData.payer}
							onChange={handleInputChange}
							className={`mt-1 p-2 border rounded w-full ${errors.payer ? "border-red-500" : "border-gray-300"
								}`}
						>
							<option value="">Select payer</option>
							<option value="Alice">Alice</option>
							<option value="Bob">Bob</option>
							<option value="Charlie">Charlie</option>
						</select>
						{errors.payer && (
							<p className="text-red-500 text-sm mt-1">{errors.payer}</p>
						)}
					</div>
					<div className="flex-1">
						<select
							id="splitMethod"
							name="splitMethod"
							value={formData.splitMethod}
							onChange={handleInputChange}
							className="mt-1 p-2 border rounded w-full border-gray-300"
						>
							<option value="">Way of split</option>
							<option value="equally">Split Equally</option>
							<option value="byPercentage">By Percentage</option>
							<option value="custom">Custom Split</option>
						</select>
					</div>
				</div>

				{/* Add Button */}
				<button
					type="button"
					onClick={handleAddPurchase}
					className="w-full bg-gray-500 text-white p-2 rounded hover:bg-blue-600"
				>
					Add
				</button>
			</form>
		</div>
	);
}