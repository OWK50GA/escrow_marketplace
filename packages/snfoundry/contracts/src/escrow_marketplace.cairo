#[starknet::contract]
pub mod EscrowMarketplace {
    use crate::interfaces::iescrow_marketplace::IEscrowMarketPlace;
    use crate::types::{Dispute, Product, Shipment};
    use starknet::storage::{Map, StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry};
    use starknet::ContractAddress;
    use openzeppelin_access::ownable::OwnableComponent;

    #[storage]
    pub struct Storage {
        pub id_to_products: Map::<u256, Product>, // id => product
        pub seller_to_products: Map::<ContractAddress, Product>, // address => product
        pub shipments: Map::<u256, Shipment>, // shipment_id => shipment
        pub disputes: Map::<u256, Dispute>, // dispute_id => Dispute
        pub max_time_to_dispute: u64, // time between settlement and 
        #[substorage(v0)]
        pub ownable: OwnableComponent::Storage,
        pub next_product_id: u256,
        pub next_shipment_id: u256,
        pub next_dispute_id: u256,
    }

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        ProductPurchased: ProductPurchased,
        ProductRemoved: ProductRemoved,
        ProductCreated: ProductCreated,
        ProductShipped: ProductShipped,
        ShipmentReceived: ShipmentReceived,
        FundsClaimed: FundsClaimed,
        DisputeCreated: DisputeCreated,
        DisputeResolved: DisputeResolved
    }

    #[derive(Drop, starknet::Event)]
    pub struct ProductCreated {
        #[key]
        pub product_id: u256,
        #[key]
        pub creator: ContractAddress,
        pub price: u256,
        pub timestamp: u64
    }

    #[derive(Drop, starknet::Event)]
    pub struct ProductRemoved {
        #[key]
        pub product_id: u256,
        pub timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ProductPurchased {
        #[key]
        pub product_id: u256,
        #[key]
        pub buyer: ContractAddress,
        pub timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct ProductShipped {
        #[key]
        pub shipment_id: u256,
        pub timestamp: u64
    }

    #[derive(Drop, starknet::Event)]
    pub struct ShipmentReceived {
        #[key]
        pub shipment_id: u256,
        pub timestamp: u64
    }

    #[derive(Drop, starknet::Event)]
    pub struct FundsClaimed {
        #[key]
        pub shipment_id: u256,
        pub amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    pub struct DisputeCreated {
        #[key]
        pub dispute_id: u256,
        #[key]
        pub disputer: ContractAddress,
        pub timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct DisputeResolved {
        #[key]
        pub dispute_id: u256,
        pub timestamp: u64
    }

    #[constructor]
    fn constructor(ref self: ContractState, max_time_to_dispute: u64, owner: ContractAddress) {
        self.ownable.initializer(owner);
        self.next_dispute_id.write(1);
        self.next_product_id.write(1);
        self.next_shipment_id.write(1);
    }

    #[abi(embed_v0)]
    pub impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    pub impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    pub impl EscrowMarketplaceImpl of IEscrowMarketPlace<ContractState> {
        fn create_product(
            ref self: ContractState,
            name: felt252,
            category: felt252,
            description: felt252,
            price: u256,
            stock: u256,
        ) {

        }

        fn add_products_to_group(ref self: ContractState, group_id: u256) {}

        fn remove_product_group(ref self: ContractState, group_id: u256) {}

        fn buy_product(ref self: ContractState, group_id: u256, number_to_purchase: u256) {}

        fn confirm_shipped(ref self: ContractState, shipment_id: u256) {}

        fn confirm_received(ref self: ContractState, shipment_id: u256) {}

        fn claim_funds(ref self: ContractState, shipment_id: u256) {}

        fn create_dispute(ref self: ContractState, shipment_id: u256) {}

        fn resolve_dispute(ref self: ContractState, dispute_id: u256) {}

        // READ (VIEW) FUNCTIONS
        fn get_products_list(self: @ContractState) -> Array<Product> {}
        fn get_product(self: @ContractState, group_id: u256) -> Product {}

        fn get_shipment(self: @ContractState, shipment_id: u256) -> Shipment {}

        fn get_seller_products(self: @ContractState) -> Array<Product> {}
    }
}
