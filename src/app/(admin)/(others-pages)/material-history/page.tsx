"use client";
import { useEffect, useState, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import HistoryForm from "./HistoryForm";
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';
import MaterialHistoryPage from './MaterialHistoryPage';
import { MaterialHistory } from '@prisma/client';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Material {
  id: number;
  name: string;
  category?: { id: number; name: string };
  brand?: string;
  model?: string;
  serial?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface MaterialHistoryWithDetails {
  id: number;
  materialId: number;
  handlerId: number;
  type: string;
  quantity: number;
  date: string;
  memo: string;
  material: {
    name: string;
    rfid_tag: string;
  };
  handler: {
    name: string;
  };
}

export default function Page() {
  return <MaterialHistoryPage />;
} 