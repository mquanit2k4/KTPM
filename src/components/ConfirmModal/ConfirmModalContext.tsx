import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';
import ConfirmModal from './ConfirmModel';

interface ConfirmModalOptions {
  title?: string;
  bodyText?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
}

interface ConfirmModalContextProps {
  showConfirmModal: (options: ConfirmModalOptions) => void;
  closeModal: () => void;
}

const ConfirmModalContext = createContext<ConfirmModalContextProps | undefined>(
  undefined,
);

function ConfirmModalProvider({ children }: { children: ReactNode }) {
  const [modalOptions, setModalOptions] = useState<ConfirmModalOptions | null>(
    null,
  );

  const showConfirmModal = (options: ConfirmModalOptions) => {
    setModalOptions(options);
  };

  const closeModal = () => setModalOptions(null);

  const contextValue = useMemo(
    () => ({
      showConfirmModal,
      closeModal,
    }),
    [],
  );

  return (
    <ConfirmModalContext.Provider value={contextValue}>
      {children}
      {modalOptions && (
        <ConfirmModal
          show={!!modalOptions}
          onClose={closeModal}
          onConfirm={async () => {
            await modalOptions.onConfirm();
            closeModal();
          }}
          title={modalOptions.title}
          bodyText={modalOptions.bodyText}
          confirmText={modalOptions.confirmText}
          cancelText={modalOptions.cancelText}
        />
      )}
    </ConfirmModalContext.Provider>
  );
}

export const useConfirmModal = (): ConfirmModalContextProps => {
  const context = useContext(ConfirmModalContext);
  if (!context) {
    throw new Error(
      'useConfirmModal must be used within a ConfirmModalProvider',
    );
  }
  return context;
};

export { ConfirmModalProvider };
