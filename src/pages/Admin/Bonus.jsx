import React, { useEffect, useState } from "react";
import { getSystemSettings, updateSystemSettings } from "../../api/api";
import { toast } from "react-toastify";
import { FaTrash, FaPlus, FaSave } from "react-icons/fa";

const RangeConfig = ({
  title,
  description,
  ranges,
  onChange,
  bonusLabel = "Bonus ($)",
}) => {
  const addRange = () => {
    onChange([...ranges, { min: 0, max: 0, bonus: 0 }]);
  };

  const removeRange = (index) => {
    const newRanges = [...ranges];
    newRanges.splice(index, 1);
    onChange(newRanges);
  };

  const updateRange = (index, field, value) => {
    const newRanges = [...ranges];
    newRanges[index][field] = Number(value);
    onChange(newRanges);
  };

  return (
    <div className="mb-8 border border-gray-200 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-500 mb-6 text-sm">{description}</p>

      {ranges.length === 0 && (
        <div className="text-center p-4 mb-4">
          <p className="text-gray-400 italic mb-2">No ranges configured.</p>
          <button
            onClick={addRange}
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 mx-auto"
          >
            <FaPlus /> Add First Range
          </button>
        </div>
      )}

      {ranges.length > 0 && (
        <>
          <table className="w-full text-sm text-left border-collapse mb-4">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-2 border">Min Amount ($)</th>
                <th className="p-2 border">Max Amount ($)</th>
                <th className="p-2 border">{bonusLabel}</th>
                <th className="p-2 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {ranges.map((range, idx) => (
                <tr key={idx} className="border-b bg-white">
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={range.min}
                      onChange={(e) => updateRange(idx, "min", e.target.value)}
                      className="border rounded p-1 w-full focus:outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={range.max}
                      onChange={(e) => updateRange(idx, "max", e.target.value)}
                      className="border rounded p-1 w-full focus:outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={range.bonus}
                      onChange={(e) =>
                        updateRange(idx, "bonus", e.target.value)
                      }
                      className="border rounded p-1 w-full focus:outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => removeRange(idx)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded transition"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addRange}
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1"
          >
            <FaPlus /> Add Range
          </button>
        </>
      )}
    </div>
  );
};

