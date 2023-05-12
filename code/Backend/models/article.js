import db from './db.js';
import Category from './category.js';

export default class Article {
	constructor(id, status, name, description, price, seller_id, categories, images) {
		this.id = id;
		this.status = status;
		this.name = name;
		this.description = description;
		this.price = price;
		this.seller_id = seller_id;
		this.categories=categories;
		this.images=images;
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
        
		return articles.map((article) => {
			const art_img = images.filter((image) => image.article_id === article.id);
			const art_categories = article_categories.filter((article_category) => article_category.article_id === article.id).map((article_category) => article_category.category_id);
			const cat = categories.filter((category) => art_categories.includes(category.id));
			return new Article(article.id, article.status, article.name, article.description, article.price, article.seller_id, cat, art_img);
		});
	}   

	/**
	 * Finds an article by id.
	 * @returns {Promise<Article>} The article.
	 */
	static async findById(id) {
		const [rows] = await db.query('SELECT * FROM article WHERE id = ?', [id]);
		return new Article(rows[0].id, rows[0].status, rows[0].name, rows[0].description, rows[0].price, rows[0].seller_id);
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
		await db.query('INSERT INTO article (id, status, name, description, price, seller_id) VALUES (?, ?, ?, ?, ?, ?)', [this.id, this.status, this.name, this.description, this.price, this.seller_id]);
		
		for (let i = 0; i < this.categories.length; i++) {
			const cat_name=await Category.findByName(this.categories[i].name);
			console.log(cat_name);
			await db.query('INSERT INTO article_category (article_id, category_id) VALUES (?, ?)', [this.id, cat_name.id]);
		}

		for (let i = 0; i < this.images.length; i++) {
			await db.query('INSERT INTO image (url, article_id) VALUES (?, ?)', [this.images[i].url,this.id]);
		}
		return this;
	}

	/**
	 * Updates an article in the database.
	 * @returns {Promise<Article>} The updated article.
	 */
	async update() {
		await db.query('UPDATE article SET name = ?, status = ?, description = ?, price = ?, seller_id = ? WHERE id = ?', [this.name, this.status, this.description, this.price, this.seller_id, this.id]);
		return this;
	}

	/**
	 * Disables an article in the database.
	 * @returns {Promise<void>}
	 */
	async disable() {
		return await db.query('UPDATE article SET status = 0 WHERE id = ?', [this.id]);
	}
}
