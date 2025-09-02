import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  DollarSign,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import type { Transaction } from "../types";
import TransactionForm from "../components/forms/TransactionForm";
import DeleteConfirmModal from "../components/forms/DeleteConfirmModal";
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from "../hooks/useTransactions";
import { formatDateWithTimezone } from "../utils/format.util";
import { Pagination } from "@mui/material";
import type { CreateTransaction } from "../types/transactions/transactions";

type TxType = "all" | "INCOME" | "EXPENSE";

const TransactionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<TxType>("all");
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction>();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransacion = useDeleteTransaction();
  const { data, isLoading, isError } = useTransactions(page, 10);

  const rawList = (data as any)?.transactions ?? (data as any)?.data ?? [];

  const transactions: Transaction[] = Array.isArray(rawList) ? rawList : [];

  const totalPages = (data as any)?.totalPages ?? 1;

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleAddTransaction = () => {
    setFormMode("add");
    setSelectedTransaction(undefined);
    setShowTransactionForm(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setFormMode("edit");
    setSelectedTransaction(tx);
    setShowTransactionForm(true);
    setActiveDropdown(null);
  };

  const handleDeleteTransaction = (tx: Transaction) => {
    setTransactionToDelete(tx);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  const handleTransactionSubmit = async (tx: CreateTransaction) => {
    if (formMode == "add") {
      await createTransaction.mutateAsync(tx);
    } else if (selectedTransaction) {
      await updateTransaction.mutateAsync({
        id: selectedTransaction.id,
        payload: tx,
      });
    }
    setShowTransactionForm(false);
    setSelectedTransaction(undefined);
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
      await deleteTransacion.mutateAsync(transactionToDelete.id);
      setTransactionToDelete(undefined);
    }
    setShowDeleteModal(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setActiveDropdown(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filteredTransactions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return transactions.filter((t) => {
      const matchesSearch =
        !term ||
        t.description?.toLowerCase().includes(term) ||
        t.category?.name?.toLowerCase().includes(term) ||
        t.categoryId?.toString?.().toLowerCase().includes(term);

      const matchesFilter =
        filterType === "all" || (t.type && t.type.toUpperCase() === filterType);

      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchTerm, filterType]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <div className="text-gray-600">Loading transactions…</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <div className="text-red-600">Failed to load transactions.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your financial transactions
          </p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          onClick={handleAddTransaction}
        >
          <Plus className="w-5 h-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                ${data?.totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-red-600">
                ${data?.totalExpense.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <ArrowDownRight className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Flow</p>
              <p
                className={`text-2xl font-bold ${
                  data?.netFlow >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${Math.abs(data?.netFlow).toLocaleString()}
              </p>
            </div>
            <div
              className={`p-3 rounded-lg ${
                data?.netFlow >= 0 ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <DollarSign
                className={`w-6 h-6 ${
                  data?.netFlow >= 0 ? "text-green-600" : "text-red-600"
                }`}
              />
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Filters and Search */}
      <DashboardCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TxType)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expenses</option>
            </select>

            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>

            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </DashboardCard>

      {/* Transactions List */}
      <DashboardCard>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Transactions
          </h3>

          <div className="space-y-3 h-[25rem] overflow-y-auto">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id}>
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-lg ${
                          transaction.type === "INCOME"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "INCOME" ? (
                          <ArrowUpRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>
                            {transaction.category?.name ?? "Uncategorized"}
                          </span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDateWithTimezone(transaction.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* amount + actions */}
                    <div className="flex items-center space-x-4">
                      <div
                        className={`font-semibold text-lg ${
                          (transaction.type === "INCOME" ? 1 : -1) *
                            transaction.amount >
                          0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "INCOME" ? "+" : "-"}$
                        {Math.abs(
                          Number(transaction.amount) || 0
                        ).toLocaleString()}
                      </div>

                      {/* actions */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === transaction.id
                                ? null
                                : transaction.id
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg "
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                        {activeDropdown === transaction.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                            <button
                              onClick={() => handleEditTransaction(transaction)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteTransaction(transaction)
                              }
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  No transactions found
                </h3>
                <p className="text-gray-600 max-w-sm">
                  You haven't added any transactions yet. Start tracking your
                  finances by adding your first transaction.
                </p>
              </div>
            )}
          </div>
          {filteredTransactions.length > 0 && (
            <div className="flex items-center justify-end mt-2">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </DashboardCard>

      <TransactionForm
        isOpen={showTransactionForm}
        onClose={() => setShowTransactionForm(false)}
        onSubmit={handleTransactionSubmit}
        mode={formMode}
        transaction={selectedTransaction}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message="This transaction will be permanently removed from your account."
        itemName={transactionToDelete?.category?.name ?? "this transaction"}
      />

      {activeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
