"client";

import Loader from "@/components/ui/Loader";
import { Modal } from "@/components/ui/modal";
import { Game } from "@/types/games";
import {
  BankDetails,
  PayoutMethod,
  PayoutType,
  PayPalDetails,
  ReleasePayload,
} from "@/types/payout";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

interface ConfirmReleaseModalProps {
  isOpen: boolean;
  closeModal: () => void;
  games: Game[];
  onConfirm: () => void;
  isloading?: boolean;
}

const ConfirmReleaseModal = ({
  isOpen,
  closeModal,
  onConfirm,
  games,
  isloading,
}: ConfirmReleaseModalProps) => {
  const supabase = createClient();

  const [seatInfoMap, setSeatInfoMap] = useState<Record<string, string>>(
    () => ({})
  );
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>();

  const [newMethodType, setNewMethodType] = useState<PayoutType>("bank");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountNumber: "",
    routingNumber: "",
  });
  const [paypalDetails, setPayPalDetails] = useState<PayPalDetails>({
    email: "",
  });
  const [addingNew, setAddingNew] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // 1) get the current user’s email
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr || !user) {
        console.error("Auth error", userErr);
        setLoading(false);
        return;
      }

      // get the season ticket holder details for seat mapping
      const { data: holderArr, error: hErr } = await supabase
        .from("season_ticket_holders")
        .select("seat_info")
        .eq("email", user.email)
        .limit(1);
      if (hErr) console.error("Holder lookup error:", hErr);

      const holder = holderArr?.[0];

      // 3) build a map: every selected game gets the same seat_info
      const simap: Record<string, string> = {};
      const seat = holder?.seat_info ?? "";
      for (const g of games) {
        simap[g.id] = seat;
      }

      // b) load payout methods
      const { data: methods = [], error: mErr } = await supabase
        .from("payout_methods")
        .select("id, type, details, is_default")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });
      if (mErr) console.error(mErr);

      setSeatInfoMap(simap);

      if (methods) {
        setPayoutMethods(methods);
      }

      if (methods?.length) {
        const def = methods?.find((m) => m.is_default)?.id || methods?.[0].id;
        setSelectedMethod(def);
      }
      setLoading(false);
    }

    if (games.length > 0) {
      load();
    }
  }, [games, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (addingNew) {
      if (newMethodType === "bank") {
        if (!bankDetails.accountNumber || !bankDetails.routingNumber) {
          setError("Please fill in both account and routing numbers");
          return;
        }
      } else {
        if (!paypalDetails.email) {
          setError("Please enter a PayPal email");
          return;
        }
      }
    }
    if (!selectedMethod && !addingNew) {
      setError("Please select a payout method");
      return;
    }

    setSubmitting(true);

    const payload: ReleasePayload = {
      gameIds: games.map((g) => g.id),
      seatInfo: seatInfoMap,
      payoutMethodId: selectedMethod!,
    };

    if (addingNew) {
      payload.newMethod = {
        type: newMethodType,
        details: newMethodType === "bank" ? bankDetails : paypalDetails,
        makeDefault: true,
      };
    }

    const res = await fetch("/api/sell/release", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      setError((await res.json()).error || "Release failed");
      setSubmitting(false);
      return;
    }
    onConfirm();
  };

  if (loading || isloading) {
    return <Loader />;
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className=" p-5 lg:p-10">
        <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
          Confirm Release{" "}
        </h4>
        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
          Are you sure you want to release tickets for these games?
        </p>
        <form onSubmit={handleSubmit} className=" p-2 space-y-6 mt-4">
          {/* Summary table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-50 rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Match</th>
                  <th className="p-3 text-left">Venue</th>
                  <th className="p-3 text-left">Seat</th>
                </tr>
              </thead>
              <tbody>
                {games.map((g) => (
                  <tr key={g.id} className="border-t">
                    <td className="p-3">
                      {new Date(g.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {g.home_team?.name} vs {g.away_team?.name}
                    </td>
                    <td className="p-3">{g.venue}</td>
                    <td className="p-3">
                      <input
                        type="text"
                        required
                        value={seatInfoMap[g.id] || ""}
                        onChange={(e) =>
                          setSeatInfoMap((si) => ({
                            ...si,
                            [g.id]: e.target.value,
                          }))
                        }
                        className="w-full border px-2 py-1 rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="font-medium block">Payout Method</label>
              {payoutMethods.length > 0 ? (
                <select
                  value={addingNew ? "__NEW__" : selectedMethod}
                  onChange={(e) => {
                    setSelectedMethod(e.target.value);
                    setAddingNew(false);
                  }}
                  className="w-full border px-2 py-1 rounded"
                >
                  {payoutMethods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.type === "bank"
                        ? `Bank: ****${m.details.accountNumber.slice(-4)}`
                        : `PayPal: ${m.details.email}`}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="italic text-gray-500">No saved methods.</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setAddingNew(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Add New
            </button>
          </div>

          {/* New method form */}
          {addingNew && (
            <div className="p-4 bg-gray-50 rounded space-y-4">
              <label>
                Type
                <select
                  value={newMethodType}
                  onChange={(e) =>
                    setNewMethodType(e.target.value as PayoutType)
                  }
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                </select>
              </label>
              {newMethodType === "bank" ? (
                <>
                  <input
                    placeholder="Account Number"
                    onChange={(e) =>
                      setBankDetails((d) => ({
                        ...d,
                        accountNumber: e.target.value,
                      }))
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                  <input
                    placeholder="Routing Number"
                    onChange={(e) =>
                      setBankDetails((d) => ({
                        ...d,
                        routingNumber: e.target.value,
                      }))
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                </>
              ) : (
                <input
                  type="email"
                  placeholder="PayPal Email"
                  onChange={(e) =>
                    setPayPalDetails((d) => ({ ...d, email: e.target.value }))
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              )}
            </div>
          )}

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded bg-gray-200"
            >
              Cancel{" "}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 rounded text-white ${
                submitting ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {submitting
                ? "Releasing…"
                : `Release ${games.length} Ticket${
                    games.length > 1 ? "s" : ""
                  }`}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ConfirmReleaseModal;
