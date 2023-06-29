import { db, nextId } from './db.js';
import Category from './category.js';
import User from './user.js';

export default class Article {
	constructor(id, status, name, description, price, seller, categories, images) {
		this.id = id;
		this.status = status;
		this.name = name;
		this.description = description;
		this.price = price;
		this.seller = seller;
		this.categories = categories;
		this.images = images;
	}

	/**
	 * Lists all enabled articles.
	 * @returns {Promise<Array<Article>>} The articles.
	 */
	static async list() {
		const [articles] = await db.query('SELECT * FROM article WHERE status = 1');

		let [images] = await db.query('SELECT id, url, article_id FROM image');
		images = images.map((image) => {
			return {
				id: image.id,
				url: image.url,
				article_id: image.article_id
			};
		});

		let [categories] = await db.query('SELECT * FROM category');
		categories = categories.map((category) => {
			return {
				id: category.id,
				name: category.name
			};
		});

		let [article_categories] = await db.query('SELECT * FROM article_category');
		article_categories = article_categories.map((article_category) => {
			return {
				article_id: article_category.article_id,
				category_id: article_category.category_id
			};
		});

		let result = articles.map(async (article) => {
			const art_img = images.filter((image) => image.article_id === article.id);
			const art_categories = article_categories.filter((article_category) => article_category.article_id === article.id).map((article_category) => article_category.category_id);
			const cat = categories.filter((category) => art_categories.includes(category.id));

			let seller = await User.findById(article.seller_id);

			return new Article(article.id, article.status, article.name, article.description, article.price, seller, cat, art_img);
		});

		return Promise.all(result);
	}

	/**
	 * Lists all enabled articles.
	 * @param {Array<string>} category The category.
	 * @param {number} priceFrom The price from.
	 * @param {number} priceTo The price to.
	 * @returns {Promise<Array<Article>>} The articles.
	 */
	static async listFiltered(category, priceFrom, priceTo) {
		let [articles] = [];

		if (category && priceFrom && priceTo) {
			[articles] = await db.query(
				`
			SELECT distinct a.id, 
				   a.status, 
				   a.name, 
				   a.description, 
				   a.price, 
				   a.seller_id 
			  FROM article a, 
				   category c, 
				   article_category ac 
			 WHERE a.status = 1 
			   and a.id=ac.article_id 
			   and c.id=ac.category_id 
			   and c.name in (?) 
			   and a.price between ? and ?`,
				[category, priceFrom, priceTo]
			);
		} else if (category && !priceFrom && !priceTo) {
			[articles] = await db.query(
				`
			SELECT distinct a.id, 
				   a.status, 
				   a.name, 
				   a.description, 
				   a.price, 
				   a.seller_id 
			  FROM article a, 
				   category c, 
				   article_category ac 
			 WHERE a.status = 1 
			   and a.id=ac.article_id 
			   and c.id=ac.category_id 
			   and c.name in (?)`,
				[category]
			);
		} else if (!category && priceFrom && priceTo) {
			[articles] = await db.query(
				`
				SELECT distinct a.id,
					   a.status,
					   a.name,
					   a.description,
					   a.price,
					   a.seller_id
				  FROM article a
		     	 WHERE a.status = 1
			   	   and a.price between ? and ?`,
				[priceFrom, priceTo]
			);
		} else if (!category && priceFrom && !priceTo) {
			[articles] = await db.query(
				`
			SELECT distinct a.id, 
				   a.status, 
				   a.name, 
				   a.description, 
				   a.price, 
				   a.seller_id 
			  FROM article a
			 WHERE a.status = 1  
			   and a.price >= ?`,
				[priceFrom]
			);
		} else if (!category && !priceFrom && priceTo) {
			[articles] = await db.query(
				`
			SELECT distinct a.id, 
				   a.status, 
				   a.name, 
				   a.description, 
				   a.price, 
				   a.seller_id 
			  FROM article a
			 WHERE a.status = 1
			   and a.price <= ?`,
				[priceTo]
			);
		}

		let [images] = await db.query('SELECT id, url, article_id FROM image');
		images = images.map((image) => {
			return {
				id: image.id,
				url: image.url,
				article_id: image.article_id
			};
		});

		let [categories] = await db.query('SELECT * FROM category');
		categories = categories.map((category) => {
			return {
				id: category.id,
				name: category.name
			};
		});

		let [article_categories] = await db.query('SELECT * FROM article_category');
		article_categories = article_categories.map((article_category) => {
			return {
				article_id: article_category.article_id,
				category_id: article_category.category_id
			};
		});

		let result = articles.map(async (article) => {
			const art_img = images.filter((image) => image.article_id === article.id);
			const art_categories = article_categories.filter((article_category) => article_category.article_id === article.id).map((article_category) => article_category.category_id);
			const cat = categories.filter((category) => art_categories.includes(category.id));

			let seller = await User.findById(article.seller_id);

			return new Article(article.id, article.status, article.name, article.description, article.price, seller, cat, art_img);
		});

		return Promise.all(result);
	}

