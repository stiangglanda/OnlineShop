INSERT INTO city (name, plz)
VALUES ('Linz', 4020);

INSERT INTO city (name, plz)
VALUES ('Wilhering', 4073);

INSERT INTO city (name, plz)
VALUES ('Steyr', 4596);


INSERT INTO street (name)
VALUES ('Wiener Straße');

INSERT INTO street (name)
VALUES ('Berggasse');

INSERT INTO street (name)
VALUES ('Gsöllhofstraße');


INSERT INTO address (city_id, street_id, street_nr)
VALUES (1, 1, 181);

INSERT INTO address (city_id, street_id, street_nr)
VALUES (2, 2, 5);

INSERT INTO address (city_id, street_id, street_nr)
VALUES (3, 3, 1);


INSERT INTO user (username, firstname, lastname, email, password, balance, address_id, token)
VALUES ('thistim', 'Tim', 'Hofmann', 'timhofmann01@gmail.com', '$2b$10$zNAGq/LGwGMBIlWoCEDxFO6E70mWQfAkgRxmC0YQXTaD9fNVVTRfe', 99999, 2, '1234');

INSERT INTO user (username, firstname, lastname, email, password, balance, address_id, token)
VALUES ('stiangglanda', 'Leander', 'Kieweg', 'kieweg.leander@gmail.com', '$2b$10$zNAGq/LGwGMBIlWoCEDxFO6E70mWQfAkgRxmC0YQXTaD9fNVVTRfe', 99999, 3, '1234');

INSERT INTO user (username, firstname, lastname, email, password, balance, address_id, token)
VALUES ('TimeskateHD', 'Maximilian', 'Schernhuber', 'max.schernhuber@students.bs-linz2.ac.at', '$2b$10$zNAGq/LGwGMBIlWoCEDxFO6E70mWQfAkgRxmC0YQXTaD9fNVVTRfe', 99999, 1, '1234');


INSERT INTO article (status, name, description, price, seller_id)
VALUES (1, 'ROG Zephyrus M16', 'Gaming Laptop', 1487.08, 1);

INSERT INTO article (status, name, description, price, seller_id)
VALUES (1, 'Lenovo Idea Pad Gaming', 'Gaming Laptop', 1000.1, 2);


INSERT INTO category (name)
VALUES ('Technology');


INSERT INTO article_category (article_id, category_id)
VALUES (1, 1);

INSERT INTO article_category (article_id, category_id)
VALUES (2, 1);


INSERT INTO transaction (seller_id, buyer_id, article_id)
VALUES (2, 1, 2);


INSERT INTO image (text, url, article_id)
VALUES ('ROG Zephyrus M16', 'https://gzhls.at/i/09/62/2710962-n0.jpg', 1);

INSERT INTO image (text, url, article_id)
VALUES ('Lenovo Idea Pad Gaming', 'https://gzhls.at/i/35/48/2683548-n0.jpg', 2);