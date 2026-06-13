export type Vehicle = {
  id: string;
  plate_number: string;
  vehicle_type: string;
  capacity: number;
  status: "available" | "maintenance" | "unavailable";
  assigned_driver_id: string | null;
  or_image_url: string | null;
  cr_image_url: string | null;
  created_at: string;
  updated_at: string;
  assigned_driver?: Driver;
};

export type Driver = {
  id: string;
  name: string;
  license_no: string;
  status: "available" | "on_trip" | "unavailable";
  license_image_url: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Reservation = {
  id: string;
  department_name: string;
  requestor_name: string;
  purpose: string;
  destination: string;
  departure_area: string;
  start_time: string;
  end_time: string;
  vehicle_id: string | null;
  driver_id: string | null;
  approval_letter_url: string | null;
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
  driver?: Driver;
};

export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  reorder_level: number;
  last_restocked_at: string | null;
  created_at: string;
};

export type InventoryLog = {
  id: string;
  item_id: string;
  change_amount: number;
  notes: string | null;
  created_at: string;
  item?: InventoryItem;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: 'supervisor' | 'admin';
  created_at: string;
};

export type ActivityLog = {
  id: string;
  user_id: string | null;
  user_email: string | null;
  user_name: string | null;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  details: Record<string, any> | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};


