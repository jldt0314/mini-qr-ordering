-- ============================================================
-- Mini QR Ordering System — Database Schema
-- CubeTech OJT Take-Home Assessment
-- Run this entire script once in your DBCode Query Editor
-- ============================================================

CREATE DATABASE IF NOT EXISTS cubetech_qr_ordering
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cubetech_qr_ordering;

-- ------------------------------------------------------------
-- TABLE 1: products
-- Stores the menu items shown on the QR ordering page.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)    NOT NULL,
  description TEXT,
  price       DECIMAL(8, 2)   NOT NULL,
  image_url   VARCHAR(255),
  is_available TINYINT(1)     NOT NULL DEFAULT 1,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
);

-- ------------------------------------------------------------
-- TABLE 2: orders
-- Represents one customer order session (one table/scan).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  table_number VARCHAR(20)     NOT NULL,
  status       ENUM(
                 'pending',
                 'confirmed',
                 'preparing',
                 'ready',
                 'completed',
                 'cancelled'
               )               NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
                               ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
);

-- ------------------------------------------------------------
-- TABLE 3: order_items  ← the junction / bridge table
-- Resolves the many-to-many relationship between orders
-- and products. One row = one line item on an order.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  order_id    INT UNSIGNED    NOT NULL,
  product_id  INT UNSIGNED    NOT NULL,
  quantity    TINYINT UNSIGNED NOT NULL DEFAULT 1,
  unit_price  DECIMAL(8, 2)   NOT NULL,  -- snapshot of price at order time

  PRIMARY KEY (id),

  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,

  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- SEED DATA — Sample menu items so you can test immediately
-- ------------------------------------------------------------
INSERT INTO products (name, description, price, image_url) VALUES
  ('Cheeseburger',    'Beef patty with cheddar, lettuce, tomato', 129.00, NULL),
  ('Chicken Sandwich','Crispy chicken fillet with mayo and pickles', 119.00, NULL),
  ('Loaded Fries',    'Crinkle-cut fries with cheese sauce and bacon', 89.00,  NULL),
  ('Iced Coffee',     'Cold brew with milk and light sugar',          69.00,  NULL),
  ('Bottled Water',   'Still mineral water 500ml',                    35.00,  NULL);