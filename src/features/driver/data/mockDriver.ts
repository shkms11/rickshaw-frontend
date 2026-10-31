import type { Driver } from "../types/driver.type";

/** Sample driver fixture for UI development; the active dashboard loads its profile from the API. */
export const mockDriver: Driver = {
  id: "d1",
  name: "Rahim",
  phone: "01700000000",
  nid: "1234567890",
  licenseNumber: "LIC-2025-001",

  status: "active",

  assignedRickshawId: "R-102",

  address: {
    line1: "House 12",
    area: "Kaliganj",
    city: "Dhaka",
    country: "Bangladesh",
  },

  walletBalance: 1250,
  todayEarnings: 320,
  payoutStatus: "ready_to_withdraw",

  createdAt: new Date().toISOString(),
};