	/**
	 * Finds an article by id.
	 * @param {number} id The article's id.
	 * @returns {Promise<Article>} The article.
	 */
	static async findById(id) {
		const [article] = await db.query('SELECT * FROM article WHERE id = ?', [id]);

		let [images] = await db.query('SELECT id, url, article_id FROM image where article_id=?', [id]);
		images = images.map((image) => {
			return {
				id: image.id,
				url: image.url,
				article_id: image.article_id
			};
		});

		let [article_categories] = await db.query('SELECT category_id, name FROM article_category ac, category c where ac.category_id=c.id and article_id=?', [id]);
		article_categories = article_categories.map((article_category) => {
			return {
				category_id: article_category.category_id,
				name: article_category.name
			};
		});

		let seller = await User.findById(article[0].seller_id);

		return new Article(article[0].id, article[0].status, article[0].name, article[0].description, article[0].price, seller, article_categories, images);
	}

	/**
	 * Gets the next id for a new article.
	 * @returns {Promise<number>} The next id.
	 */
	static async nextId() {
		const [rows] = await db.query('SELECT MAX(id) AS max_id FROM article');
		return rows[0].max_id + 1;
	}

	/**
	 * Saves an article in the database.
	 * @returns {Promise<Article>} The saved article.
	 */
	async save() {
		await db.query('INSERT INTO article (id, status, name, description, price, seller_id) VALUES (?, ?, ?, ?, ?, ?)', [
			this.id,
			this.status,
			this.name,
			this.description,
			this.price,
			this.seller.id
		]);
		
		for (let i = 0; i < this.categories.length; i++) {
			const category = await Category.findByName(this.categories[i]);

			if (!category) {
				const cat_id = await nextId('category');
				await db.query('INSERT INTO category (id, name) VALUES (?, ?)', [cat_id, this.categories[i]]);
				await db.query('INSERT INTO article_category (article_id, category_id) VALUES (?, ?)', [this.id, cat_id]);
			} else {
				await db.query('INSERT INTO article_category (article_id, category_id) VALUES (?, ?)', [this.id, category.id]);
			}
		}
		for (let i = 0; i < this.images.length; i++) {
			await db.query('INSERT INTO image (url, article_id) VALUES (?, ?)', [this.images[i], this.id]);
		}
		return this;
	}

	/**
	 * Updates an article in the database.
	 * @returns {Promise<Article>} The updated article.
	 */
	async update() {
		await db.query('UPDATE article SET name = ?, description = ?, price = ? WHERE id = ?', [this.name, this.description, this.price, this.id]);
		return this;
	}

	/**
	 * Disables an article in the database.
	 * @returns {Promise<void>}
	 */
	async disable() {
		return await db.query('UPDATE article SET status = 0 WHERE id = ?', [this.id]);
	}

	/**
	 * Finds articles by a string, substring search
	 * @returns {Promise<Article[]>} The articles.
	 */
	static async findByName(name) {
		const [articles] = await db.query('SELECT * FROM article WHERE status = 1 AND name LIKE ?', ['%' + name + '%']);

		let [images] = await db.query('SELECT id, url, article_id FROM image');
		images = images.map((image) => {
			return {
				id: image.id,
				url: image.url,
				article_id: image.article_id
			};
		});

		let [categories] = await db.query('SELECT * FROM category');
		categories = categories.map((category) => {
			return {
				id: category.id,
				name: category.name
			};
		});

		let [article_categories] = await db.query('SELECT * FROM article_category');
		article_categories = article_categories.map((article_category) => {
			return {
				article_id: article_category.article_id,
				category_id: article_category.category_id
			};
		});

		return articles.map((article) => {
			const art_img = images.filter((image) => image.article_id === article.id);
			const art_categories = article_categories.filter((article_category) => article_category.article_id === article.id).map((article_category) => article_category.category_id);
			const cat = categories.filter((category) => art_categories.includes(category.id));

			let seller = User.findById(article.seller_id);
			return new Article(article.id, article.status, article.name, article.description, article.price, seller, cat, art_img);
		});
	}
}
