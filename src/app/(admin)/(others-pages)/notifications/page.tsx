"use client";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import NotificationForm from "./NotificationForm";

const notifications = [
  {
    id: 1,
    title: 'Rental Expiration Reminder',
    message: 'The rental for Black Suit is due on May 19, 2024.',
  },
  {
    id: 2,
    title: 'Rental Expiration Reminder',
    message: 'The rental for Stage Lighting Set is due on May 21, 2024.',
  },
  {
    id: 3,
    title: 'Rental Expiration Reminder',
    message: 'The rental for Troplay is due on May 24, 2024.',
  },
  {
    id: 4,
    title: 'Rental Expiration Reminder',
    message: 'The rental for Enantrone is due on May 24, 2024.',
  },
];

export default function NotificationsPage() {
  const [data, setData] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { isOpen: modalOpen, openModal, closeModal } = useModal();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    openModal();
  };

  const handleRegisterClick = () => {
    setSelectedNotification(null);
    openModal();
  };

  return (
    <div className="p-4">
      {notifications.map((item) => (
        <div key={item.id} className="border p-2 mb-2 rounded">
          <h2 className="font-semibold">{item.title}</h2>
          <p className="text-sm">{item.message}</p>
        </div>
      ))}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <NotificationForm
          notification={selectedNotification}
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            fetchData();
          }}
        />
      </Modal>
    </div>
  );
} 