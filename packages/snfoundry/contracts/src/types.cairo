use core::num::traits::Zero;
use starknet::ContractAddress;

// #[derive(Copy, Drop, Serde, starknet::Store)]
// pub struct Product {
//     pub id: u256,
//     pub group_id: u256
// }

#[derive(Copy, Drop, Serde, PartialEq, starknet::Store)]
pub enum ProductStatus {
    #[default]
    AVAILABLE,
    NOT_AVAILABLE,
}

// TODO -> Create an Impl on this struct to change the stock quantity when buying or adding to group

#[derive(Clone, Drop, Serde, PartialEq, starknet::Store)]
pub struct Product {
    // pub product: Product,
    pub stock: u256,
    pub group_id: u256,
    pub name: felt252,
    pub category: felt252,
    pub description: felt252,
    pub image_url: ByteArray,
    pub seller: ContractAddress,
    pub status: ProductStatus,
    pub price: u256,
}

#[generate_trait]
pub impl ProductImpl of ProductTrait {
    fn default() -> Product {
        Product {
            stock: 0,
            group_id: 0,
            name: 0,
            category: 0,
            description: 0,
            image_url: "",
            seller: Zero::zero(),
            status: ProductStatus::AVAILABLE,
            price: 0,
        }
    }
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Shipment {
    pub shipment_id: u256,
    pub number_of_products: u256,
    pub product_group_id: u256,
    pub sender: ContractAddress,
    pub amount: u256,
    pub recipient: ContractAddress,
    pub shipment_time: u64,
    pub expected_arrival: u64,
    pub shipment_status: ShipmentStatus,
}

#[generate_trait]
pub impl ShipmentImpl of ShipmentTrait {
    fn default() -> Shipment {
        Shipment {
            shipment_id: 0,
            number_of_products: 0,
            product_group_id: 0,
            sender: Zero::zero(),
            amount: 0,
            recipient: Zero::zero(),
            shipment_time: 0,
            expected_arrival: 0,
            shipment_status: ShipmentStatus::NONE,
        }
    }
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub enum ShipmentStatus {
    #[default]
    NONE,
    SHIPPED,
    RECEIVED,
    CANCELLED,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Dispute {
    pub dispute_id: u256,
    pub shipment_id: u256,
    pub dispute_creation_time: u64,
    pub disputer: ContractAddress,
}
