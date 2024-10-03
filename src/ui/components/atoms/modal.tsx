import clsx from "clsx";

export type ModalProps = {
  children?: React.ReactNode;
  onCloseModal?: () => void;
  className?: string;
  isOpen: boolean;
  zIndex?: number;
  modalClassName?: string;
};
export const Modal = ({
  children,
  onCloseModal,
  className: inputClassName,
  isOpen,
  zIndex = 50,
  modalClassName,
}: ModalProps) => {
  const className = clsx(
    `fixed flex items-center justify-center inset-0`,
    inputClassName
  );

  if (!isOpen) return null;

  return (
    <div className={className} style={{ zIndex }}>
      <div
        className={`absolute bg-black opacity-50 inset-0`}
        onClick={onCloseModal}
      />
      <div
        className={clsx(
          "bg-white p-4 max-h-full overflow-y-auto",
          modalClassName
        )}
        style={{ zIndex: zIndex + 1 }}
      >
        {children}
      </div>
    </div>
  );
};
