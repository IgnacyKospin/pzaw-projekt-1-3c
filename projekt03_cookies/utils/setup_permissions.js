import db from '../models/database.js';
/**
 * THIS IS NECCESSARY FOR AUTHORISATION TO WORK. STRICTLy. VERY. IMPERATIVE EVEN.
 */
const establish_goods_department = `INSERT INTO meta_departments(department_name, key) VALUES ('Resource Accounting', 'resource_accounting'), ('Process Administration', 'process_administration'), ('Urban Planning', 'urban_planning'), ('Economic Management', 'economic_management')`;

const establish_links_to_categories = `INSERT INTO meta_department_relations VALUES 
('resource_accounting', 'goods'), 
('process_administration', 'production_methods'), 
('urban_planning', 'population_centres'), 
('economic_management', 'population_centres'),
('economic_management', 'goods')`

db.exec(establish_goods_department);
db.exec(establish_links_to_categories);