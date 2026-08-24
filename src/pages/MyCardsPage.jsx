import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Search,
  Plus,
  Eye,
  Trash2,
  Printer,
  Download,
  Filter,
  CreditCard
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Pagination } from '../components/ui/Pagination';
import { SearchBar } from '../components/shared/SearchBar';
import { EmptyState } from '../components/shared/EmptyState';
import { useCards } from '../context/CardContext';
import { useToast } from '../context/ToastContext';
import { DEPARTMENTS } from '../utils/theme';

export const MyCardsPage = () => {
  const navigate = useNavigate();
  const { cards, setActiveCard, deleteCard, fetchCards, incrementDownload, incrementPrint, loading } = useCards();
  const { addToast } = useToast();
  const { searchQuery: globalSearch } = useOutletContext() || {};

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalCard, setDeleteModalCard] = useState(null);

  const activeSearch = search || globalSearch || '';

  useEffect(() => {
    fetchCards({
      search: activeSearch,
      department: selectedDept !== 'All' ? selectedDept : undefined
    });
  }, [activeSearch, selectedDept]);

  const filteredCards = cards.filter((c) => {
    if (!activeSearch) {
      const matchesDept = selectedDept === 'All' || c.department === selectedDept || c.course === selectedDept;
      return matchesDept;
    }

    const q = activeSearch.toLowerCase();
    const matchesSearch =
      (c.fullName && c.fullName.toLowerCase().includes(q)) ||
      (c.employeeId && c.employeeId.toLowerCase().includes(q)) ||
      (c.rollNumber && c.rollNumber.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.department && c.department.toLowerCase().includes(q)) ||
      (c.companyName && c.companyName.toLowerCase().includes(q)) ||
      (c.college && c.college.toLowerCase().includes(q)) ||
      (c.course && c.course.toLowerCase().includes(q)) ||
      (c.branch && c.branch.toLowerCase().includes(q)) ||
      (c.designation && c.designation.toLowerCase().includes(q));

    const matchesDept = selectedDept === 'All' || c.department === selectedDept || c.course === selectedDept;
    return matchesSearch && matchesDept;
  });

  const pageSize = 6;
  const totalPages = Math.ceil(filteredCards.length / pageSize) || 1;
  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete = async () => {
    if (deleteModalCard) {
      try {
        await deleteCard(deleteModalCard.id);
        addToast(`Deleted card for ${deleteModalCard.fullName}`, 'info');
      } catch (err) {
        addToast('Failed to delete card', 'error');
      } finally {
        setDeleteModalCard(null);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: 'My Cards' }]} />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Generated ID Credentials Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search by name, employee ID, roll number, phone, department, or company/college.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/dashboard/create')}
        >
          Create New ID Card
        </Button>
      </div>

      {/* Search & Department Filter Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-md">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            placeholder="Search by name, ID, roll no, phone, dept, company/college..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Category:
          </span>
          <button
            onClick={() => {
              setSelectedDept('All');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              selectedDept === 'All'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({cards.length})
          </button>
          {DEPARTMENTS.slice(0, 4).map((dept) => {
            const count = cards.filter((c) => c.department === dept || c.course === dept).length;
            return (
              <button
                key={dept}
                onClick={() => {
                  setSelectedDept(dept);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                  selectedDept === dept
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept} ({count})
              </button>
            );
          })}
        </div>
      </Card>

      {/* Cards Grid */}
      {paginatedCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCards.map((card) => (
            <Card key={card.id} hoverEffect className="flex flex-col justify-between group">
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <Badge variant={card.cardType === 'Student' ? 'success' : 'primary'}>
                    {card.cardType === 'Student' ? `Student: ${card.course || 'Academic'}` : (card.department || 'Employee')}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {card.rollNumber || card.employeeId}
                  </span>
                </div>

                {/* Profile Brief */}
                <div className="flex items-center gap-4 my-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-100 p-0.5 shrink-0 flex items-center justify-center">
                    <img
                      src={card.photoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'}
                      alt={card.fullName}
                      className="w-full h-full object-contain object-top rounded-xl"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition truncate">
                      {card.fullName}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate">
                      {card.designation || card.branch}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 truncate">{card.companyName || card.college}</p>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Eye}
                  onClick={() => {
                    setActiveCard(card);
                    navigate('/dashboard/preview');
                  }}
                >
                  Preview
                </Button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      incrementPrint(card.id);
                      setActiveCard(card);
                      navigate('/dashboard/preview');
                    }}
                    title="Print"
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      incrementDownload(card.id);
                      setActiveCard(card);
                      navigate('/dashboard/preview');
                    }}
                    title="Download"
                    className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModalCard(card)}
                    title="Delete"
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No cards match your filter"
          description="Try adjusting your search query or department filter."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedDept('All');
          }}
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={!!deleteModalCard}
        onClose={() => setDeleteModalCard(null)}
        title="Confirm Deletion"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete the ID card credential for{' '}
            <span className="font-bold text-slate-900">{deleteModalCard?.fullName}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteModalCard(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Yes, Delete Card
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
