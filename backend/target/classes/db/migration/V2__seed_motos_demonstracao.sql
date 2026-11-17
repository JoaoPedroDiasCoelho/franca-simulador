-- Migration V2: Carga de dados inicial de motocicletas de demonstração
INSERT INTO motos (marca, modelo, categoria, cilindrada, ano_modelo, preco, imagem_url, descricao, ativa)
VALUES 
(
    'Honda', 
    'CG 160 Fan', 
    'Street', 
    162, 
    2024, 
    17890.00, 
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', 
    'A moto mais vendida do Brasil, referência em robustez, economia de combustível e baixo custo de manutenção.', 
    TRUE
),
(
    'Honda', 
    'Biz 125', 
    'Scooter', 
    124, 
    2024, 
    15500.00, 
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', 
    'Praticidade urbana com câmbio semiautomático e amplo porta-objetos sob o assento.', 
    TRUE
),
(
    'Yamaha', 
    'Fazer FZ25', 
    'Street', 
    249, 
    2024, 
    23490.00, 
    'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80', 
    'Design esportivo e agressivo com farol projetor de LED, freios ABS de série e motor ágil de 250cc.', 
    TRUE
),
(
    'Yamaha', 
    'NMAX 160 Connected', 
    'Scooter', 
    155, 
    2024, 
    21290.00, 
    'https://images.unsplash.com/photo-1568772585472-88f572a1cf5d?auto=format&fit=crop&w=800&q=80', 
    'Scooter premium com controle de tração, chave presencial Smart Key e conectividade Bluetooth.', 
    TRUE
),
(
    'Honda', 
    'NXR 160 Bros ESDD', 
    'Trail', 
    162, 
    2024, 
    20500.00, 
    'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=800&q=80', 
    'Versatilidade para encarar o asfalto irregular e vias de terra com suspensões de longo curso e conforto.', 
    TRUE
),
(
    'Royal Enfield', 
    'Hunter 350', 
    'Custom', 
    349, 
    2024, 
    19990.00, 
    'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80', 
    'Estilo clássico e pilotagem urbana descontraída com motor de torque suave e sonoridade marcante.', 
    TRUE
),
(
    'Kawasaki', 
    'Ninja 400', 
    'Esportiva', 
    399, 
    2024, 
    35990.00, 
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', 
    'Superesportiva de entrada com 48 cv, embreagem assistida e deslizante, e ciclística precisa.', 
    TRUE
),
(
    'BMW', 
    'G 310 GS', 
    'Trail', 
    313, 
    2024, 
    38500.00, 
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80', 
    'Espírito aventureiro da família GS em versão compacta e ágil para viagens e uso diário.', 
    TRUE
);
