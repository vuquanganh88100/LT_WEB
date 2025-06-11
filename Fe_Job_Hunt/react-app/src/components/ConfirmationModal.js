import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';

/**
 * Reusable confirmation modal component
 * @param {boolean} visible - Controls the visibility of the modal
 * @param {string} title - Modal title
 * @param {string} content - Modal content/message
 * @param {function} onConfirm - Function to execute when confirm button is clicked
 * @param {function} onCancel - Function to execute when cancel button is clicked
 * @param {string} okText - Text for the confirm button
 * @param {string} cancelText - Text for the cancel button
 * @param {string} okType - Type of the confirm button ('primary', 'danger', etc.)
 */
const ConfirmationModal = ({
  visible,
  title,
  content,
  onConfirm,
  onCancel,
  okText = 'Xác nhận',
  cancelText = 'Hủy',
  okType = 'primary',
}) => {
  return (
    <Modal
      title={title}
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      okType={okType}
    >
      <p>{content}</p>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  okType: PropTypes.string,
};

export default ConfirmationModal;