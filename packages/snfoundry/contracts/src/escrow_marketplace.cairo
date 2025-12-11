#[starknet::contract]
pub mod EscrowMarketplace {
    use core::num::traits::Zero;
use crate::interfaces::iescrow_marketplace::IEscrowMarketPlace;
    use crate::types::{Dispute, Product, Shipment, ProductStatus, ShipmentStatus};
    use starknet::storage::{Map, StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Vec, VecTrait, MutableVecTrait};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp, get_contract_address};
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

    #[storage]
    pub struct Storage {
        pub id_to_product: Map::<u256, Product>, // id => product
        pub seller_to_products: Map::<ContractAddress, Map::<u256, Product>>, // address => product
        pub shipments: Map::<u256, Shipment>, // shipment_id => shipment
        pub disputes: Map::<u256, Dispute>, // dispute_id => Dispute
        pub max_time_to_dispute: u64, // time after shipment (and delivery) within which a user can dispute
        #[substorage(v0)]
        pub ownable: OwnableComponent::Storage,
        pub next_product_id: u256,
        pub next_shipment_id: u256,
        pub next_dispute_id: u256,
        pub accepted_token: ContractAddress,
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
    fn constructor(ref self: ContractState, max_time_to_dispute: u64, owner: ContractAddress, accepted_token: ContractAddress) {
        self.ownable.initializer(owner);
        self.next_dispute_id.write(1);
        self.next_product_id.write(1);
        self.next_shipment_id.write(1);
        self.accepted_token.write(accepted_token);
    }

    #[abi(embed_v0)]
    pub impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    pub impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    // Imagine a buyer pays for a product, there should be a time limit within which the seller should confirm_shipped, 
    // else the contract returns the buyer's money

    #[abi(embed_v0)]
    pub impl EscrowMarketplaceImpl of IEscrowMarketPlace<ContractState> {
        fn create_product(
            ref self: ContractState,
            name: felt252,
            category: felt252,
            description: felt252,
            image_url: ByteArray,
            price: u256,
            stock: u256,
        ) {
            let group_id = self.next_product_id.read();
            let seller = get_caller_address();

            assert(stock != 0, 'Zero Stock Product');
            assert(seller.is_non_zero(), 'Zero Address Seller');
            assert(name != 0 && category != 0 && description != 0, 'Invalid Product Details');
            assert(price != 0, 'Cannot create free product');

            let product = Product {
                stock,
                group_id,
                name,
                category,
                description,
                image_url,
                seller,
                status: ProductStatus::AVAILABLE,
                price,
            };

            self.next_product_id.write(group_id + 1);
            self.id_to_product.entry(group_id).write(product.clone());
            self.seller_to_products.entry(seller).entry(group_id).write(product);
            self.emit(
                ProductCreated {
                    product_id: group_id,
                    creator: seller,
                    price,
                    timestamp: get_block_timestamp()
                }
            );
        }

        fn add_products_to_group(ref self: ContractState, group_id: u256, number_of_products: u256) {
            let caller = get_caller_address();
            let mut product = self.id_to_product.entry(group_id).read();

            assert(caller == product.seller, 'Caller not allowed');

            product.stock += number_of_products;

            self.id_to_product.entry(group_id).write(product.clone());
            self.seller_to_products.entry(caller).entry(group_id).write(product);
            // TODO: Update the seller_to_products Vec
        }

        fn remove_product_group(ref self: ContractState, group_id: u256) {
            let caller = get_caller_address();
            let mut product = self.id_to_product.entry(group_id).read();

            assert(caller == product.seller, 'Caller not allowed');

            product.stock = 0;

            self.id_to_product.entry(group_id).write(product.clone());
            self.seller_to_products.entry(caller).entry(group_id).write(product);

            self.emit(
                ProductRemoved {
                    product_id: group_id,
                    timestamp: get_block_timestamp()
                }
            );
        }

        fn buy_product(ref self: ContractState, group_id: u256, number_to_purchase: u256) {
            let buyer = get_caller_address();
            assert(buyer.is_non_zero(), 'Zero address buyer');

            let mut product = self.id_to_product.entry(group_id).read();
            assert(product.stock >= number_to_purchase, 'Insufficient Stock');

            let seller = product.seller;
            let amount = product.price * number_to_purchase;

            let this_contract = get_contract_address();

            // transfer price from buyer to this contract;
            let token_dispatcher = IERC20Dispatcher { contract_address: self.accepted_token.read() };

            // Todo: Divide the price for market creator to get commission
            let transfer = token_dispatcher.transfer_from(buyer, this_contract, amount);

            assert(transfer, 'Transfer unsuccessful');

            product.stock -= number_to_purchase;

            self.id_to_product.entry(group_id).write(product.clone());
            self.seller_to_products.entry(seller).entry(group_id).write(product);

            let shipment_id = self.next_shipment_id.read();

            let new_shipment = Shipment {
                shipment_id,
                number_of_products: number_to_purchase,
                product_group_id: group_id,
                sender: seller,
                recipient: buyer,
                shipment_time: 0,
                expected_arrival: 0,
                shipment_status: ShipmentStatus::NONE,
                amount
            };

            self.shipments.entry(shipment_id).write(new_shipment);
            self.next_shipment_id.write(shipment_id + 1);

            self.emit(
                ProductPurchased {
                    product_id: group_id,
                    buyer,
                    timestamp: get_block_timestamp()
                }
            );
        }

        fn confirm_shipped(ref self: ContractState, shipment_id: u256, expected_shipment_time: u64) {
            let caller = get_caller_address();
            let mut shipment = self.shipments.entry(shipment_id).read();
            assert(caller == shipment.sender, 'Caller not allowed');

            shipment.shipment_time = expected_shipment_time;
            shipment.expected_arrival = get_block_timestamp() + expected_shipment_time;

            shipment.shipment_status = ShipmentStatus::SHIPPED;

            self.shipments.entry(shipment_id).write(shipment);

            self.emit(
                ProductShipped {
                    shipment_id,
                    timestamp: get_block_timestamp()
                }
            );
        }

        fn confirm_received(ref self: ContractState, shipment_id: u256) {
            let mut shipment = self.shipments.entry(shipment_id).read();
            let caller = get_caller_address();

            assert(caller == shipment.recipient, 'Caller not allowed');

            shipment.shipment_status = ShipmentStatus::RECEIVED;

            self.shipments.entry(shipment_id).write(shipment);
            self.emit(
                ShipmentReceived {
                    shipment_id,
                    timestamp: get_block_timestamp()
                }
            );
        }

        fn claim_funds(ref self: ContractState, shipment_id: u256) {
            let caller = get_caller_address();
            let mut shipment = self.shipments.entry(shipment_id).read();
            assert(caller == shipment.sender, 'Invalid claim to funds');
            let amount = shipment.amount;
            assert(amount != 0, 'Cannot claim zero');

            let token_dispatcher = IERC20Dispatcher { contract_address: self.accepted_token.read() };

            let transfer = token_dispatcher.transfer(shipment.sender, shipment.amount);
            assert(transfer, 'Transfer failed');

            shipment.amount = 0;

            self.shipments.entry(shipment_id).write(shipment);

            self.emit(
                FundsClaimed {
                    shipment_id,
                    amount
                }
            );
        }

        fn create_dispute(ref self: ContractState, shipment_id: u256) {}

        fn resolve_dispute(ref self: ContractState, dispute_id: u256) {}

        // READ (VIEW) FUNCTIONS
        fn get_products_list(self: @ContractState) -> Array<Product> {}
        fn get_product(self: @ContractState, group_id: u256) -> Product {}

        fn get_shipment(self: @ContractState, shipment_id: u256) -> Shipment {}

        fn get_seller_products(self: @ContractState) -> Array<Product> {}
    }
}