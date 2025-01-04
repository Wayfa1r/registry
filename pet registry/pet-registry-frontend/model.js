// modal.js
export function displayModal(message, confirmCallback, cancelCallback) {
    const modal = document.getElementById('confirmation-modal');
    if (!modal) {
        console.error("Modal element with id 'confirmation-modal' not found.");
        return;
    }
    const confirmButton = modal.querySelector('.confirm-remove-button');
    const cancelButton = modal.querySelector('.cancel-remove-button');
    const modalMessage = modal.querySelector('.modal-content p');

    if (!confirmButton || !cancelButton || !modalMessage) {
      console.error("Modal elements missing (ensure 'confirm-remove-button' and 'cancel-remove-button' and 'modal-content p' exist within your modal) ");
      return;
    }
    modalMessage.textContent = message;
    modal.style.display = "block";

    const handleConfirm = () => {
        confirmCallback && confirmCallback();
        closeModal();
    };

    const handleCancel = () => {
        cancelCallback && cancelCallback();
        closeModal();
    };

    const closeModal = () => {
        modal.style.display = "none";
        confirmButton.removeEventListener('click', handleConfirm);
        cancelButton.removeEventListener('click', handleCancel);
    };

    confirmButton.addEventListener('click', handleConfirm);
    cancelButton.addEventListener('click', handleCancel);
}