import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  Layers,
  HeartHandshake,
  GraduationCap,
  Users,
} from "lucide-react";

// Import โดยไม่ใส่นามสกุลไฟล์ (Vite จะหาทั้ง .js และ .jsx ให้เองอัตโนมัติ)
import eventService from "../services/eventService";
import EventTable from "../components/EventTable";
import EventFormModal from "../components/EventFormModal";
import EventDetailModal from "../components/EventDetailModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
