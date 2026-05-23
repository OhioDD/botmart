-- Add success token fields to orders table
ALTER TABLE orders
ADD COLUMN success_token TEXT UNIQUE,
ADD COLUMN token_used BOOLEAN DEFAULT FALSE;

-- Create index for faster token lookups
CREATE INDEX idx_orders_success_token ON orders(success_token);
