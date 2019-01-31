export const reminderTemplates = [
  {
    id: 300,
    name: 'Visa reminder',
    from: 'test.admin@andela.com',
    subject: 'Visa expiring',
    message: 'Your visa will soon expire',
    createdBy: 8379
  },
  {
    id: 301,
    name: 'Passport reminder',
    from: 'test.admin@andela.com',
    subject: 'Passport expiring',
    message: 'Your passport is about to expire',
    createdBy: 8379
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

export const duplicateFrequencyReminder = {
  conditionName: 'Travel Readiness reminder with duplicate frequency',
  documentType: 'Passport',
  reminders: [{
    frequency: '2 Weeks',
    reminderEmailTemplateId: '300'
  },
  {
    frequency: '2 Weeks',
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

export const reminderPayloadTwo = {
  condition: {
    conditionName: 'Passport renewal reminder',
    documentType: 'Passport',
  },
  reminders: [
    {
      frequency: '2 Weeks',
      id: 50,
      reminderEmailTemplateId: '300'
    },
    {
      frequency: '5 Days',
      id: 200,
      reminderEmailTemplateId: '301'
    }
  ]
};

export const updateReminderPayloads = {
  getReminderToUpdateOne: (reminderId1, reminderId2, {
    conditionName,
    documentType,
    frequency1,
    frequency2
  }) => ({
    conditionName,
    documentType,
    reminders: [{
      frequency: frequency1,
      id: reminderId1,
      reminderEmailTemplateId: '300'
    },
    {
      frequency: frequency2,
      id: reminderId2,
      reminderEmailTemplateId: '301'
    }
    ]
  }),

  addNewFrequency: (reminderId1, reminderId2, {
    conditionName,
    documentType,
    frequency1,
    frequency2
  }) => ({
    conditionName,
    documentType,
    reminders: [{
      frequency: frequency1,
      id: reminderId1,
      reminderEmailTemplateId: '300'
    },
    {
      frequency: frequency2,
      id: reminderId2,
      reminderEmailTemplateId: '301'
    },
    {
      frequency: '15 Weeks',
      reminderEmailTemplateId: '301'
    }
    ]
  }),

  singleFrequency: id => ({
    conditionName: 'Visa readiness',
    documentType: 'Passport',
    reminders: [{
      frequency: '11 Weeks',
      id,
      reminderEmailTemplateId: '300'
    }
    ]
  }),
};
