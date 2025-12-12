-- Create pre_orders table for storing customer pre-order details
CREATE TABLE public.pre_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  size TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pre_orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert pre-orders (public form)
CREATE POLICY "Anyone can create pre-orders"
ON public.pre_orders
FOR INSERT
WITH CHECK (true);

-- Only allow reading pre-orders for authenticated admin users (we'll implement this later)
-- For now, allow all reads for dashboard demo purposes
CREATE POLICY "Allow reading pre-orders"
ON public.pre_orders
FOR SELECT
USING (true);