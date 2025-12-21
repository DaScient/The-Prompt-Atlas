-- Bootstrap initial categories
INSERT OR IGNORE INTO categories (id, name, sort) VALUES
('science', 'Science & Discovery', 10),
('business', 'Business & Strategy', 20),
('writing', 'Writing & Expression', 30),
('engineering', 'Engineering Toolbelt', 40);

-- Bootstrap a few sample prompts
INSERT OR IGNORE INTO prompts (id, title, body, category, tags) VALUES
('p_science_1',
 'Habits of Scientific Inquiry',
 'Describe the core habits that define scientific inquiry and how they improve reasoning.',
 'science',
 'science,inquiry,reasoning'),
('p_business_1',
 'Regenerative Business Model',
 'Outline a business model focused on ecological regeneration and measurable impact.',
 'business',
 'business,regenerative,impact'),
('p_writing_1',
 'Poetic Economy',
 'Compose a short poetic reflection on economy as a living system.',
 'writing',
 'writing,poetry,reflection'),
('p_engineering_1',
 'Edge Optimization',
 'Explain architectural considerations for edge-native API performance.',
 'engineering',
 'engineering,performance,edge');
