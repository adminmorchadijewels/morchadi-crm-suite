-- Create customers table
CREATE TABLE public.customers (
    customer_id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    customer_country TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create sales table
CREATE TABLE public.sales (
    order_id TEXT PRIMARY KEY,
    order_date DATE,
    total NUMERIC DEFAULT 0,
    invoice TEXT,
    status TEXT DEFAULT 'Pending',
    customer_id TEXT REFERENCES public.customers(customer_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    source TEXT,
    order_status TEXT DEFAULT 'New',
    shipped TEXT DEFAULT 'No',
    tracking_id_shared TEXT DEFAULT 'No',
    delivered TEXT DEFAULT 'No',
    payment_type TEXT,
    amount_received NUMERIC DEFAULT 0,
    tracking_id TEXT,
    amount_pending NUMERIC DEFAULT 0,
    remark TEXT,
    order_type TEXT NOT NULL DEFAULT 'Sales order' CHECK (order_type IN ('Sales order', 'Quotation'))
);

-- Enable RLS on both tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Create policies for customers (allow all authenticated users)
CREATE POLICY "Users can view all customers" ON public.customers
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create customers" ON public.customers
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update customers" ON public.customers
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can delete customers" ON public.customers
FOR DELETE TO authenticated USING (true);

-- Create policies for sales (allow all authenticated users)
CREATE POLICY "Users can view all sales" ON public.sales
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create sales" ON public.sales
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update sales" ON public.sales
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can delete sales" ON public.sales
FOR DELETE TO authenticated USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
BEFORE UPDATE ON public.sales
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();