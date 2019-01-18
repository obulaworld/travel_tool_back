module.exports = {
  up: queryInterface => Promise.all([
    queryInterface.removeConstraint(
      'ReminderEmailTemplates', 'ReminderEmailTemplates_createdBy_fkey'
    ),
    queryInterface.sequelize.query(
      `ALTER TABLE "ReminderEmailTemplates" alter column "createdBy" 
          TYPE INTEGER USING "createdBy"::integer`
    ),
    queryInterface.sequelize.query(
      `ALTER TABLE "ReminderEmailTemplates" ADD CONSTRAINT "ReminderEmailTemplates_createdBy_fkey"
      FOREIGN KEY ("createdBy") REFERENCES "Users"(id) 
      ON DELETE CASCADE;`
    )
  ]),
  down: queryInterface => Promise.all([
    queryInterface.removeConstraint(
      'ReminderEmailTemplates', 'ReminderEmailTemplates_createdBy_fkey'
    ),
    queryInterface.sequelize.query(
      `ALTER TABLE "ReminderEmailTemplates" alter column "createdBy" 
          TYPE TEXT`
    ),
    queryInterface.sequelize.query(
      `ALTER TABLE "ReminderEmailTemplates" ADD CONSTRAINT "ReminderEmailTemplates_createdBy_fkey"
      FOREIGN KEY ("createdBy") REFERENCES "Users"("userId")
      ON DELETE CASCADE;`
    )
  ])
};
