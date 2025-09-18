CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(13) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    avatarImg VARCHAR(255),
    bannerImg VARCHAR(255),
    INDEX active_index_users (active)
);

CREATE TABLE address (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lat DECIMAL(10,8) NOT NULL,
    lng DECIMAL(11,8) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(10) NOT NULL,
    complement VARCHAR(255),
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    country_iso VARCHAR(2) NOT NULL,
    postal_code VARCHAR(8) NOT NULL,
    user_id INT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX active_index_address (active),
    INDEX idx_location (lat, lng)
);

CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
)

CREATE TABLE client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    main_address_id INT,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (main_address_id) REFERENCES address(id),
)

CREATE TABLE professional (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    main_address_id INT,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (main_address_id) REFERENCES address(id)
);

CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    INDEX active_index_category (active)
);

CREATE TABLE subcategory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id),
    INDEX active_index_subcategory (active)
);

CREATE TABLE service (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration INT NOT NULL COMMENT 'Duration in minutes',
    bannerImg VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    subcategory_id INT NOT NULL,
    professional_id INT NOT NULL,
    FOREIGN KEY (subcategory_id) REFERENCES subcategory(id),
    FOREIGN KEY (professional_id) REFERENCES professional(id),
    INDEX active_index_service (active),
    INDEX professional_service_index (professional_id)
);

CREATE TABLE amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    );

CREATE TABLE professional_amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professional_id INT NOT NULL,
    amenity_id INT NOT NULL,
    FOREIGN KEY (professional_id) REFERENCES professional(id),
    FOREIGN KEY (amenity_id) REFERENCES amenities(id)
);

CREATE TABLE professional_availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professional_id INT NOT NULL,
    days_of_week VARCHAR(7) DEFAULT '0000000', -- Bitmask (Dom=primeiro, Sáb=último). Ex: Seg-Sex = '0111110'
    start_day_of_month INT CHECK (start_day_of_month BETWEEN 1 AND 31) DEFAULT NULL, -- Dia do mês inicial (opcional)
    end_day_of_month INT CHECK (start_day_of_month BETWEEN 1 AND 31) DEFAULT NULL, -- Dia do mês final (opcional)
    CHECK (start_day_of_month <= end_day_of_month),
    start_day DATE, -- Data inicial da disponibilidade (opcional)
    end_day DATE, -- Data final (opcional)
    start_time TIME NOT NULL, -- Horário de início (ex: 09:00:00)
    end_time TIME NOT NULL, -- Horário de término (ex: 18:00:00)
    is_available BOOLEAN DEFAULT TRUE,
    recurrence_pattern ENUM('none', 'daily', 'weekly', 'monthly') DEFAULT 'none',
    FOREIGN KEY (professional_id) REFERENCES professional(id),
    INDEX idx_recurrence_combo (professional_id, recurrence_pattern, start_day, end_day)
);

/*
  -- Exemplo 1: profissional disponível de segunda a sexta-feira, das 9h às 18h, válido por 2024 inteiro:

INSERT INTO professional_availability (
    professional_id,
    days_of_week,
    start_time,
    end_time,
    recurrence_pattern,
    start_day,
    end_day
) VALUES (
    1,
    '0111110', -- Seg-Sex
    '09:00:00',
    '18:00:00',
    'weekly',
    '2024-01-01', -- Início
    '2024-12-31'  -- Término
);

  -- Exemplo 2: profissional disponível todo dia 4 de cada mês, das 10h às 12h:

INSERT INTO professional_availability (
    professional_id,
    day_of_month,
    start_time,
    end_time,
    recurrence_pattern
) VALUES (
    1,
    4, -- Dia 4 do mês
    '10:00:00',
    '12:00:00',
    'monthly' -- Não precisa de start_day/end_day
);

  -- Exemplo 3: profissional disponível unicamente no dia 15 de janeiro de 2024, das 14h às 16h:

  INSERT INTO professional_availability (
    professional_id,
    days_of_week,
    start_time,
    end_time,
    recurrence_pattern,
    start_day,
    end_day
  ) VALUES (
    1, -- ID do profissional
    '0000000', -- Nenhum dia da semana (Dom=0, Seg=0, Ter=0, Qua=0, Qui=0, Sex=0, Sáb=0)
    '14:00:00',
    '16:00:00',
    'none', -- Sem recorrência
    '2024-01-15', -- Data inicial
    '2024-01-15' -- Data final
  );
*/

CREATE TABLE professional_availability_lock (
    professional_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    PRIMARY KEY (professional_id, start_time, end_time),
    FOREIGN KEY (professional_id) REFERENCES professional(id)
);

CREATE TABLE professional_gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professional_id INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (professional_id) REFERENCES professional(id)
);

CREATE TABLE appointment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professional_id INT NOT NULL,
    client_id INT NOT NULL,
    service_id INT NOT NULL,
    address_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'canceled') DEFAULT 'pending',
    FOREIGN KEY (professional_id) REFERENCES professional(id),
    FOREIGN KEY (client_id) REFERENCES client(id),
    FOREIGN KEY (service_id) REFERENCES service(id),
    FOREIGN KEY (address_id) REFERENCES address(id),
    INDEX idx_appointment_times (professional_id, start_time, end_time),
    INDEX idx_status_check (status, start_time)
);

CREATE TABLE admin_service_order (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    appointment_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'canceled') DEFAULT 'pending',
    FOREIGN KEY (admin_id) REFERENCES admin(id),
    FOREIGN KEY (appointment_id) REFERENCES appointment(id),
    INDEX idx_status_check (status, INDEX idx_appointment_check (appointment_id, status)
);