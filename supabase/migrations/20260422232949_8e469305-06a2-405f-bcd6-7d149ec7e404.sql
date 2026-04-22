-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.app_role AS ENUM ('fornecedor', 'assistente', 'deposito', 'admin');
CREATE TYPE public.appointment_status AS ENUM ('pendente', 'aprovado', 'rejeitado', 'cancelado', 'concluido');
CREATE TYPE public.cargo_type AS ENUM ('refrigerada', 'seca', 'perecivel', 'congelada', 'outros');
CREATE TYPE public.notification_type AS ENUM ('status_change', 'reminder', 'system');

-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =========================================
-- USER ROLES (separado por segurança)
-- =========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função SECURITY DEFINER para checar papel sem recursão de RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =========================================
-- SUPPLIERS
-- =========================================
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  cnpj TEXT NOT NULL UNIQUE,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT NOT NULL,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- =========================================
-- STORES
-- =========================================
CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  daily_capacity INTEGER NOT NULL DEFAULT 20,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- =========================================
-- TIME SLOTS
-- =========================================
CREATE TABLE public.time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 1,
  used_capacity INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, date, time)
);

ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_time_slots_store_date ON public.time_slots(store_id, date);

-- =========================================
-- APPOINTMENTS
-- =========================================
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE RESTRICT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  cargo_type cargo_type NOT NULL,
  volume_estimate TEXT,
  invoice_number TEXT,
  notes TEXT,
  status appointment_status NOT NULL DEFAULT 'pendente',
  rejection_reason TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_appointments_supplier ON public.appointments(supplier_id);
CREATE INDEX idx_appointments_store_date ON public.appointments(store_id, date);
CREATE INDEX idx_appointments_status ON public.appointments(status);

-- =========================================
-- APPOINTMENT HISTORY
-- =========================================
CREATE TABLE public.appointment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointment_history ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_history_appointment ON public.appointment_history(appointment_id);

-- =========================================
-- NOTIFICATIONS
-- =========================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  type notification_type NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read);

-- =========================================
-- TRIGGERS: updated_at
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_suppliers_updated BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_stores_updated BEFORE UPDATE ON public.stores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_time_slots_updated BEFORE UPDATE ON public.time_slots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_appointments_updated BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- TRIGGER: auto-create profile no signup
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data ->> 'phone'
  );

  -- Papel default: fornecedor (admin pode promover depois)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'fornecedor');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- RLS POLICIES
-- =========================================

-- PROFILES
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'assistente'));

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- USER_ROLES
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- SUPPLIERS
CREATE POLICY "Suppliers view own data" ON public.suppliers
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'assistente')
    OR public.has_role(auth.uid(), 'deposito')
  );

CREATE POLICY "Suppliers update own data" ON public.suppliers
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Suppliers insert own data" ON public.suppliers
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage suppliers" ON public.suppliers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- STORES (todos autenticados podem ver lojas ativas)
CREATE POLICY "Authenticated view stores" ON public.stores
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins manage stores" ON public.stores
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- TIME SLOTS
CREATE POLICY "Authenticated view slots" ON public.time_slots
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins manage slots" ON public.time_slots
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Assistants update slot capacity" ON public.time_slots
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'assistente'));

-- APPOINTMENTS
CREATE POLICY "Suppliers view own appointments" ON public.appointments
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.suppliers s WHERE s.id = supplier_id AND s.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'assistente')
    OR public.has_role(auth.uid(), 'deposito')
  );

CREATE POLICY "Suppliers create own appointments" ON public.appointments
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.suppliers s WHERE s.id = supplier_id AND s.user_id = auth.uid())
    AND created_by = auth.uid()
  );

CREATE POLICY "Suppliers update own pending appointments" ON public.appointments
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.suppliers s WHERE s.id = supplier_id AND s.user_id = auth.uid())
    AND status = 'pendente'
  );

CREATE POLICY "Assistants manage appointments" ON public.appointments
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'assistente') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete appointments" ON public.appointments
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- APPOINTMENT HISTORY
CREATE POLICY "View history of visible appointments" ON public.appointment_history
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      LEFT JOIN public.suppliers s ON s.id = a.supplier_id
      WHERE a.id = appointment_id
        AND (
          s.user_id = auth.uid()
          OR public.has_role(auth.uid(), 'admin')
          OR public.has_role(auth.uid(), 'assistente')
          OR public.has_role(auth.uid(), 'deposito')
        )
    )
  );

CREATE POLICY "Insert history" ON public.appointment_history
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- NOTIFICATIONS
CREATE POLICY "Users view own notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System and staff create notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'assistente')
    OR auth.uid() = user_id
  );