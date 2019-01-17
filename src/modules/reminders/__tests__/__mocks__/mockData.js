export const reminderTemplates = [
  {
    id: 300,
    name: 'Visa reminder',
    from: 'test.admin@andela.com',
    subject: 'Visa expiring',
    message: 'Your visa will soon expire',
    createdBy: '-LMIzC-bCc10w7Uqc7-B'
  },
  {
    id: 301,
    name: 'Passport reminder',
    from: 'test.admin@andela.com',
    subject: 'Passport expiring',
    message: 'Your passport is about to expire',
    createdBy: '-LMIzC-bCc10w7Uqc7-B'
  },
];

export const reminderPayload = {
  conditionName: 'Travel Readiness reminder',
  documentType: 'Passport',
  reminders: [{
    frequency: '2 Weeks',
    reminderEmailTemplateId: '300'
  },
  {
    frequency: '5 Days',
    reminderEmailTemplateId: '301'
  }
  ]
};

export const reminderPayloadWithInvalidTemplate = {
  conditionName: 'Travel Readiness reminder',
  documentType: 'Passport',
  reminders: [{
    frequency: '2 Weeks',
    reminderEmailTemplateId: '999'
  },
  {
    frequency: '5 Days',
    reminderEmailTemplateId: '1000'
  }
  ]
};

export const reminderPayloadWithoutTemplate = {
  conditionName: 'Travel Readiness reminder',
  documentType: 'Passport',
  reminders: [{
    frequency: '2 Weeks',
  },
  ]
};

export const reminderPayloadWithoutConditionName = {
  documentType: 'Passport',
  reminders: [{
    frequency: '2 Weeks',
    reminderEmailTemplateId: '300'
  },
  {
    frequency: '5 Days',
    reminderEmailTemplateId: '301'
  }
  ]
};

export const reminderPayloadWithInvalidDocumentType = {
  conditionName: 'Travel Readiness reminder',
  documentType: 'Certificate',
  reminders: [{
    frequency: '2 Weeks',
    reminderEmailTemplateId: '300'
  },
  {
    frequency: '5 Days',
    reminderEmailTemplateId: '301'
  }
  ]
};

export const reminderPayloadWithInvalidFrequency = {
  conditionName: 'Travel Readiness reminder',
  documentType: 'Passport',
  reminders: [{
    frequency: '1 Weeks',
    reminderEmailTemplateId: '300'
  },
  {
    frequency: '3 minutes',
    reminderEmailTemplateId: '301'
  }
  ]
};
