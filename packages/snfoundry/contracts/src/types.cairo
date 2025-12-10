use starknet::ContractAddress;

// #[derive(Copy, Drop, Serde, starknet::Store)]
// pub struct Product {
//     pub id: u256,
//     pub group_id: u256
// }

#[derive(Copy, Drop, Serde, starknet::Store)]
pub enum ProductStatus {
    #[default]
    LISTED,
    PAID_FOR,
    SHIPPED,
    RECEIVED,
    CANCELLED,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Product {
    // pub product: Product,
    pub stock: u256,
    pub group_id: u256,
    pub name: felt252,
    pub category: felt252,
    pub description: felt252,
    pub seller: ContractAddress,
    pub status: ProductStatus,
    pub price: u256,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Shipment {
    pub shipment_id: u256,
    pub number_of_products: u256,
    pub product_group_id: u256,
    pub sender: ContractAddress,
    pub recipient: ContractAddress,
    pub shipment_time: u64,
    pub expected_arrival: u64,
    pub shipment_status: ShipmentStatus,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub enum ShipmentStatus {
    #[default]
    NONE,
    SHIPPED,
    RECEIVED,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Dispute {
    pub dispute_id: u256,
    pub shipment_id: u256,
    pub dispute_creation_time: u64,
    pub disputer: ContractAddress,
}
