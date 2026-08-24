import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { getImageUrl } from '../utils/api';
import { useAuth } from './AuthContext';

const CardContext = createContext();

export const formatCardData = (c) => {
  if (!c) return null;
  return {
    ...c,
    id: c._id || c.id,
    phone: c.mobile || c.phone || '',
    companyName: c.company || c.companyName || '',
    photoUrl: c.photo ? getImageUrl(c.photo) : (c.photoUrl || ''),
    signatureUrl: c.signature ? getImageUrl(c.signature) : (c.signatureUrl || ''),
    logoUrl: c.companyLogo ? getImageUrl(c.companyLogo) : (c.logoUrl || ''),
    qrCodeUrl: c.qrCode ? getImageUrl(c.qrCode) : (c.qrCodeUrl || ''),
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  };
};

export const CardProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [cards, setCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalCards: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10
  });

  const fetchCards = useCallback(async (params = {}) => {
    if (!localStorage.getItem('id_gen_token')) return;
    setLoading(true);
    try {
      const res = await api.get('/cards', { params });
      if (res.data && res.data.success) {
        const rawCards = res.data.data.cards || [];
        const formatted = rawCards.map(formatCardData);
        setCards(formatted);
        if (res.data.data.pagination) {
          setPagination(res.data.data.pagination);
        }
        if (formatted.length > 0 && !activeCard) {
          setActiveCard(formatted[0]);
        }
      }
    } catch (err) {
      console.error('[CardContext Error] Failed to fetch cards from MongoDB:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCard]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCards();
    } else {
      setCards([]);
      setActiveCard(null);
    }
  }, [isLoggedIn]);

  const addCard = async (cardInput) => {
    let payload = cardInput;
    let isFormData = cardInput instanceof FormData;

    // If standard object, convert to FormData or handle file references
    if (!isFormData && typeof cardInput === 'object') {
      const formData = new FormData();
      Object.keys(cardInput).forEach((key) => {
        const value = cardInput[key];
        if (value !== undefined && value !== null) {
          if (key === 'phone') {
            formData.append('mobile', value);
          } else if (key === 'companyName') {
            formData.append('company', value);
          } else if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value);
          }
        }
      });
      payload = formData;
      isFormData = true;
    }

    const res = await api.post('/cards', payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });

    if (res.data && res.data.success) {
      const newCard = formatCardData(res.data.data);
      setCards((prev) => [newCard, ...prev]);
      setActiveCard(newCard);
      return newCard;
    }
    throw new Error(res.data?.message || 'Failed to create card');
  };

  const updateCard = async (id, updatedInput) => {
    let payload = updatedInput;
    let isFormData = updatedInput instanceof FormData;

    if (!isFormData && typeof updatedInput === 'object') {
      const formData = new FormData();
      Object.keys(updatedInput).forEach((key) => {
        const value = updatedInput[key];
        if (value !== undefined && value !== null) {
          if (key === 'phone') formData.append('mobile', value);
          else if (key === 'companyName') formData.append('company', value);
          else formData.append(key, value);
        }
      });
      payload = formData;
      isFormData = true;
    }

    const res = await api.put(`/cards/${id}`, payload, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });

    if (res.data && res.data.success) {
      const updated = formatCardData(res.data.data);
      setCards((prev) => prev.map((c) => (c.id === id || c._id === id ? updated : c)));
      if (activeCard?.id === id || activeCard?._id === id) {
        setActiveCard(updated);
      }
      return updated;
    }
    throw new Error(res.data?.message || 'Failed to update card');
  };

  const deleteCard = async (id) => {
    const res = await api.delete(`/cards/${id}`);
    if (res.data && res.data.success) {
      setCards((prev) => prev.filter((c) => c.id !== id && c._id !== id));
      if (activeCard?.id === id || activeCard?._id === id) {
        setActiveCard(null);
      }
      return true;
    }
    throw new Error(res.data?.message || 'Failed to delete card');
  };

  const incrementDownload = (id) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id || c._id === id ? { ...c, downloads: (c.downloads || 0) + 1 } : c))
    );
  };

  const incrementPrint = (id) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id || c._id === id ? { ...c, printed: (c.printed || 0) + 1 } : c))
    );
  };

  return (
    <CardContext.Provider
      value={{
        cards,
        activeCard,
        loading,
        pagination,
        setActiveCard,
        fetchCards,
        addCard,
        updateCard,
        deleteCard,
        incrementDownload,
        incrementPrint
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

export const useCards = () => useContext(CardContext);
