insert into public.profiles (id, role, full_name, bairro, category, is_staff)
values
  ('00000000-0000-0000-0000-000000000001', 'consumidor', 'Usuário Exemplo', 'Itaipuaçu', 'artesanato', false)
  on conflict (id) do nothing;

insert into public.profiles (id, role, full_name, bairro, category, is_staff)
values
  ('00000000-0000-0000-0000-0000000000aa', 'cooperativa', 'Admin Mumbuca', 'Centro', 'admin', true)
  on conflict (id) do nothing;

insert into public.cooperatives (id, name, bairro, admin_user_id)
values
  ('11111111-1111-1111-1111-111111111111', 'Cooperativa Maricá Solidária', 'Araçatiba', '00000000-0000-0000-0000-0000000000aa')
  on conflict (id) do nothing;

insert into public.cooperative_members (cooperative_id, user_id, role)
values ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'member')
  on conflict do nothing;

insert into public.products (id, cooperative_id, name, description, price_mbc, stock, category)
values ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Bolsa de palha', 'Feita à mão por artesãs locais', 120, 10, 'artesanato')
  on conflict (id) do nothing; 