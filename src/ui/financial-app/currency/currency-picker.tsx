"use client";

import { useEffect, useState } from "react";
import { Modal, Dropdown, Spinner, Button } from "../../components";
import { Currency } from "@/src/types";
import { WalletIcon } from "@heroicons/react/24/solid";
import { AppDictionary } from "@/src/translations";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export type CurrencyPickerProps = {
  dict: AppDictionary;
};
export const CurrencyPicker = ({ dict }: CurrencyPickerProps) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<
    string | undefined
  >();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const response = await fetch("/api/currency/get-all");
        if (!response.ok) throw new Error("Failed to fetch currencies");
        const data = await response.json();
        setCurrencies(data);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    }
    fetchCurrencies();
  }, []);

  const handleCurrencyChange = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/user/currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currencyId: selectedCurrency }),
      });

      if (!response.ok) throw new Error("Failed to update currency");

      console.log("Currency updated successfully!");
      toast("Updated", { type: "success" });

      window.location.reload();
    } catch (error) {
      toast("Failed", { type: "error" });

      console.error("Error updating currency:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen modalClassName="w-[300px] !overflow-visible">
      {currencies.length === 0 || loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <div className="relative h-[50px] w-[50px] items-center flex justify-center">
            <Spinner className="absolute  h-[50px] w-[50px] !fill-gray-200 text-white" />
            <WalletIcon className="w-8 h-8" />
          </div>
        </div>
      ) : (
        <div>
          <div className="text-xl font-bold mb-2">
            {dict.dashboard.selectCurrencyTitle}
          </div>
          <div className="text-base mb-5">
            {dict.dashboard.selectCurrencyMessage}
          </div>
          <Dropdown
            options={currencies.map((currency) => ({
              value: currency.id.toString(),
              label: currency.name,
            }))}
            onChange={(option) => setSelectedCurrency(option.value)}
            showAddButon={false}
            disabled={loading}
            maxMenuHeight={150}
          />
          <div className="h-5" />
          <Button
            onClick={handleCurrencyChange}
            className="tour-step-1 bg-black text-white font-bold"
            isDisabled={loading || !selectedCurrency}
          >
            {dict.shared.save}
          </Button>
        </div>
      )}
    </Modal>
  );
};