const SimpleLevelConfig = ({ title, description, levels, onChange }) => {
  const addLevel = () => {
    const maxLevel = levels.length > 0 ? levels[levels.length - 1].level : 0;
    const newLevel = { level: maxLevel + 1, percentage: 0 };
    onChange([...levels, newLevel]);
  };

  const removeLevel = (index) => {
    const newLevels = levels.filter((_, i) => i !== index);
    const renumbered = newLevels.map((lvl, idx) => ({
      ...lvl,
      level: idx + 1,
    }));
    onChange(renumbered);
  };

  const updatePercentage = (index, value) => {
    const newLevels = [...levels];
    newLevels[index].percentage = Number(value);
    onChange(newLevels);
  };

  return (
    <div className="mb-8 border border-gray-200 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <button
          onClick={addLevel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition"
        >
          <FaPlus /> Add Level
        </button>
      </div>
      <p className="text-gray-500 mb-6 text-sm">{description}</p>

      {levels.length === 0 && (
        <p className="text-center text-gray-400 italic">
          No levels configured.
        </p>
      )}

      {levels.map((lvl, idx) => (
        <div
          key={idx}
          className="mb-4 bg-gray-50 p-4 rounded border border-gray-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-4 flex-1">
            <h4 className="font-semibold text-gray-700 text-lg w-24">
              Level {lvl.level}
            </h4>
            <div className="flex-1 max-w-xs">
              <label className="text-xs text-gray-500 block mb-1">
                Bonus Percentage (%)
              </label>
              <input
                type="number"
                value={lvl.percentage}
                onChange={(e) => updatePercentage(idx, e.target.value)}
                className="border rounded p-2 w-full focus:outline-none focus:border-blue-500"
                placeholder="Ex. 5"
              />
            </div>
          </div>
          <button
            onClick={() => removeLevel(idx)}
            className="text-red-500 hover:text-red-700 p-2 rounded transition"
          >
            <FaTrash />
          </button>
        </div>
      ))}
    </div>
  );
};

const LevelConfig = ({ title, description, levels, onChange }) => {
  const addLevel = () => {
    const maxLevel = levels.length > 0 ? levels[levels.length - 1].level : 0;
    const newLevel = { level: maxLevel + 1, ranges: [] };
    onChange([...levels, newLevel]);
  };

  const removeLevel = (index) => {
    const newLevels = levels.filter((_, i) => i !== index);
    const renumbered = newLevels.map((lvl, idx) => ({
      ...lvl,
      level: idx + 1,
    }));
    onChange(renumbered);
  };

  const addRange = (levelIndex) => {
    const newLevels = [...levels];
    newLevels[levelIndex].ranges.push({ min: 0, max: 0, bonus: 0 });
    onChange(newLevels);
  };

  const removeRange = (levelIndex, rangeIndex) => {
    const newLevels = [...levels];
    newLevels[levelIndex].ranges.splice(rangeIndex, 1);
    onChange(newLevels);
  };

  const updateRange = (levelIndex, rangeIndex, field, value) => {
    const newLevels = [...levels];
    newLevels[levelIndex].ranges[rangeIndex][field] = Number(value);
    onChange(newLevels);
  };

  return (
    <div className="mb-8 border border-gray-200 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <button
          onClick={addLevel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition"
        >
          <FaPlus /> Add Level
        </button>
      </div>
      <p className="text-gray-500 mb-6 text-sm">{description}</p>

      {levels.length === 0 && (
        <p className="text-center text-gray-400 italic">
          No levels configured.
        </p>
      )}

      {levels.map((lvl, lIdx) => (
        <div
          key={lIdx}
          className="mb-6 bg-gray-50 p-4 rounded border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h4 className="font-semibold text-gray-700 text-lg">
              Level {lvl.level}
            </h4>
            <button
              onClick={() => removeLevel(lIdx)}
              className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
            >
              <FaTrash /> Remove Level
            </button>
          </div>

          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-2 border">Min Amount ($)</th>
                <th className="p-2 border">Max Amount ($)</th>
                <th className="p-2 border">Bonus (%)</th>
                <th className="p-2 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {lvl.ranges.map((range, rIdx) => (
                <tr key={rIdx} className="border-b bg-white">
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={range.min}
                      onChange={(e) =>
                        updateRange(lIdx, rIdx, "min", e.target.value)
                      }
                      className="border rounded p-1 w-full focus:outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={range.max}
                      onChange={(e) =>
                        updateRange(lIdx, rIdx, "max", e.target.value)
                      }
                      className="border rounded p-1 w-full focus:outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={range.bonus}
                      onChange={(e) =>
                        updateRange(lIdx, rIdx, "bonus", e.target.value)
                      }
                      className="border rounded p-1 w-full focus:outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => removeRange(lIdx, rIdx)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded transition"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => addRange(lIdx)}
            className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1"
          >
            <FaPlus /> Add Range
          </button>
        </div>
      ))}
    </div>
  );
};

function Bonus() {
  const [signupBonus, setSignupBonus] = useState(0);
  const [restrictWithdrawalToProfits, setRestrictWithdrawalToProfits] =
    useState(false);

  // New State for Deposits (Ranges)
  const [depositSelfRanges, setDepositSelfRanges] = useState([]);
  const [referralFirstDepositRanges, setReferralFirstDepositRanges] = useState(
    [],
  );

  const [referralOrderSettings, setReferralOrderSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await getSystemSettings(token);
        setSignupBonus(data.signupBonus || 0);
        setRestrictWithdrawalToProfits(
          data.restrictWithdrawalToProfits || false,
        );

        setDepositSelfRanges(data.depositSelfRanges || []);
        setReferralFirstDepositRanges(data.referralFirstDepositRanges || []);

        let ordSettings = data.referralOrderSettings || [];
        ordSettings.sort((a, b) => a.level - b.level);
        setReferralOrderSettings(ordSettings);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load settings");
      }
    };
    fetchSettings();
  }, [token]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateSystemSettings(token, {
        signupBonus,
        referralOrderSettings,
        depositSelfRanges,
        referralFirstDepositRanges,
        restrictWithdrawalToProfits,
      });
      toast.success("Bonus settings updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update bonus settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Bonus Configuration
          </h2>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <FaSave /> Save Changes
              </>
            )}
          </button>
        </div>

        {/* Signup Bonus Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Signup Bonus</h3>
          <p className="text-gray-500 mb-4 text-sm">
            Amount given to a NEW user immediately upon registration.
          </p>
          <label className="block max-w-xs">
            <span className="text-gray-700 font-medium">
              Signup Bonus Amount ($)
            </span>
            <input
              type="number"
              className="w-full mt-2 p-3 bg-white border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-lg"
              value={signupBonus}
              onChange={(e) => setSignupBonus(Number(e.target.value))}
            />
          </label>
        </div>

        {/* Withdrawal Restriction Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Withdrawal Restriction
          </h3>
          <p className="text-gray-500 mb-4 text-sm">
            Toggle whether users can withdraw their whole balance or only their
            earned profits and bonuses (Claim profit, Self recharge bonus, Team
            commission, Referral recharge bonus).
          </p>
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium">
              Restrict Withdrawal to Profits/Bonuses
            </span>
            <button
              onClick={() =>
                setRestrictWithdrawalToProfits(!restrictWithdrawalToProfits)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                restrictWithdrawalToProfits ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  restrictWithdrawalToProfits
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm font-semibold text-gray-600">
              {restrictWithdrawalToProfits
                ? "ON (Restricted)"
                : "OFF (Full Balance)"}
            </span>
          </div>
        </div>

        {/* Deposit Bonus Section - New Simplified Layout */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Deposit Bonuses
          </h3>

          {/* Self Bonus Range Config */}
          <RangeConfig
            title="Self Deposit Bonus"
            description="Bonuses given back to the depositor based on deposit amount ranges (Every Deposit)."
            ranges={depositSelfRanges}
            onChange={setDepositSelfRanges}
            bonusLabel="Bonus ($)"
          />

          <hr className="my-6 border-gray-200" />

          {/* Referrer Bonus Range Config */}
          <RangeConfig
            title="Referrer First-Time Bonus"
            description="Bonuses given to the direct referrer when a user makes their FIRST deposit, based on deposit amount ranges."
            ranges={referralFirstDepositRanges}
            onChange={setReferralFirstDepositRanges}
            bonusLabel="Bonus ($)"
          />
        </div>

        {/* Order Referral Section */}
        <SimpleLevelConfig
          title="Referral Bonus - Orders"
          description="Bonuses given to uplines when a user collects profit from an order. Define a percentage for each level."
          levels={referralOrderSettings}
          onChange={setReferralOrderSettings}
        />
      </div>
    </div>
  );
}

export default Bonus;
