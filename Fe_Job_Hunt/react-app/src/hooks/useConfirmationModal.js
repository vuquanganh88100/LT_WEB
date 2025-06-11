import { useState, useCallback } from 'react';

/**
 * Hook for managing confirmation modals
 * @returns {Object} Modal state and control functions
 */
const useConfirmationModal = () => {
  const [modalState, setModalState] = useState({
    visible: false,
    title: '',
    content: '',
    onConfirm: () => {},
    okText: 'Xác nhận',
    cancelText: 'Hủy',
    okType: 'primary',
  });

  /**
   * Show the confirmation modal
   * @param {Object} options - Modal configuration options
   */
  const showModal = useCallback(({
    title,
    content,
    onConfirm,
    okText = 'Xác nhận',
    cancelText = 'Hủy',
    okType = 'primary',
  }) => {
    setModalState({
      visible: true,
      title,
      content,
      onConfirm: () => {
        onConfirm();
        hideModal();
      },
      okText,
      cancelText,
      okType,
    });
  }, []);

  /**
   * Hide the confirmation modal
   */
  const hideModal = useCallback(() => {
    setModalState(prev => ({ ...prev, visible: false }));
  }, []);

  return {
    modalState,
    showModal,
    hideModal,
  };
};

export default useConfirmationModal;