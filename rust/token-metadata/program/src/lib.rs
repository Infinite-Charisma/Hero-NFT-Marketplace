//! A Token Metadata program for the Solana blockchain.

pub mod entrypoint;
pub mod error;
pub mod instruction;
pub mod processor;
pub mod state;
pub mod utils;
// Export current sdk types for downstream users building with a different sdk version6ssXYkgorV8uK2zzPWmwCwX4RLvLfpfJpYcnq1xcfifR
pub use solana_program;

solana_program::declare_id!("3EV9RJGyhcLdCszjDusWr1F4bzJ9Qu5s4m5SPNriuzRu");
