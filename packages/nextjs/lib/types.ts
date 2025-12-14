export enum ProductStatus {
  AVAILABLE = "AVAILABLE",
  SOLD_OUT = "SOLD_OUT",
}

export enum ShipmentStatus {
  NONE = "NONE",
  SHIPPED = "SHIPPED",
  RECEIVED = "RECEIVED",
}

export enum DisputeStatus {
  OPEN = "OPEN",
  RESOLVED = "RESOLVED",
}

export interface Product {
  group_id: string
  name: string
  category: string
  description: string
  image_url: string
  seller: string
  status: ProductStatus
  price: string
  stock: number
}

export interface Shipment {
  shipment_id: string
  number_of_products: number
  product_group_id: string
  sender: string
  recipient: string
  shipment_time: number
  expected_arrival: number
  shipment_status: ShipmentStatus
  amount: string
  product_name?: string
}

export interface Dispute {
  dispute_id: string
  shipment_id: string
  disputer: string
  reason: string
  status: DisputeStatus
  created_at: number
}
