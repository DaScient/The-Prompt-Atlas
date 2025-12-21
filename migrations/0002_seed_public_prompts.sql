INSERT OR REPLACE INTO categories (id, name) VALUES
  ('business','Business & Strategy'),
  ('science','Science & Discovery'),
  ('writing','Writing & Expression'),
  ('engineering','Engineering Toolbelt');

INSERT OR REPLACE INTO prompts (id, title, body, category, tags, visibility, source, license, created_at, updated_at)
VALUES
  ('pa_public_business_001','Regenerative Consumption Economy',
   'Simulate an economy where every act of consumption generates ecological repair.',
   'business','economics,regeneration,systems','public','Prompt Atlas (App Seed)','All rights reserved', strftime('%s','now')*1000, strftime('%s','now')*1000),

  ('pa_public_business_002','Biodiversity-Reward Tax System',
   'Design a taxation system where companies are rewarded for biodiversity restoration.',
   'business','policy,biodiversity,incentives','public','Prompt Atlas (App Seed)','All rights reserved', strftime('%s','now')*1000, strftime('%s','now')*1000),

  ('pa_public_business_003','AI-Managed Corporation Ethics',
   'Imagine a corporation managed entirely by AI—how does it maintain ethics and profit?',
   'business','governance,ethics,ai','public','Prompt Atlas (App Seed)','All rights reserved', strftime('%s','now')*1000, strftime('%s','now')*1000),

  ('pa_public_business_004','Quantum Markets Forecast',
   'Forecast how quantum computing will reshape global financial markets in 10 years.',
   'business','quantum,finance,forecasting','public','Prompt Atlas (App Seed)','All rights reserved', strftime('%s','now')*1000, strftime('%s','now')*1000),

  ('pa_public_business_005','Open Source as Commodity',
   'Propose business models where open-source knowledge is the most valuable commodity.',
   'business','open-source,models,value','public','Prompt Atlas (App Seed)','All rights reserved', strftime('%s','now')*1000, strftime('%s','now')*1000);
