"use client";

import { useTour } from "@reactour/tour";
import { Button, Modal } from "../../components";
import { useTranslations } from "@/src/translations/use-translations";
import { useEffect, useState } from "react";
import { setTourFinished } from "@/src/form-actions/user";
import { useFormState, useFormStatus } from "react-dom";

export default function TourProvider() {
  const { setIsOpen, isOpen } = useTour();
  const { dict } = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isThanksModalOpen, setIsThanksModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen && !isModalOpen) {
      setIsThanksModalOpen(true);
    }
  }, [isOpen, isModalOpen]);

  const { pending: loading } = useFormStatus();
  const [status, formAction] = useFormState(setTourFinished, null);

  useEffect(() => {
    if (status === "success") {
      setIsThanksModalOpen(false);
    }
  }, [status]);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        className="p-10"
        modalClassName="sm:max-w-[400px]"
      >
        <div className="font-bold text-lg mb-2">{dict.tour?.welcomeTitle}</div>
        <div className="mb-5">{dict.tour?.step0}</div>
        <Button
          onClick={() => {
            setIsOpen(true);
            setIsModalOpen(false);
          }}
        >
          {dict.tour?.start}
        </Button>
      </Modal>

      <Modal
        isOpen={isThanksModalOpen}
        className="p-10"
        modalClassName="sm:max-w-[400px]"
      >
        <form action={formAction}>
          <div className="font-bold text-lg mb-2">{dict.tour?.endTitle}</div>
          <div className="mb-5">{dict.tour?.endMessage}</div>
          <Button type="submit" loading={loading}>
            {dict.shared?.close}
          </Button>
        </form>
      </Modal>
    </>
  );
}
