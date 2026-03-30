import db from '../models/database.js';
/**
 * THIS IS NECCESSARY FOR AUTHORISATION TO WORK. STRICTLy. VERY. IMPERATIVE EVEN.
 */
const establish_goods_department = `INSERT INTO meta_departments(department_name) VALUES ('Resource Accounting'), ('Process Administration'), ('Urban Planning'), ('Economic Management')`;

const establish_links_to_categories = `INSERT INTO meta_department_relations VALUES 
('Resource Accounting', 'goods'), 
('Process Administration', 'production_methods'), 
('Urban Planning', 'population_centres'), 
('Economic Management', 'population_centres'),
('Economic Management', 'goods')`

db.exec(establish_goods_department);
db.exec(establish_links_to_categories);