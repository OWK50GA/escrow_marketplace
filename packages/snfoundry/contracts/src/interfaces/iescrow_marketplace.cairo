use crate::types::{Product, Shipment};

#[starknet::interface]
pub trait IEscrowMarketPlace<TContractState> {
    // WRITE FUNCTIONS

    fn create_product(
        ref self: TContractState,
        name: felt252,
        category: felt252,
        description: felt252,
        price: u256,
        stock: u256,
    );
    fn add_products_to_group(ref self: TContractState, group_id: u256);
    // fn remove_product(ref self: TContractState);
    fn remove_product_group(ref self: TContractState, group_id: u256);
    fn buy_product(ref self: TContractState, group_id: u256, number_to_purchase: u256);
    fn confirm_shipped(ref self: TContractState, shipment_id: u256);
    fn confirm_received(ref self: TContractState, shipment_id: u256);
    fn claim_funds(ref self: TContractState, shipment_id: u256);
    fn create_dispute(ref self: TContractState, shipment_id: u256);
    fn resolve_dispute(ref self: TContractState, dispute_id: u256);

    // READ (VIEW) FUNCTIONS
    fn get_products_list(self: @TContractState) -> Array<Product>;
    fn get_product(self: @TContractState, group_id: u256) -> Product;
    fn get_shipment(self: @TContractState, shipment_id: u256) -> Shipment;
    // fn view_shipping_status(self: @TContractState) -> ShipmentStatus;
    fn get_seller_products(self: @TContractState) -> Array<Product>;
}
